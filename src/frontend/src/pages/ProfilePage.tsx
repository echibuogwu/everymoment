import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  Edit2,
  ExternalLink,
  LogIn,
  MapPin,
  Plus,
  Trash2,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { AuthGuard } from "../components/AuthGuard";
import { EmptyState } from "../components/EmptyState";
import { Layout } from "../components/Layout";
import { MomentCard } from "../components/MomentCard";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import { useRequireAuth } from "../hooks/use-require-auth";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import type {
  MomentListItem,
  PaymentDetail,
  SaveProfileInput,
  SocialLink,
  UserProfilePublic,
} from "../types";

// ── Edit Form State ───────────────────────────────────────────────────────────

let _uidCounter = 0;
const nextUid = () => `uid-${++_uidCounter}`;

interface SocialEntry extends SocialLink {
  _uid: string;
}
interface PaymentEntry extends PaymentDetail {
  _uid: string;
}

interface EditState {
  name: string;
  username: string;
  location: string;
  socials: SocialEntry[];
  paymentDetails: PaymentEntry[];
  photoFile: File | null;
  photoPreview: string | null;
}

function initEditState(user: UserProfilePublic): EditState {
  return {
    name: user.name ?? "",
    username: user.username,
    location: user.location ?? "",
    socials: user.socials
      ? user.socials.map((s) => ({ ...s, _uid: nextUid() }))
      : [],
    paymentDetails: user.paymentDetails
      ? user.paymentDetails.map((d) => ({ ...d, _uid: nextUid() }))
      : [],
    photoFile: null,
    photoPreview: null,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SocialLinksView({ socials }: { socials: SocialLink[] }) {
  if (!socials.length) return null;
  return (
    <div className="form-section space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Socials
      </h3>
      <div className="space-y-2">
        {socials.map((s, i) => (
          <a
            key={`${s.name}-${i}`}
            href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="list-item hover:border-primary/40 transition-smooth group"
            data-ocid={`profile.social.item.${i + 1}`}
          >
            <span className="text-sm font-medium text-foreground">
              {s.name}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-smooth">
              <span className="text-xs truncate max-w-[140px]">{s.url}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function PaymentDetailsView({ details }: { details: PaymentDetail[] }) {
  if (!details.length) return null;
  return (
    <div className="form-section space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Payment Details
      </h3>
      <div className="space-y-2">
        {details.map((d, i) => (
          <div
            key={`${d.name}-${i}`}
            className="list-item"
            data-ocid={`profile.payment.item.${i + 1}`}
          >
            <span className="text-sm font-medium text-foreground">
              {d.name}
            </span>
            <span className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Edit Form ─────────────────────────────────────────────────────────────────

interface EditFormProps {
  state: EditState;
  onChange: (s: EditState) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  currentUsername: string;
}

function EditForm({
  state,
  onChange,
  onSave,
  onCancel,
  isSaving,
  currentUsername,
}: EditFormProps) {
  const { actor } = useBackend();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const set = useCallback(
    (patch: Partial<EditState>) => onChange({ ...state, ...patch }),
    [state, onChange],
  );

  // Social helpers
  const addSocial = () => {
    if (state.socials.length >= 5) return;
    set({
      socials: [...state.socials, { name: "", url: "", _uid: nextUid() }],
    });
  };
  const removeSocial = (i: number) =>
    set({ socials: state.socials.filter((_, idx) => idx !== i) });
  const updateSocial = (i: number, field: keyof SocialLink, value: string) => {
    const updated = state.socials.map((s, idx) =>
      idx === i ? { ...s, [field]: value } : s,
    );
    set({ socials: updated });
  };

  // Payment helpers
  const addPayment = () => {
    if (state.paymentDetails.length >= 10) return;
    set({
      paymentDetails: [
        ...state.paymentDetails,
        { name: "", value: "", _uid: nextUid() },
      ],
    });
  };
  const removePayment = (i: number) =>
    set({ paymentDetails: state.paymentDetails.filter((_, idx) => idx !== i) });
  const updatePayment = (
    i: number,
    field: keyof PaymentDetail,
    value: string,
  ) => {
    const updated = state.paymentDetails.map((d, idx) =>
      idx === i ? { ...d, [field]: value } : d,
    );
    set({ paymentDetails: updated });
  };

  // Username validation
  const handleUsernameBlur = async () => {
    const val = state.username.trim();
    if (!val || val === currentUsername) {
      setUsernameError(null);
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(val)) {
      setUsernameError("3–30 characters, letters, numbers, underscores only");
      return;
    }
    if (!actor) return;
    setCheckingUsername(true);
    try {
      const taken = await actor.isUsernameTaken(val);
      setUsernameError(taken ? "Username is already taken" : null);
    } catch {
      setUsernameError(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    set({ photoFile: file, photoPreview: url });
  };

  const canSave =
    !usernameError && !checkingUsername && state.username.trim().length >= 3;

  return (
    <div className="space-y-4" data-ocid="profile.edit_form">
      {/* Photo */}
      <div className="form-section">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Profile Photo
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              {state.photoPreview ? (
                <AvatarImage src={state.photoPreview} alt="Preview" />
              ) : null}
              <AvatarFallback className="font-display font-bold text-xl bg-secondary text-secondary-foreground">
                {state.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => photoInputRef.current?.click()}
              className="tap-target"
              data-ocid="profile.photo_upload_button"
            >
              Change photo
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or WebP
            </p>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
            data-ocid="profile.photo_input"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="form-section space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Basic Info
        </h3>
        <div className="space-y-1.5">
          <Label htmlFor="edit-name" className="text-sm font-medium">
            Display Name
          </Label>
          <Input
            id="edit-name"
            value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Your name"
            className="bg-background"
            data-ocid="profile.name_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="edit-username"
            value={state.username}
            onChange={(e) => set({ username: e.target.value })}
            onBlur={handleUsernameBlur}
            placeholder="username"
            className="bg-background"
            data-ocid="profile.username_input"
          />
          {usernameError && (
            <p
              className="text-xs text-destructive"
              data-ocid="profile.username_field_error"
            >
              {usernameError}
            </p>
          )}
          {checkingUsername && (
            <p className="text-xs text-muted-foreground">Checking…</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="edit-location"
            value={state.location}
            onChange={(e) => set({ location: e.target.value })}
            placeholder="City, Country"
            className="bg-background"
            data-ocid="profile.location_input"
          />
        </div>
      </div>

      {/* Socials */}
      <div className="form-section space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Socials
          </h3>
          {state.socials.length < 5 && (
            <button
              type="button"
              onClick={addSocial}
              className="add-button flex items-center gap-1"
              data-ocid="profile.add_social_button"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
        {state.socials.length === 0 ? (
          <p className="text-sm text-muted-foreground py-1">
            No socials added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {state.socials.map((s, i) => (
              <div
                key={s._uid}
                className="flex items-center gap-2"
                data-ocid={`profile.social_row.${i + 1}`}
              >
                <Input
                  value={s.name}
                  onChange={(e) => updateSocial(i, "name", e.target.value)}
                  placeholder="Platform (e.g. Twitter)"
                  className="bg-background flex-1 min-w-0"
                  data-ocid={`profile.social_name.${i + 1}`}
                />
                <Input
                  value={s.url}
                  onChange={(e) => updateSocial(i, "url", e.target.value)}
                  placeholder="URL"
                  className="bg-background flex-1 min-w-0"
                  data-ocid={`profile.social_url.${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeSocial(i)}
                  className="list-item-remove flex-shrink-0 text-destructive/70 hover:text-destructive"
                  data-ocid={`profile.remove_social.${i + 1}`}
                  aria-label="Remove social"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="form-section space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Payment Details
          </h3>
          {state.paymentDetails.length < 10 && (
            <button
              type="button"
              onClick={addPayment}
              className="add-button flex items-center gap-1"
              data-ocid="profile.add_payment_button"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Add any payment method — PayPal, Revolut, Bitcoin, ETH wallet, etc.
        </p>
        {state.paymentDetails.length === 0 ? (
          <p className="text-sm text-muted-foreground py-1">
            No payment details added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {state.paymentDetails.map((d, i) => (
              <div
                key={d._uid}
                className="flex items-center gap-2"
                data-ocid={`profile.payment_row.${i + 1}`}
              >
                <Input
                  value={d.name}
                  onChange={(e) => updatePayment(i, "name", e.target.value)}
                  placeholder="Type (e.g. Bitcoin)"
                  className="bg-background flex-[0.6] min-w-0"
                  data-ocid={`profile.payment_name.${i + 1}`}
                />
                <Input
                  value={d.value}
                  onChange={(e) => updatePayment(i, "value", e.target.value)}
                  placeholder="Address / link / tag"
                  className="bg-background flex-1 min-w-0"
                  data-ocid={`profile.payment_value.${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removePayment(i)}
                  className="list-item-remove flex-shrink-0 text-destructive/70 hover:text-destructive"
                  data-ocid={`profile.remove_payment.${i + 1}`}
                  aria-label="Remove payment detail"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save / Cancel */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="flex-1 tap-target"
          data-ocid="profile.save_button"
        >
          {isSaving ? (
            "Saving…"
          ) : (
            <>
              <Check className="w-4 h-4 mr-1.5" /> Save changes
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="tap-target"
          data-ocid="profile.cancel_button"
        >
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { actor } = useBackend();
  const { principal, isAuthenticated, isLoggingIn } = useAuth();
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);

  const profileQuery = useQuery<UserProfilePublic | null>({
    queryKey: QUERY_KEYS.userProfileByUsername(username),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfileByUsername(username);
    },
    enabled: actor !== null,
  });

  const user = profileQuery.data ?? null;
  const isOwnProfile =
    !!user && !!principal && user.id.toText() === principal.toText();

  const momentsQuery = useQuery<MomentListItem[]>({
    queryKey: QUERY_KEYS.momentsForUser(user?.id.toText() ?? ""),
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getMomentsForUser(user.id);
    },
    enabled: !!actor && !!user,
  });

  const isFollowingQuery = useQuery<boolean>({
    queryKey: QUERY_KEYS.isFollowing(user?.id.toText() ?? ""),
    queryFn: async () => {
      if (!actor || !user || isOwnProfile) return false;
      return actor.isFollowingUser(user.id);
    },
    enabled: isAuthenticated && !!actor && !!user && !isOwnProfile,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !user) throw new Error("Not connected");
      if (isFollowingQuery.data) {
        await actor.unfollowUser(user.id);
      } else {
        await actor.followUser(user.id);
      }
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.isFollowing(user.id.toText()),
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.userProfileByUsername(username),
      });
      showSuccess(isFollowingQuery.data ? "Unfollowed" : "Now following!");
    },
    onError: () => showError("Action failed. Try again."),
  });

  const saveMutation = useMutation({
    mutationFn: async (state: EditState) => {
      if (!actor) throw new Error("Not connected");
      const input: SaveProfileInput = {
        username: state.username.trim(),
        name: state.name.trim() || undefined,
        location: state.location.trim() || undefined,
        socials:
          state.socials.filter((s) => s.name && s.url).length > 0
            ? state.socials
                .filter((s) => s.name && s.url)
                .map(({ name, url }) => ({ name, url }))
            : undefined,
        paymentDetails:
          state.paymentDetails.filter((d) => d.name && d.value).length > 0
            ? state.paymentDetails
                .filter((d) => d.name && d.value)
                .map(({ name, value }) => ({ name, value }))
            : undefined,
        photo: state.photoFile
          ? ExternalBlob.fromBytes(
              new Uint8Array(await state.photoFile.arrayBuffer()),
            )
          : undefined,
      };
      await actor.saveCallerUserProfile(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.userProfileByUsername(username),
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.callerProfile,
      });
      setIsEditing(false);
      setEditState(null);
      showSuccess("Profile saved!");
    },
    onError: () => showError("Could not save profile. Try again."),
  });

  const handleEditStart = () => {
    if (!user) return;
    setEditState(initEditState(user));
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editState) saveMutation.mutate(editState);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditState(null);
  };

  return (
    <AuthGuard requireAuth={false} currentPath={`/profile/${username}`}>
      <Layout>
        <div className="py-4 space-y-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/explore" })}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tap-target -ml-1"
            data-ocid="profile.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-body">Back</span>
          </button>

          {profileQuery.isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="w-32 h-5 rounded" />
                  <Skeleton className="w-24 h-4 rounded" />
                </div>
              </div>
              <Skeleton className="w-full h-24 rounded-lg" />
            </div>
          ) : !user ? (
            <EmptyState
              title="User not found"
              description="This profile doesn't exist."
            />
          ) : (
            <>
              {/* Profile header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    {user.photo && (
                      <AvatarImage
                        src={user.photo.getDirectURL()}
                        alt={user.username}
                      />
                    )}
                    <AvatarFallback className="font-display font-bold text-xl bg-secondary text-secondary-foreground">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    {user.name && (
                      <p className="font-display font-bold text-xl text-foreground truncate">
                        {user.name}
                      </p>
                    )}
                    <p
                      className={`font-body text-muted-foreground truncate ${user.name ? "text-sm" : "font-display font-bold text-xl text-foreground"}`}
                    >
                      @{user.username}
                    </p>
                    {user.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {user.location}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-4 mt-1.5">
                      <span className="text-sm text-muted-foreground font-body">
                        <span className="font-semibold text-foreground">
                          {user.followersCount.toString()}
                        </span>{" "}
                        followers
                      </span>
                      <span className="text-sm text-muted-foreground font-body">
                        <span className="font-semibold text-foreground">
                          {user.followingCount.toString()}
                        </span>{" "}
                        following
                      </span>
                    </div>
                  </div>
                </div>

                {isOwnProfile ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEditStart}
                    className="tap-target flex-shrink-0 gap-1.5"
                    data-ocid="profile.edit_button"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                ) : isAuthenticated ? (
                  <Button
                    size="sm"
                    variant={isFollowingQuery.data ? "outline" : "default"}
                    onClick={() => followMutation.mutate()}
                    disabled={
                      followMutation.isPending || isFollowingQuery.isLoading
                    }
                    className="tap-target flex-shrink-0"
                    data-ocid="profile.follow_button"
                  >
                    {isFollowingQuery.data ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-1" /> Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" /> Follow
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => requireAuth(() => {})}
                    disabled={isLoggingIn}
                    className="tap-target flex-shrink-0 gap-1.5"
                    data-ocid="profile.signin_button"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {isLoggingIn ? "Signing in…" : "Sign in to follow"}
                  </Button>
                )}
              </div>

              {/* Edit form (own profile) */}
              {isEditing && editState ? (
                <EditForm
                  state={editState}
                  onChange={setEditState}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  isSaving={saveMutation.isPending}
                  currentUsername={user.username}
                />
              ) : (
                <>
                  {/* Read-only socials + payment details */}
                  {user.socials && user.socials.length > 0 && (
                    <SocialLinksView socials={user.socials} />
                  )}
                  {user.paymentDetails && user.paymentDetails.length > 0 && (
                    <PaymentDetailsView details={user.paymentDetails} />
                  )}
                </>
              )}

              {/* Moments grid */}
              {!isEditing && (
                <div>
                  <h2 className="font-display font-semibold text-lg text-foreground mb-4">
                    Moments
                  </h2>
                  {momentsQuery.isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="w-full h-52 rounded-lg" />
                      ))}
                    </div>
                  ) : momentsQuery.data?.length === 0 ? (
                    <EmptyState
                      icon={Calendar}
                      title="No moments yet"
                      description="This user hasn't created any moments."
                    />
                  ) : (
                    <div className="space-y-4">
                      {momentsQuery.data?.map((moment) => (
                        <MomentCard
                          key={moment.id.toString()}
                          moment={moment}
                          onClick={() =>
                            navigate({
                              to: "/moments/$momentId",
                              params: { momentId: moment.id.toString() },
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
