import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Globe, Lock, MapPin, Users } from "lucide-react";
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
  // TypeScript enum string match: Visibility.private_ === "private"
  if (visibility === Visibility.private_) return true;
  if (typeof visibility === "object" && visibility !== null) {
    // Raw Candid variant with underscore suffix: {private_: null}
    if ("private_" in visibility) return true;
    // Patched encoding without underscore: {private: null}
    if ("private" in visibility) return true;
  }
  return false;
}

interface MomentCardProps {
  moment: MomentListItem;
  onClick?: () => void;
  className?: string;
}

export function MomentCard({ moment, onClick, className }: MomentCardProps) {
  const isPrivate = isPrivateVisibility(moment.visibility);
  const coverUrl = moment.coverImage?.getDirectURL();

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
        "group card-elevated overflow-hidden transition-all duration-200",
        onClick &&
          "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0",
        className,
      )}
    >
      {/* Cover image */}
      <div className="relative w-full aspect-video bg-muted overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={moment.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/60">
            <Calendar
              className="w-8 h-8 text-muted-foreground/50"
              strokeWidth={1.5}
            />
          </div>
        )}
        {/* Visibility badge */}
        <div className="absolute top-2.5 left-2.5">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm",
              isPrivate
                ? "bg-foreground/80 text-primary-foreground"
                : "bg-background/80 text-foreground border border-border/50",
            )}
          >
            {isPrivate ? (
              <Lock className="w-2.5 h-2.5" />
            ) : (
              <Globe className="w-2.5 h-2.5" />
            )}
            {isPrivate ? "Private" : "Public"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <h3 className="font-display font-semibold text-foreground text-[15px] leading-snug line-clamp-2 group-hover:text-foreground/80 transition-colors">
          {moment.title}
        </h3>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-body">
              {formatEventDate(moment.eventDate)}
            </span>
          </div>
          {moment.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
              <span className="font-body truncate">{moment.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-body">
              {moment.attendeeCount.toString()} attending
            </span>
          </div>
        </div>

        {moment.description && (
          <p className="text-[13px] text-muted-foreground font-body line-clamp-2 leading-relaxed">
            {moment.description}
          </p>
        )}

        {moment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {moment.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] font-body px-1.5 py-0.5 rounded-full h-auto"
              >
                #{tag}
              </Badge>
            ))}
            {moment.tags.length > 3 && (
              <Badge
                variant="secondary"
                className="text-[10px] font-body px-1.5 py-0.5 rounded-full h-auto"
              >
                +{moment.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
