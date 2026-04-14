import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FileAudio,
  FileText,
  Film,
  Heart,
  ImageIcon,
  MessageCircle,
} from "lucide-react";
import { MediaKind } from "../types";
import type { Media } from "../types";

const KIND_ICONS: Record<MediaKind, React.ReactNode> = {
  [MediaKind.image]: <ImageIcon className="w-6 h-6 text-muted-foreground" />,
  [MediaKind.video]: <Film className="w-6 h-6 text-muted-foreground" />,
  [MediaKind.audio]: <FileAudio className="w-6 h-6 text-muted-foreground" />,
  [MediaKind.document_]: <FileText className="w-6 h-6 text-muted-foreground" />,
};

const KIND_LABELS: Record<MediaKind, string> = {
  [MediaKind.image]: "Image",
  [MediaKind.video]: "Video",
  [MediaKind.audio]: "Audio",
  [MediaKind.document_]: "Document",
};

function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface MediaCardProps {
  media: Media;
  onClick?: () => void;
  className?: string;
}

export function MediaCard({ media, onClick, className }: MediaCardProps) {
  const thumbnailUrl =
    media.kind === MediaKind.image ? media.blob.getDirectURL() : null;

  return (
    <div
      data-ocid="media-card"
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "card-elevated overflow-hidden transition-smooth",
        onClick && "cursor-pointer hover:shadow-md active:scale-[0.98]",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={media.filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            {KIND_ICONS[media.kind]}
            {media.kind === MediaKind.video && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/5">
                <div className="w-12 h-12 rounded-full bg-foreground/80 flex items-center justify-center">
                  <Film className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            )}
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 text-xs font-body"
        >
          {KIND_LABELS[media.kind]}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="font-body text-sm font-medium text-foreground truncate">
          {media.filename}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-body">
            {formatTimestamp(media.createdAt)}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" />
              {media.likeCount.toString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
