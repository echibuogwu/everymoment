import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { showError, showSuccess } from "../lib/toast";
import type { Folder, Media } from "../types";
import type { UserProfilePublic } from "../types";

const KIND_ICONS: Record<MediaKind, React.ReactNode> = {
  [MediaKind.image]: <ImageIcon className="w-5 h-5" />,
  [MediaKind.video]: <Film className="w-5 h-5" />,
  [MediaKind.audio]: <FileAudio className="w-5 h-5" />,
  [MediaKind.document_]: <FileText className="w-5 h-5" />,
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
  isOwner: boolean;
  folders: Folder[];
  onClose: () => void;
  onDelete: (media: Media) => void;
}

export function MediaDetailModal({
  media,
  isOwner,
  folders,
  onClose,
  onDelete,
}: MediaDetailModalProps) {
  const overlayRef = useRef<HTMLDialogElement>(null);
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  const folder = folders.find((f) => f.id === media.folderId);
  const mediaUrl = media.blob.getDirectURL();

  // Fetch uploader profile
  const { data: uploaderProfile } = useQuery<UserProfilePublic | null>({
    queryKey: QUERY_KEYS.userProfile(media.uploadedBy.toString()),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(media.uploadedBy);
    },
    enabled: !!actor,
  });

  // Like state
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

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Trap scroll
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
    <dialog
      ref={overlayRef}
      data-ocid="media-detail-overlay"
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      aria-modal="true"
      open
      className="fixed inset-0 z-50 m-0 p-0 w-full h-full max-w-none max-h-none bg-foreground/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 border-none"
    >
      <div
        className="bg-background w-full sm:max-w-2xl sm:rounded-xl overflow-hidden max-h-[96dvh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 font-body">
              {KIND_ICONS[media.kind]}
              {KIND_LABELS[media.kind]}
            </Badge>
            {folder && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <FolderOpen className="w-3.5 h-3.5" />
                {folder.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Button
                data-ocid="delete-media-btn"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 tap-target"
                onClick={() => onDelete(media)}
                aria-label="Delete media"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              data-ocid="close-media-modal-btn"
              variant="ghost"
              size="icon"
              className="tap-target"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Media content */}
        <div className="bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 min-h-[200px] max-h-[50dvh]">
          {media.kind === MediaKind.image && (
            <img
              src={mediaUrl}
              alt={media.filename}
              className="max-w-full max-h-full object-contain"
            />
          )}
          {media.kind === MediaKind.video && (
            <video
              src={mediaUrl}
              controls
              className="max-w-full max-h-full"
              playsInline
            >
              <track kind="captions" />
            </video>
          )}
          {media.kind === MediaKind.audio && (
            <div className="flex flex-col items-center gap-4 p-8 w-full">
              <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center">
                <FileAudio className="w-10 h-10 text-muted-foreground" />
              </div>
              <audio src={mediaUrl} controls className="w-full max-w-sm">
                <track kind="captions" />
              </audio>
            </div>
          )}
          {media.kind === MediaKind.document_ && (
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-body underline underline-offset-2 text-foreground hover:text-muted-foreground"
              >
                Open document
              </a>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 py-3 space-y-3 overflow-y-auto">
          <p className="font-body font-medium text-foreground break-words">
            {media.filename}
          </p>

          <Separator />

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

          <Separator />

          {/* Like action */}
          <div className="flex items-center gap-3 pb-1">
            <button
              type="button"
              data-ocid="like-media-btn"
              onClick={handleToggleLike}
              className={`
                flex items-center gap-2 text-sm font-body transition-smooth tap-target
                px-3 py-1.5 rounded-full border
                ${
                  hasLiked
                    ? "bg-foreground text-background border-foreground"
                    : "text-foreground border-border hover:bg-muted"
                }
              `}
              aria-label={hasLiked ? "Unlike" : "Like"}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
              <span>{media.likeCount.toString()}</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
