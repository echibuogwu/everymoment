import { cn } from "@/lib/utils";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Globe,
  Lock,
  MapPin,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import {
  useBookmarkMoment,
  useIsBookmarked,
  useUnbookmarkMoment,
} from "../hooks/use-backend";
import { showError, showSuccess } from "../lib/toast";
import { Visibility } from "../types";
import type { MomentListItem } from "../types";

export function formatEventDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Robust visibility check.
 *
 * The Motoko backend uses #private_ and #public_ variants (note trailing underscore).
 * The auto-generated Candid decoder may return these as:
 *   - {private_: null}   — raw Candid variant (Motoko underscore suffix)
 *   - {private: null}    — patched form used in createMoment/updateMoment encoding
 *   - "private"          — Visibility.private_ enum string value
 *
 * We must handle ALL of these forms.
 */
export function isPrivateVisibility(
  visibility: Visibility | Record<string, null> | unknown,
): boolean {
  if (!visibility) return false;
  if (visibility === Visibility.private_) return true;
  if (typeof visibility === "object" && visibility !== null) {
    if ("private_" in visibility) return true;
    if ("private" in visibility) return true;
  }
  return false;
}

// ── Inline bookmark button used on the card ───────────────────────────────────

function CardBookmarkButton({
  momentId,
  onClick: stopProp,
}: {
  momentId: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { isAuthenticated } = useAuth();
  const { data: isBookmarked } = useIsBookmarked(
    isAuthenticated ? momentId : null,
  );
  const bookmarkMutation = useBookmarkMoment();
  const unbookmarkMutation = useUnbookmarkMoment();

  if (!isAuthenticated) return null;

  const isPending = bookmarkMutation.isPending || unbookmarkMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    stopProp(e);
    if (isPending) return;
    if (isBookmarked) {
      unbookmarkMutation.mutate(momentId, {
        onSuccess: () => showSuccess("Bookmark removed"),
        onError: () => showError("Failed to update bookmark"),
      });
    } else {
      bookmarkMutation.mutate(momentId, {
        onSuccess: () => showSuccess("Moment saved"),
        onError: () => showError("Failed to save moment"),
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isBookmarked ? "Remove bookmark" : "Save moment"}
      data-ocid="moment-card.bookmark_button"
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all duration-200",
        "backdrop-blur-md border",
        isBookmarked
          ? "bg-accent text-accent-foreground border-accent/60 shadow-sm"
          : "bg-background/80 text-foreground border-white/20 hover:bg-background/90",
        "disabled:opacity-60",
      )}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-3 h-3" />
      ) : (
        <Bookmark className="w-3 h-3" />
      )}
      <span>{isBookmarked ? "Saved" : "Save"}</span>
    </button>
  );
}

// ── MomentCard ────────────────────────────────────────────────────────────────

interface MomentCardProps {
  moment: MomentListItem;
  onClick?: () => void;
  className?: string;
  index?: number;
}

export function MomentCard({
  moment,
  onClick,
  className,
  index: _index = 0,
}: MomentCardProps) {
  const isPrivate = isPrivateVisibility(moment.visibility);
  const coverUrl = moment.coverImage?.getDirectURL();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      data-ocid="moment-card"
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "glass-card",
        onClick &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]",
        className,
      )}
    >
      {/* Cover image — natural aspect ratio */}
      <div className="relative w-full overflow-hidden">
        {coverUrl ? (
          <>
            {/* Blur placeholder shown until image loads */}
            {!imgLoaded && (
              <div className="w-full h-40 animate-shimmer rounded-t-2xl" />
            )}
            <img
              src={coverUrl}
              alt={moment.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={cn(
                "w-full h-auto object-cover",
                imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0",
              )}
            />
          </>
        ) : (
          <div className="w-full h-36 flex items-center justify-center bg-muted/40">
            <Calendar
              className="w-8 h-8 text-muted-foreground/40"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Top badge row: visibility (left) + bookmark (right) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2 pointer-events-none">
          {/* Visibility badge */}
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
              "backdrop-blur-md",
              isPrivate
                ? "bg-foreground/70 text-primary-foreground border border-white/10"
                : "bg-background/70 text-foreground border border-white/20",
            )}
          >
            {isPrivate ? (
              <Lock className="w-2.5 h-2.5" />
            ) : (
              <Globe className="w-2.5 h-2.5" />
            )}
            {isPrivate ? "Private" : "Public"}
          </div>

          {/* Bookmark button — pointer-events re-enabled */}
          <div className="pointer-events-auto">
            <CardBookmarkButton
              momentId={moment.id}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="relative px-3 pb-3 pt-2">
        {/* Gradient connector between image and content */}
        {coverUrl && (
          <div
            className="absolute -top-6 left-0 right-0 h-6 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--card-overlay, rgba(0,0,0,0)))",
            }}
            aria-hidden="true"
          />
        )}

        {/* Title */}
        <h3 className="font-display font-semibold text-foreground text-[14px] leading-snug line-clamp-2 mb-1.5">
          {moment.title}
        </h3>

        {/* Metadata row */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-body">
              {formatEventDate(moment.eventDate)}
            </span>
          </div>
          {moment.location && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
              <span className="font-body truncate">{moment.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Users className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-body">
              {moment.attendeeCount.toString()} attending
            </span>
          </div>
        </div>

        {/* Tags */}
        {moment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {moment.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-accent/15 text-accent border border-accent/20"
              >
                #{tag}
              </span>
            ))}
            {moment.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-body bg-muted/60 text-muted-foreground">
                +{moment.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
