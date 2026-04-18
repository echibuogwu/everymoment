import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileAudio,
  FileText,
  Film,
  FolderOpen,
  Heart,
  ImageIcon,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { MediaKind } from "../backend";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError } from "../lib/toast";
import type { Folder, Media, UserProfilePublic } from "../types";

const KIND_ICONS: Record<MediaKind, React.ReactNode> = {
  [MediaKind.image]: <ImageIcon className="w-4 h-4" />,
  [MediaKind.video]: <Film className="w-4 h-4" />,
  [MediaKind.audio]: <FileAudio className="w-4 h-4" />,
  [MediaKind.document_]: <FileText className="w-4 h-4" />,
};

const KIND_LABELS: Record<MediaKind, string> = {
  [MediaKind.image]: "Image",
  [MediaKind.video]: "Video",
  [MediaKind.audio]: "Audio",
  [MediaKind.document_]: "Document",
};

function formatDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MediaDetailModalProps {
  media: Media;
  /** Deprecated — use canDelete for fine-grained control */
  isOwner: boolean;
  /** If provided, overrides isOwner for showing the delete button */
  canDelete?: boolean;
  folders: Folder[];
  onClose: () => void;
  onDelete: (media: Media) => void;
}

export function MediaDetailModal({
  media,
  isOwner,
  canDelete,
  folders,
  onClose,
  onDelete,
}: MediaDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  // If canDelete is explicitly passed use it, otherwise fall back to isOwner
  const showDeleteButton = canDelete !== undefined ? canDelete : isOwner;

  const folder = folders.find((f) => f.id === media.folderId);
  const mediaUrl = media.blob.getDirectURL();

  const { data: uploaderProfile } = useQuery<UserProfilePublic | null>({
    queryKey: QUERY_KEYS.userProfile(media.uploadedBy.toString()),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(media.uploadedBy);
    },
    enabled: !!actor,
  });

  const { data: hasLiked, refetch: refetchLike } = useQuery<boolean>({
    queryKey: QUERY_KEYS.hasLiked(media.id.toString()),
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasLikedMedia(media.id);
    },
    enabled: !!actor,
  });

  const handleToggleLike = async () => {
    if (!actor) return;
    try {
      await actor.toggleLike(media.id);
      await refetchLike();
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.media(media.momentId.toString(), 0),
      });
    } catch {
      showError("Failed to update like.");
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      data-ocid="media-detail-overlay"
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      aria-modal="true"
      aria-label="Media detail"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="glass-modal w-full sm:max-w-3xl sm:rounded-3xl overflow-hidden max-h-[98dvh] sm:max-h-[96dvh] flex flex-col animate-scale-in rounded-t-3xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Kind badge */}
            <span className="glass-card rounded-full flex items-center gap-1.5 px-3 py-1 text-xs font-body font-medium text-foreground">
              {KIND_ICONS[media.kind]}
              {KIND_LABELS[media.kind]}
            </span>
            {folder && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <FolderOpen className="w-3.5 h-3.5" />
                {folder.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {showDeleteButton && (
              <button
                type="button"
                data-ocid="delete-media-btn"
                onClick={() => onDelete(media)}
                aria-label="Delete media"
                className="w-9 h-9 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/15 transition-smooth button-spring"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              data-ocid="close-media-modal-btn"
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth button-spring"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media area — full available height, no artificial cap */}
        <div className="bg-black/60 flex items-center justify-center overflow-hidden flex-1 min-h-[200px]">
          {media.kind === MediaKind.image && (
            <img
              src={mediaUrl}
              alt={media.filename}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
            />
          )}
          {media.kind === MediaKind.video && (
            <video
              src={mediaUrl}
              controls
              autoPlay={false}
              className="max-w-full max-h-[90vh] w-full h-auto"
              playsInline
            >
              <track kind="captions" />
            </video>
          )}
          {media.kind === MediaKind.audio && (
            <div className="flex flex-col items-center gap-6 p-10 w-full">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.28 280 / 0.2), oklch(0.45 0.22 300 / 0.2))",
                  border: "2px solid oklch(0.55 0.28 280 / 0.3)",
                  boxShadow: "0 0 32px oklch(0.55 0.28 280 / 0.2)",
                }}
              >
                <FileAudio className="w-10 h-10 text-accent" />
              </div>
              <p className="text-sm font-body text-muted-foreground text-center truncate max-w-[260px]">
                {media.filename}
              </p>
              <audio
                src={mediaUrl}
                controls
                className="w-full max-w-md"
                autoPlay={false}
              >
                <track kind="captions" />
              </audio>
            </div>
          )}
          {media.kind === MediaKind.document_ && (
            <div className="flex flex-col items-center gap-5 p-10">
              <div className="w-20 h-20 rounded-full glass-card glow-accent-sm flex items-center justify-center">
                <FileText className="w-9 h-9 text-accent" />
              </div>
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-body underline underline-offset-2 text-accent hover:opacity-80 transition-smooth"
              >
                Open document
              </a>
            </div>
          )}
        </div>

        {/* Info + actions */}
        <div className="px-4 py-4 space-y-3 overflow-y-auto flex-shrink-0 border-t border-white/10">
          <p className="font-body font-semibold text-foreground break-words">
            {media.filename}
          </p>

          <div className="h-px bg-white/10" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="font-body">
                {uploaderProfile?.username ?? "Unknown"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-body">
              {formatDate(media.createdAt)}
            </span>
          </div>

          <div className="h-px bg-white/10" />

          {/* Like action */}
          <div className="flex items-center gap-3 pb-2">
            <button
              type="button"
              data-ocid="like-media-btn"
              onClick={handleToggleLike}
              aria-label={hasLiked ? "Unlike" : "Like"}
              className={[
                "flex items-center gap-2 text-sm font-body transition-smooth button-spring",
                "px-4 py-2 rounded-full border",
                hasLiked
                  ? "bg-accent/20 text-accent border-accent/40 glow-accent-sm"
                  : "glass-card text-muted-foreground border-white/10 hover:text-foreground",
              ].join(" ")}
            >
              <Heart
                className={`w-4 h-4 ${hasLiked ? "fill-current text-accent" : ""}`}
              />
              <span>{media.likeCount.toString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
