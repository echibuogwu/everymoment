import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Globe,
  ImagePlus,
  Lock,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { AuthGuard } from "../components/AuthGuard";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Layout } from "../components/Layout";
import { LocationInput } from "../components/LocationInput";
import { isPrivateVisibility } from "../components/MomentCard";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import { Visibility } from "../types";
import type { MomentDetail } from "../types";

/**
 * Normalize a raw backend visibility value (which may be a Candid object
 * like {private_: null} or {private: null}) to the TypeScript enum string.
 */
function normalizeVisibility(v: unknown): Visibility {
  if (isPrivateVisibility(v)) return Visibility.private_;
  return Visibility.public_;
}

function dateToTimestamp(dateStr: string, timeStr: string): bigint {
  const combined = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00:00`;
  return BigInt(new Date(combined).getTime()) * 1_000_000n;
}

function tsToDateStr(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toISOString().split("T")[0];
}

function tsToTimeStr(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toTimeString().slice(0, 5);
}

function EditFormSkeleton() {
  return (
    <div className="space-y-6 py-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
      <Skeleton className="h-14 w-full" />
    </div>
  );
}

export function EditMomentPage() {
  const { momentId } = useParams({ from: "/moments/$momentId/edit" });
  const { actor } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationLat, setLocationLat] = useState<number | undefined>(undefined);
  const [locationLng, setLocationLng] = useState<number | undefined>(undefined);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.public_);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [existingCoverBlob, setExistingCoverBlob] =
    useState<ExternalBlob | null>(null);

  const { data: moment, isLoading } = useQuery<MomentDetail | null>({
    queryKey: QUERY_KEYS.momentDetail(momentId),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMomentDetail(momentId);
    },
    enabled: actor !== null,
  });

  // Pre-fill form once loaded
  useEffect(() => {
    if (moment && !initialized) {
      setTitle(moment.title);
      setDescription(moment.description);
      setLocation(moment.location);
      setLocationLat(moment.locationLat ?? undefined);
      setLocationLng(moment.locationLng ?? undefined);
      setDate(tsToDateStr(moment.eventDate));
      setTime(tsToTimeStr(moment.eventDate));
      setVisibility(normalizeVisibility(moment.visibility));
      setTags(moment.tags);
      if (moment.coverImage) {
        setExistingCoverUrl(moment.coverImage.getDirectURL());
        setExistingCoverBlob(moment.coverImage);
      }
      setInitialized(true);
    }
  }, [moment, initialized]);

  const addTag = (raw: string) => {
    const val = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    if (val && !tags.includes(val) && tags.length < 10) {
      setTags((prev) => [...prev, val]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setExistingCoverUrl(null);
    setExistingCoverBlob(null);
  };

  const removeCover = () => {
    setCoverFile(null);
    setExistingCoverUrl(null);
    setExistingCoverBlob(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLocationChange = (
    name: string,
    lat: number | undefined,
    lng: number | undefined,
  ) => {
    setLocation(name);
    setLocationLat(lat);
    setLocationLng(lng);
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      let coverImage: ExternalBlob | undefined;
      if (coverFile) {
        const bytes = new Uint8Array(await coverFile.arrayBuffer());
        coverImage = ExternalBlob.fromBytes(bytes);
      } else if (existingCoverBlob) {
        coverImage = existingCoverBlob;
      }
      await actor.updateMoment(momentId, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        locationLat: locationLat !== undefined ? locationLat : undefined,
        locationLng: locationLng !== undefined ? locationLng : undefined,
        eventDate: dateToTimestamp(date, time),
        tags,
        visibility,
        coverImage,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentDetail(momentId),
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myMoments });
      showSuccess("Moment updated!");
      navigate({ to: "/moments/$momentId", params: { momentId } });
    },
    onError: (err: Error) =>
      showError(err.message || "Failed to update moment"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteMoment(momentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myMoments });
      showSuccess("Moment deleted");
      navigate({ to: "/dashboard" });
    },
    onError: () => showError("Failed to delete moment"),
  });

  const activeCoverUrl = coverPreview ?? existingCoverUrl;

  return (
    <AuthGuard
      requireAuth
      requireProfile
      currentPath={`/moments/${momentId}/edit`}
    >
      <Layout>
        <div className="py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={() =>
                navigate({ to: "/moments/$momentId", params: { momentId } })
              }
              className="tap-target flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight flex-1">
              Edit Moment
            </h1>
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="tap-target flex items-center justify-center rounded-full w-10 h-10 hover:bg-destructive/10 transition-colors text-destructive"
              aria-label="Delete moment"
              data-ocid="edit-moment-delete-trigger"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {isLoading || !initialized ? (
            <EditFormSkeleton />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate();
              }}
              className="space-y-6"
            >
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="em-title" className="font-body font-medium">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="em-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-body tap-target"
                  required
                  data-ocid="edit-moment-title"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="em-desc" className="font-body font-medium">
                  Description
                </Label>
                <Textarea
                  id="em-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="font-body resize-none min-h-24"
                  data-ocid="edit-moment-description"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="em-location" className="font-body font-medium">
                  Location
                </Label>
                <LocationInput
                  id="em-location"
                  value={location}
                  lat={locationLat}
                  lng={locationLng}
                  onChange={handleLocationChange}
                  data-ocid="edit-moment-location"
                />
                {locationLat !== undefined && locationLng !== undefined && (
                  <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block" />
                    Location pinned
                  </p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="em-date" className="font-body font-medium">
                    Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="em-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="font-body tap-target"
                    required
                    data-ocid="edit-moment-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="em-time" className="font-body font-medium">
                    Time
                  </Label>
                  <Input
                    id="em-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="font-body tap-target"
                    data-ocid="edit-moment-time"
                  />
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label className="font-body font-medium">Visibility</Label>
                <div
                  className="flex rounded-lg overflow-hidden border border-border"
                  data-ocid="edit-moment-visibility"
                >
                  <button
                    type="button"
                    onClick={() => setVisibility(Visibility.public_)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-body font-medium transition-colors tap-target ${
                      visibility === Visibility.public_
                        ? "bg-foreground text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility(Visibility.private_)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-body font-medium transition-colors tap-target border-l border-border ${
                      visibility === Visibility.private_
                        ? "bg-foreground text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    Private
                  </button>
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  {visibility === Visibility.public_
                    ? "Anyone can view this moment."
                    : "Access requires your approval."}
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label
                  htmlFor="em-tags"
                  className="font-body font-medium flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Tags
                </Label>
                {tags.length > 0 && (
                  <div
                    className="flex flex-wrap gap-1.5"
                    data-ocid="edit-moment-tags"
                  >
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 pl-2 pr-1 py-0.5 font-body text-xs"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <Input
                  id="em-tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder="Type a tag and press Enter or comma…"
                  className="font-body tap-target"
                  data-ocid="edit-moment-tag-input"
                />
              </div>

              {/* Cover image */}
              <div className="space-y-2">
                <Label className="font-body font-medium">Cover Image</Label>
                {activeCoverUrl ? (
                  <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-muted">
                    <img
                      src={activeCoverUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow"
                      aria-label="Remove cover image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[16/9] rounded-lg border-2 border-dashed border-border bg-muted/40 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors text-muted-foreground"
                    data-ocid="edit-moment-cover-upload"
                  >
                    <ImagePlus className="w-8 h-8" strokeWidth={1.5} />
                    <span className="text-sm font-body">
                      Click to upload cover image
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                  data-ocid="edit-moment-file-input"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full tap-target font-body font-semibold"
                disabled={updateMutation.isPending || !title.trim() || !date}
                data-ocid="edit-moment-submit"
              >
                {updateMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4 animate-pulse" />
                    Saving…
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          )}
        </div>

        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete moment?"
          description="This will permanently delete the moment and all its media. This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Keep it"
          destructive
          onConfirm={() => deleteMutation.mutate()}
        />
      </Layout>
    </AuthGuard>
  );
}
