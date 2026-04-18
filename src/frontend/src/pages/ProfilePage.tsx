import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
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
import { motion, useScroll, useTransform } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { AuthGuard } from "../components/AuthGuard";
import { EmptyState } from "../components/EmptyState";
import { Layout } from "../components/Layout";
import { MomentCard } from "../components/MomentCard";
import { useAuth } from "../hooks/use-auth";
import {
  useBackend,
  useBookmarkMoment,
  useBookmarks,
  useIsBookmarked,
  useUnbookmarkMoment,
} from "../hooks/use-backend";
import { useRequireAuth } from "../hooks/use-require-auth";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import type {
  MomentId,
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
  hideAttendingList: boolean;
  isPrivateProfile: boolean;
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
    hideAttendingList: user.hideAttendingList,
    isPrivateProfile: user.isPrivateProfile,
  };
}

// ── Socials View ──────────────────────────────────────────────────────────────

function SocialLinksView({ socials }: { socials: SocialLink[] }) {
  if (!socials.length) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Socials
      </h3>
      <div className="flex flex-wrap gap-2">
        {socials.map((s, i) => (
          <a
            key={`${s.name}-${i}`}
            href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-foreground hover:ring-1 hover:ring-accent/40 transition-smooth group"
            data-ocid={`profile.social.item.${i + 1}`}
          >
            <span>{s.name}</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-smooth" />
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Payment Details View ──────────────────────────────────────────────────────

function PaymentDetailsView({ details }: { details: PaymentDetail[] }) {
  if (!details.length) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Payment Details
      </h3>
      <div className="space-y-2">
        {details.map((d, i) => (
          <div
            key={`${d.name}-${i}`}
            className="glass-card flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl"
            data-ocid={`profile.payment.item.${i + 1}`}
          >
            <span className="text-sm font-semibold text-foreground">
              {d.name}
            </span>
            <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
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
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.34, 1.3, 0.64, 1] }}
      className="space-y-4 animate-slide-down"
      data-ocid="profile.edit_form"
    >
      {/* Photo */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Profile Photo
        </h3>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 ring-2 ring-white/30 shadow-lg glow-accent-sm">
            {state.photoPreview ? (
              <AvatarImage src={state.photoPreview} alt="Preview" />
            ) : null}
            <AvatarFallback className="font-display font-bold text-xl bg-secondary text-secondary-foreground">
              {state.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => photoInputRef.current?.click()}
              className="glass-card border-white/20 tap-target"
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
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Basic Info
        </h3>
        <div className="space-y-1.5">
          <Label
            htmlFor="edit-name"
            className="text-sm font-medium text-foreground"
          >
            Display Name
          </Label>
          <Input
            id="edit-name"
            value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Your name"
            className="glass-input rounded-xl border-white/20 bg-transparent"
            data-ocid="profile.name_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="edit-username"
            className="text-sm font-medium text-foreground"
          >
            Username
          </Label>
          <Input
            id="edit-username"
            value={state.username}
            onChange={(e) => set({ username: e.target.value })}
            onBlur={handleUsernameBlur}
            placeholder="username"
            className="glass-input rounded-xl border-white/20 bg-transparent"
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
          <Label
            htmlFor="edit-location"
            className="text-sm font-medium text-foreground"
          >
            Location
          </Label>
          <Input
            id="edit-location"
            value={state.location}
            onChange={(e) => set({ location: e.target.value })}
            placeholder="City, Country"
            className="glass-input rounded-xl border-white/20 bg-transparent"
            data-ocid="profile.location_input"
          />
        </div>
      </div>

      {/* Socials */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Socials
          </h3>
          {state.socials.length < 5 && (
            <button
              type="button"
              onClick={addSocial}
              className="flex items-center gap-1 px-3 py-1.5 glass-card rounded-full text-xs font-medium text-accent hover:ring-1 hover:ring-accent/40 transition-smooth"
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
                  placeholder="Platform"
                  className="glass-input rounded-xl border-white/20 bg-transparent flex-1 min-w-0"
                  data-ocid={`profile.social_name.${i + 1}`}
                />
                <Input
                  value={s.url}
                  onChange={(e) => updateSocial(i, "url", e.target.value)}
                  placeholder="URL"
                  className="glass-input rounded-xl border-white/20 bg-transparent flex-1 min-w-0"
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
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Payment Details
          </h3>
          {state.paymentDetails.length < 10 && (
            <button
              type="button"
              onClick={addPayment}
              className="flex items-center gap-1 px-3 py-1.5 glass-card rounded-full text-xs font-medium text-accent hover:ring-1 hover:ring-accent/40 transition-smooth"
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
                  className="glass-input rounded-xl border-white/20 bg-transparent flex-[0.6] min-w-0"
                  data-ocid={`profile.payment_name.${i + 1}`}
                />
                <Input
                  value={d.value}
                  onChange={(e) => updatePayment(i, "value", e.target.value)}
                  placeholder="Address / link / tag"
                  className="glass-input rounded-xl border-white/20 bg-transparent flex-1 min-w-0"
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

      {/* Privacy Settings */}
      <div
        className="glass-card rounded-2xl p-4 space-y-4"
        data-ocid="profile.privacy_settings"
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Privacy Settings
        </h3>

        {/* Private profile toggle */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Label
              htmlFor="toggle-private-profile"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Private profile
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              When on, only your followers can see your full profile, bio,
              socials, and moments. Others only see your name and avatar.
            </p>
          </div>
          <Switch
            id="toggle-private-profile"
            checked={state.isPrivateProfile}
            onCheckedChange={(val) => set({ isPrivateProfile: val })}
            data-ocid="profile.private_profile_toggle"
          />
        </div>

        {/* Hide attending list toggle */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Label
              htmlFor="toggle-hide-attending"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Hide attending list
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              When on, the moments you're attending won't appear on your public
              profile page. Your own calendar view is unaffected.
            </p>
          </div>
          <Switch
            id="toggle-hide-attending"
            checked={state.hideAttendingList}
            onCheckedChange={(val) => set({ hideAttendingList: val })}
            data-ocid="profile.hide_attending_toggle"
          />
        </div>
      </div>

      {/* Save / Cancel */}
      <div className="flex gap-3 pt-2">
        <motion.div
          className="flex-1"
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Button
            type="button"
            onClick={onSave}
            disabled={!canSave || isSaving}
            className="w-full tap-target rounded-2xl bg-accent text-accent-foreground hover:opacity-90"
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
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="tap-target glass-card border-white/20 rounded-2xl"
            data-ocid="profile.cancel_button"
          >
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Bookmark toggle button (for moment cards in profile) ──────────────────────

function BookmarkButton({
  momentId,
  className,
}: {
  momentId: MomentId;
  className?: string;
}) {
  const { data: isBookmarked } = useIsBookmarked(momentId);
  const { mutate: bookmark, isPending: isBookmarking } = useBookmarkMoment();
  const { mutate: unbookmark, isPending: isUnbookmarking } =
    useUnbookmarkMoment();

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      unbookmark(momentId);
    } else {
      bookmark(momentId);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isBookmarking || isUnbookmarking}
      className={`p-1.5 rounded-full transition-smooth hover:bg-accent/10 ${className ?? ""}`}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark moment"}
      data-ocid="moment-card.bookmark_button"
    >
      <Bookmark
        className={`w-4 h-4 ${isBookmarked ? "fill-accent text-accent" : "text-muted-foreground"}`}
      />
    </button>
  );
}

// ── Profile Loading Skeleton ──────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div>
      {/* Banner skeleton */}
      <div className="h-48 w-full animate-shimmer rounded-none" />
      <div className="px-4 pb-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-12 mb-4">
          <Skeleton className="w-24 h-24 rounded-full ring-4 ring-background" />
        </div>
        {/* Name + username */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <Skeleton className="w-40 h-6 rounded-lg" />
          <Skeleton className="w-28 h-4 rounded-lg" />
        </div>
        {/* Stats row */}
        <Skeleton className="w-full h-16 rounded-2xl mb-6" />
        {/* Content */}
        <div className="space-y-3">
          <Skeleton className="w-full h-10 rounded-xl" />
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Stats Pill ────────────────────────────────────────────────────────────────

function StatItem({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
      <span className="text-gradient-accent font-display font-bold text-lg leading-tight">
        {value}
      </span>
      <span className="text-xs text-muted-foreground font-body">{label}</span>
    </div>
  );
}

// ── Saved Tab (own profile only) ──────────────────────────────────────────────

function SavedTab() {
  const { actor } = useBackend();
  const { data: bookmarkIds = [], isLoading: isLoadingIds } = useBookmarks();
  const navigate = useNavigate();

  const { data: moments = [], isLoading: isLoadingMoments } = useQuery<
    MomentListItem[]
  >({
    queryKey: ["savedMomentDetails", bookmarkIds],
    queryFn: async () => {
      if (!actor || bookmarkIds.length === 0) return [];
      const results = await Promise.allSettled(
        bookmarkIds.map((id) => actor.getMomentDetail(id)),
      );
      return results
        .filter(
          (
            r,
          ): r is PromiseFulfilledResult<
            Awaited<ReturnType<typeof actor.getMomentDetail>>
          > => r.status === "fulfilled" && r.value !== null,
        )
        .map((r) => r.value as unknown as MomentListItem);
    },
    enabled: !!actor && bookmarkIds.length > 0,
  });

  const isLoading = isLoadingIds || isLoadingMoments;

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        data-ocid="profile.saved.loading_state"
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-full h-52 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (moments.length === 0) {
    return (
      <div
        className="glass-card rounded-2xl p-8 flex flex-col items-center"
        data-ocid="profile.saved.empty_state"
      >
        <EmptyState
          icon={Bookmark}
          title="No saved moments yet"
          description="Bookmark moments to find them here later."
        />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      data-ocid="profile.saved.list"
    >
      {moments.map((moment, index) => (
        <div
          key={moment.id.toString()}
          className="relative"
          data-ocid={`profile.saved.item.${index + 1}`}
        >
          <MomentCard
            moment={moment}
            onClick={() =>
              navigate({
                to: "/moments/$momentId",
                params: { momentId: moment.id.toString() },
              })
            }
          />
          <div className="absolute top-2 left-2 z-20">
            <BookmarkButton momentId={moment.id} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type ProfileTab = "moments" | "saved";

export function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { actor } = useBackend();
  const { principal, isAuthenticated, isLoggingIn } = useAuth();
  const requireAuth = useRequireAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("moments");

  // Parallax for hero banner
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bannerY = useTransform(scrollY, [0, 300], [0, 90]);

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
        hideAttendingList: state.hideAttendingList ?? false,
        isPrivateProfile: state.isPrivateProfile ?? false,
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

  const avatarSrc = user?.photo ? user.photo.getDirectURL() : undefined;
  const avatarFallback = (user?.username ?? "??").slice(0, 2).toUpperCase();

  return (
    <AuthGuard requireAuth={false} currentPath={`/profile/${username}`}>
      <Layout>
        {/* Back button — overlaid at top */}
        <div className="px-4 pt-4 pb-0">
          <button
            type="button"
            onClick={() => navigate({ to: "/explore" })}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tap-target -ml-1"
            data-ocid="profile.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-body">Back</span>
          </button>
        </div>

        {profileQuery.isLoading ? (
          <ProfileSkeleton />
        ) : !user ? (
          <div className="px-4 py-8">
            <EmptyState
              title="User not found"
              description="This profile doesn't exist."
            />
          </div>
        ) : (
          <>
            {/* ── Hero Banner ── */}
            <div
              ref={heroRef}
              className="relative h-48 md:h-64 w-full overflow-hidden"
            >
              <motion.div
                style={{ y: bannerY }}
                className="absolute inset-0 w-full h-[130%] -top-[15%]"
              >
                {/* Gradient banner with subtle pattern */}
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.18 0.08 300) 0%, oklch(0.10 0.05 260) 40%, oklch(0.14 0.06 280) 100%)",
                  }}
                >
                  {/* Decorative circles for depth */}
                  <div
                    className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle, oklch(0.72 0.28 280), transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-8 w-32 h-32 rounded-full opacity-15"
                    style={{
                      background:
                        "radial-gradient(circle, oklch(0.72 0.18 300), transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
                    style={{
                      background:
                        "radial-gradient(circle, oklch(0.82 0.25 260), transparent 70%)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Gradient fade to background at bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-24"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, oklch(var(--background)))",
                }}
              />
            </div>

            {/* ── Avatar + Identity ── */}
            <div className="px-4 -mt-12 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full ring-2 ring-white/30 shadow-xl glow-accent-sm overflow-hidden">
                  <Avatar className="w-full h-full">
                    {avatarSrc && (
                      <AvatarImage src={avatarSrc} alt={user.username} />
                    )}
                    <AvatarFallback className="font-display font-bold text-2xl bg-secondary text-secondary-foreground w-full h-full flex items-center justify-center">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </motion.div>

              {/* Name + username */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.35 }}
                className="text-center mt-3 space-y-0.5"
              >
                {user.name && (
                  <h1 className="text-gradient-accent font-display font-bold text-2xl leading-tight">
                    {user.name}
                  </h1>
                )}
                <p
                  className={`font-body text-muted-foreground ${!user.name ? "font-display font-bold text-2xl text-gradient-accent" : "text-sm"}`}
                >
                  @{user.username}
                </p>
                {user.location && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {user.location}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* ── Stats Row: Hosted | Attended | Following | Followers ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="w-full mt-4"
              >
                <div className="glass-card rounded-2xl px-4 py-3 flex items-center">
                  <StatItem
                    value={user.hostedCount.toString()}
                    label="Hosted"
                  />
                  <div className="w-px h-8 bg-border/50 self-center" />
                  <StatItem
                    value={user.attendedCount.toString()}
                    label="Attended"
                  />
                  <div className="w-px h-8 bg-border/50 self-center" />
                  <StatItem
                    value={user.followingCount.toString()}
                    label="Following"
                  />
                  <div className="w-px h-8 bg-border/50 self-center" />
                  <StatItem
                    value={user.followersCount.toString()}
                    label="Followers"
                  />
                </div>
              </motion.div>

              {/* ── Action buttons ── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.3 }}
                className="mt-4 w-full flex justify-center"
              >
                {isOwnProfile ? (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    onClick={isEditing ? handleCancel : handleEditStart}
                    className="glass-card flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-foreground hover:ring-1 hover:ring-accent/40 transition-smooth"
                    data-ocid="profile.edit_button"
                  >
                    <motion.div
                      animate={{ rotate: isEditing ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </motion.div>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </motion.button>
                ) : isAuthenticated ? (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    onClick={() => followMutation.mutate()}
                    disabled={
                      followMutation.isPending || isFollowingQuery.isLoading
                    }
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-smooth ${
                      isFollowingQuery.data
                        ? "glass-card text-foreground hover:ring-1 hover:ring-border"
                        : "bg-accent text-accent-foreground hover:opacity-90"
                    }`}
                    data-ocid="profile.follow_button"
                  >
                    {isFollowingQuery.data ? (
                      <>
                        <UserMinus className="w-4 h-4" /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" /> Follow
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    onClick={() => requireAuth(() => {})}
                    disabled={isLoggingIn}
                    className="glass-card flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-foreground hover:ring-1 hover:ring-accent/40 transition-smooth"
                    data-ocid="profile.signin_button"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {isLoggingIn ? "Signing in…" : "Sign in to follow"}
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* ── Content below hero ── */}
            <div className="px-4 mt-6 pb-8 space-y-6">
              {/* Edit form */}
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
                  {/* Socials chips */}
                  {user.socials && user.socials.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32, duration: 0.3 }}
                    >
                      <SocialLinksView socials={user.socials} />
                    </motion.div>
                  )}

                  {/* Payment details */}
                  {user.paymentDetails && user.paymentDetails.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38, duration: 0.3 }}
                    >
                      <PaymentDetailsView details={user.paymentDetails} />
                    </motion.div>
                  )}
                </>
              )}

              {/* ── Tabs: Moments / Saved (own profile only) ── */}
              {!isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44, duration: 0.35 }}
                >
                  {/* Tab switcher */}
                  {isOwnProfile && (
                    <div
                      className="flex gap-1 glass-card rounded-2xl p-1 mb-5"
                      data-ocid="profile.tabs"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveTab("moments")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-smooth ${
                          activeTab === "moments"
                            ? "bg-accent text-accent-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        data-ocid="profile.moments_tab"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Moments
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("saved")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-smooth ${
                          activeTab === "saved"
                            ? "bg-accent text-accent-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        data-ocid="profile.saved_tab"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        Saved
                      </button>
                    </div>
                  )}

                  {/* Tab: Moments */}
                  {activeTab === "moments" && (
                    <>
                      {!isOwnProfile && (
                        <h2 className="text-gradient-accent font-display font-bold text-xl mb-4">
                          Moments
                        </h2>
                      )}
                      {momentsQuery.isLoading ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <Skeleton
                              key={i}
                              className="w-full h-52 rounded-2xl"
                            />
                          ))}
                        </div>
                      ) : momentsQuery.data?.length === 0 ? (
                        <div
                          className="glass-card rounded-2xl p-8 flex flex-col items-center"
                          data-ocid="profile.moments_empty_state"
                        >
                          <EmptyState
                            icon={Calendar}
                            title="No moments yet"
                            description="This user hasn't created any moments."
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {momentsQuery.data?.map((moment, index) => (
                            <div
                              key={moment.id.toString()}
                              className="relative"
                              data-ocid={`profile.moment.item.${index + 1}`}
                            >
                              <MomentCard
                                moment={moment}
                                onClick={() =>
                                  navigate({
                                    to: "/moments/$momentId",
                                    params: {
                                      momentId: moment.id.toString(),
                                    },
                                  })
                                }
                              />
                              {isAuthenticated && (
                                <div className="absolute top-2 left-2 z-20">
                                  <BookmarkButton momentId={moment.id} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Tab: Saved (own profile only) */}
                  {activeTab === "saved" && isOwnProfile && <SavedTab />}
                </motion.div>
              )}
            </div>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
