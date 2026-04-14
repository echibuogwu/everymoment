import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Globe,
  ImagePlus,
  Lock,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { LocationInput } from "../components/LocationInput";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import { Visibility } from "../types";

function dateToTimestamp(dateStr: string, timeStr: string): bigint {
  const combined = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00:00`;
  return BigInt(new Date(combined).getTime()) * 1_000_000n;
}

export function NewMomentPage() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const removeCover = () => {
    setCoverFile(null);
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

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      let coverImage: ExternalBlob | undefined;
      if (coverFile) {
        const bytes = new Uint8Array(await coverFile.arrayBuffer());
        coverImage = ExternalBlob.fromBytes(bytes);
      }
      return actor.createMoment({
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
    onSuccess: async (momentId) => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myMoments });
      showSuccess("Moment created!");
      navigate({
        to: "/moments/$momentId",
        params: { momentId: momentId.toString() },
      });
    },
    onError: (err: Error) =>
      showError(err.message || "Failed to create moment"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <AuthGuard requireAuth requireProfile currentPath="/moments/new">
      <Layout>
        <div className="py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard" })}
              className="tap-target flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              New Moment
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="nm-title" className="font-body font-medium">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nm-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sarah & Tom's Wedding"
                className="font-body tap-target"
                required
                data-ocid="new-moment-title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="nm-desc" className="font-body font-medium">
                Description
              </Label>
              <Textarea
                id="nm-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what this moment is about…"
                className="font-body resize-none min-h-24"
                data-ocid="new-moment-description"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="nm-location" className="font-body font-medium">
                Location
              </Label>
              <LocationInput
                id="nm-location"
                value={location}
                lat={locationLat}
                lng={locationLng}
                onChange={handleLocationChange}
                placeholder="e.g. Central Park, New York"
                data-ocid="new-moment-location"
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
                <Label htmlFor="nm-date" className="font-body font-medium">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nm-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="font-body tap-target"
                  required
                  data-ocid="new-moment-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nm-time" className="font-body font-medium">
                  Time
                </Label>
                <Input
                  id="nm-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="font-body tap-target"
                  data-ocid="new-moment-time"
                />
              </div>
            </div>

            {/* Visibility toggle */}
            <div className="space-y-2">
              <Label className="font-body font-medium">Visibility</Label>
              <div
                className="flex rounded-lg overflow-hidden border border-border"
                data-ocid="new-moment-visibility"
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
                htmlFor="nm-tags"
                className="font-body font-medium flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5" />
                Tags
              </Label>
              {tags.length > 0 && (
                <div
                  className="flex flex-wrap gap-1.5"
                  data-ocid="new-moment-tags"
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
                id="nm-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput && addTag(tagInput)}
                placeholder="Type a tag and press Enter or comma…"
                className="font-body tap-target"
                data-ocid="new-moment-tag-input"
              />
              <p className="text-xs text-muted-foreground font-body">
                Press Enter or comma to add. Max 10 tags.
              </p>
            </div>

            {/* Cover image */}
            <div className="space-y-2">
              <Label className="font-body font-medium">Cover Image</Label>
              {coverPreview ? (
                <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-muted">
                  <img
                    src={coverPreview}
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
                  data-ocid="new-moment-cover-upload"
                >
                  <ImagePlus className="w-8 h-8" strokeWidth={1.5} />
                  <span className="text-sm font-body">
                    Click to upload cover image
                  </span>
                  <span className="text-xs font-body">
                    JPG, PNG, WEBP up to 10 MB
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                data-ocid="new-moment-file-input"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full tap-target font-body font-semibold"
              disabled={mutation.isPending || !title.trim() || !date}
              data-ocid="new-moment-submit"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4 animate-pulse" />
                  Creating…
                </span>
              ) : (
                "Create Moment"
              )}
            </Button>
          </form>
        </div>
      </Layout>
    </AuthGuard>
  );
}
