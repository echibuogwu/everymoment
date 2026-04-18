import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createActorWithConfig } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlarmClock,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  Images,
  Lock,
  MapPin,
  Megaphone,
  MessageSquareHeart,
  Pencil,
  QrCode,
  Share2,
  ShieldCheck,
  Ticket,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { createActor } from "../backend";
import { AccessRequestsPanel } from "../components/AccessRequestsPanel";
import { AttendeesTab } from "../components/AttendeesTab";
import { AuthGuard } from "../components/AuthGuard";
import { EmptyState } from "../components/EmptyState";
import { EventPassModal } from "../components/EventPassModal";
import { Layout } from "../components/Layout";
import { MemoriesTab } from "../components/MemoriesTab";
import { isPrivateVisibility } from "../components/MomentCard";
import { MomentMediaTab } from "../components/MomentMediaTab";
import { PrivateMomentPreview } from "../components/PrivateMomentPreview";
import { RsvpButton } from "../components/RsvpButton";
import { useAuth } from "../hooks/use-auth";
import {
  useAnnouncements,
  useBackend,
  useBookmarkMoment,
  useDeleteAnnouncement,
  useIsBookmarked,
  usePostAnnouncement,
  useUnbookmarkMoment,
} from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import { AccessStatus, RsvpStatus } from "../types";
import type {
  AgendaItem,
  Announcement,
  Attendee,
  MomentDetail,
} from "../types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function MomentDetailSkeleton() {
  return (
    <div className="space-y-0">
      <Skeleton className="w-full h-[60vh] rounded-none" />
      <div className="px-4 pt-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ── Announcements ─────────────────────────────────────────────────────────────

interface AnnouncementsSectionProps {
  momentId: string;
  isOwner: boolean;
}

function AnnouncementsSection({
  momentId,
  isOwner,
}: AnnouncementsSectionProps) {
  const { data: announcements, isLoading } = useAnnouncements(momentId);
  const postMutation = usePostAnnouncement();
  const deleteMutation = useDeleteAnnouncement();
  const [text, setText] = useState("");
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const handlePost = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    postMutation.mutate(
      { momentId, text: trimmed },
      {
        onSuccess: () => {
          setText("");
          showSuccess("Announcement posted");
        },
        onError: () => showError("Failed to post announcement"),
      },
    );
  };

  const handleDelete = (ann: Announcement) => {
    deleteMutation.mutate(
      { momentId, announcementId: ann.id },
      {
        onSuccess: () => showSuccess("Announcement removed"),
        onError: () => showError("Failed to delete announcement"),
      },
    );
  };

  const visible = announcements?.filter((a) => !dismissed.has(Number(a.id)));

  if (isLoading) return null;
  if (!isOwner && (!visible || visible.length === 0)) return null;

  return (
    <div className="space-y-3" data-ocid="announcements-section">
      {/* Compose — owner only */}
      {isOwner && (
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-accent" />
            <p className="text-sm font-body font-semibold text-foreground">
              Post Announcement
            </p>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Announce a change, reminder, or update…"
            rows={2}
            className="w-full px-4 py-3 rounded-xl font-body text-sm glass-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-200 resize-none"
            data-ocid="announcement-textarea"
          />
          <Button
            size="sm"
            onClick={handlePost}
            disabled={!text.trim() || postMutation.isPending}
            className="w-full"
            data-ocid="announcement-post-button"
          >
            {postMutation.isPending ? "Posting…" : "Post Announcement"}
          </Button>
        </div>
      )}

      {/* Announcement banners */}
      {visible && visible.length > 0 && (
        <div className="space-y-2">
          {visible.map((ann) => (
            <div
              key={Number(ann.id)}
              className="glass-card rounded-2xl px-4 py-3 border border-accent/20 bg-accent/5"
              data-ocid="announcement-item"
            >
              <div className="flex items-start gap-3">
                <Megaphone className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-body text-foreground leading-relaxed">
                    {ann.text}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    {formatRelativeTime(ann.createdAt)}
                  </p>
                </div>
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(ann)}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    aria-label="Delete announcement"
                    data-ocid="announcement-delete-button"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setDismissed((prev) => new Set([...prev, Number(ann.id)]))
                    }
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Dismiss"
                    data-ocid="announcement-dismiss-button"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Capacity Indicator ─────────────────────────────────────────────────────────

interface CapacityIndicatorProps {
  attendeeCount: bigint;
  maxAttendees?: bigint;
  waitlistCount: bigint;
}

function CapacityIndicator({
  attendeeCount,
  maxAttendees,
  waitlistCount,
}: CapacityIndicatorProps) {
  if (!maxAttendees) return null;

  const total = Number(maxAttendees);
  const attending = Number(attendeeCount);
  const waitlisted = Number(waitlistCount);
  const remaining = Math.max(0, total - attending);
  const isFull = attending >= total;
  const pct = Math.min(100, (attending / total) * 100);

  return (
    <div
      className="glass-card rounded-xl px-3 py-2.5 space-y-1.5"
      data-ocid="capacity-indicator"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-body text-muted-foreground flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5" />
          Capacity
        </span>
        {isFull ? (
          <Badge
            variant="destructive"
            className="text-xs"
            data-ocid="capacity-full-badge"
          >
            {waitlisted > 0 ? `Full · ${waitlisted} on waitlist` : "Full"}
          </Badge>
        ) : (
          <span
            className="text-xs font-body font-semibold text-green-500"
            data-ocid="capacity-spots-badge"
          >
            {remaining} spot{remaining !== 1 ? "s" : ""} left
          </span>
        )}
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFull
              ? "bg-destructive"
              : pct > 75
                ? "bg-yellow-500"
                : "bg-green-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground font-body">
        {attending} of {total} attending
      </p>
    </div>
  );
}

// ── Bookmark Button ────────────────────────────────────────────────────────────

function BookmarkButton({ momentId }: { momentId: string }) {
  const { isAuthenticated } = useAuth();
  const { data: isBookmarked } = useIsBookmarked(
    isAuthenticated ? momentId : null,
  );
  const bookmarkMutation = useBookmarkMoment();
  const unbookmarkMutation = useUnbookmarkMoment();

  if (!isAuthenticated) return null;

  const handleToggle = () => {
    if (isBookmarked) {
      unbookmarkMutation.mutate(momentId, {
        onSuccess: () => showSuccess("Bookmark removed"),
        onError: () => showError("Failed to update bookmark"),
      });
    } else {
      bookmarkMutation.mutate(momentId, {
        onSuccess: () => showSuccess("Moment saved"),
        onError: () => showError("Failed to update bookmark"),
      });
    }
  };

  const isPending = bookmarkMutation.isPending || unbookmarkMutation.isPending;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark moment"}
      className="w-9 h-9 rounded-xl glass-card flex items-center justify-center transition-smooth button-spring disabled:opacity-50"
      data-ocid="bookmark-toggle-button"
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4 text-accent" />
      ) : (
        <Bookmark className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}

// ── Add to Calendar ────────────────────────────────────────────────────────────

function generateIcs(moment: MomentDetail): string {
  const start = new Date(Number(moment.eventDate / 1_000_000n));
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h default

  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EveryMoment//EN",
    "BEGIN:VEVENT",
    `UID:${moment.id}@everymoment`,
    `DTSTAMP:${fmt(new Date())}`, // eslint-disable-line
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${moment.title.replace(/\n/g, " ")}`,
    moment.location ? `LOCATION:${moment.location.replace(/\n/g, " ")}` : "",
    moment.description
      ? `DESCRIPTION:${moment.description.replace(/\n/g, "\\n")}`
      : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return lines;
}

function googleCalendarUrl(moment: MomentDetail): string {
  const start = new Date(Number(moment.eventDate / 1_000_000n));
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00Z`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: moment.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: moment.description ?? "",
    location: moment.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs(moment: MomentDetail) {
  const ics = generateIcs(moment);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${moment.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function AddToCalendarButton({ moment }: { moment: MomentDetail }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" data-ocid="add-to-calendar-section">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass-card border border-border text-sm font-body font-medium text-foreground hover:bg-accent/5 transition-smooth"
        data-ocid="add-to-calendar-button"
      >
        <CalendarPlus className="w-4 h-4 text-accent" />
        Add to Calendar
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 glass-card rounded-xl border border-border shadow-lg overflow-hidden z-30"
            data-ocid="add-to-calendar-dropdown"
          >
            <button
              type="button"
              onClick={() => {
                window.open(googleCalendarUrl(moment), "_blank");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-foreground hover:bg-accent/10 transition-colors"
              data-ocid="calendar-google-button"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              Google Calendar
            </button>
            <div className="border-t border-border" />
            <button
              type="button"
              onClick={() => {
                downloadIcs(moment);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-foreground hover:bg-accent/10 transition-colors"
              data-ocid="calendar-ics-button"
            >
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Apple Calendar / Outlook (.ics)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Agenda / Timeline ──────────────────────────────────────────────────────────

function AgendaTimeline({ items }: { items: AgendaItem[] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-3" data-ocid="agenda-section">
      <div className="flex items-center gap-2">
        <AlarmClock className="w-4 h-4 text-accent" />
        <h3 className="font-display font-semibold text-sm text-foreground">
          Agenda
        </h3>
      </div>

      <div className="relative pl-5">
        {/* Vertical line */}
        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />

        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={Number(item.id)}
              className="relative"
              data-ocid={`agenda-item.${i + 1}`}
            >
              {/* Dot */}
              <div className="absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-background" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-body font-semibold text-accent">
                    {item.time}
                  </span>
                  <span className="text-sm font-body font-medium text-foreground">
                    {item.title}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Share Section ──────────────────────────────────────────────────────────────

function ShareSection({
  momentId,
  moment,
}: {
  momentId: string;
  moment: MomentDetail;
}) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const shareUrl = `${window.location.origin}/moment/${momentId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available — silent fail
    }
  };

  return (
    <div
      className="glass-card rounded-2xl p-4 space-y-3"
      data-ocid="share-section"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-sm text-foreground">
            Share this Moment
          </h3>
        </div>
        <BookmarkButton momentId={momentId} />
      </div>

      {/* Copy link */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="w-full gap-2 transition-smooth button-spring"
        data-ocid="copy-share-link-btn"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-foreground" />
            <span className="font-body">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="font-body">Copy Link</span>
          </>
        )}
      </Button>

      {/* Add to calendar */}
      <AddToCalendarButton moment={moment} />

      {/* QR toggle */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setQrOpen((v) => !v)}
          className="tap-target w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-smooth text-sm"
          aria-expanded={qrOpen}
          data-ocid="qr-toggle-btn"
        >
          <span className="flex items-center gap-2 font-body text-muted-foreground">
            <QrCode className="w-4 h-4" />
            {qrOpen ? "Hide QR Code" : "Show QR Code"}
          </span>
          {qrOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {qrOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
              data-ocid="qr-code-container"
            >
              <div className="flex justify-center p-4 bg-background rounded-xl border border-border">
                <QRCodeSVG
                  value={shareUrl}
                  size={160}
                  level="M"
                  includeMargin={false}
                  className="rounded"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────────

type TabId = "memories" | "media" | "people" | "access";

interface GlassTabBarProps {
  tabs: { id: TabId; label: string; icon: React.ReactNode }[];
  active: TabId;
  onChange: (id: TabId) => void;
}

function GlassTabBar({ tabs, active, onChange }: GlassTabBarProps) {
  return (
    <div
      className="glass-card rounded-full p-1 flex w-fit mx-auto"
      data-ocid="moment-tabs"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className="relative px-4 py-2 rounded-full text-xs font-body font-medium transition-colors z-10 flex items-center gap-1.5"
          data-ocid={`moment-tab-${tab.id}`}
          aria-selected={active === tab.id}
        >
          {active === tab.id && (
            <motion.span
              layoutId="tab-active"
              className="absolute inset-0 glass-card rounded-full z-[-1]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span
            className={
              active === tab.id ? "text-accent" : "text-muted-foreground"
            }
          >
            {tab.icon}
          </span>
          <span
            className={
              active === tab.id ? "text-accent" : "text-muted-foreground"
            }
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────

function HeroImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 240]);

  return (
    <div
      ref={ref}
      className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-muted"
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-[120%] object-cover absolute inset-0"
        style={{ y, willChange: "transform" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
    </div>
  );
}

function HeroGradient() {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-muted" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
    </div>
  );
}

// ── Main Content ───────────────────────────────────────────────────────────────

export function MomentDetailContent({ momentId }: { momentId: string }) {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const navigate = useNavigate();
  const [showEventPass, setShowEventPass] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("memories");

  const { data: moment, isLoading } = useQuery<MomentDetail | null>({
    queryKey: QUERY_KEYS.momentDetail(momentId),
    queryFn: async () => {
      const effectiveActor = actor
        ? actor
        : await createActorWithConfig(createActor);
      return effectiveActor.getMomentDetail(momentId);
    },
    enabled: true,
  });

  const { data: attendees } = useQuery<Attendee[]>({
    queryKey: QUERY_KEYS.momentAttendees(momentId),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMomentAttendees(momentId);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const isPrivate = isPrivateVisibility(moment?.visibility);
  const hasAccess =
    !moment ||
    !isPrivate ||
    moment.isOwner ||
    moment.callerAccessStatus === AccessStatus.approved;
  const showAccessTab = moment?.isOwner && isPrivate;
  const coverUrl = moment?.coverImage?.getDirectURL();

  const myAttendance = attendees?.find(
    (a) => principal && a.userId.toText() === principal.toText(),
  );
  const isAttending =
    isAuthenticated &&
    (moment?.isOwner ||
      myAttendance?.rsvpStatus === RsvpStatus.attending ||
      myAttendance?.rsvpStatus === RsvpStatus.maybe);

  const showShare =
    !!moment &&
    isAuthenticated &&
    (moment.isOwner ||
      !isPrivate ||
      moment.callerAccessStatus === AccessStatus.approved);

  const handleBack = () => {
    navigate({ to: "/explore" });
  };

  // Build tabs in fixed order
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [];
  if (isAttending) {
    tabs.push({
      id: "memories",
      label: "Memories",
      icon: <MessageSquareHeart className="w-3.5 h-3.5" />,
    });
  }
  tabs.push({
    id: "media",
    label: "Media",
    icon: <Images className="w-3.5 h-3.5" />,
  });
  tabs.push({
    id: "people",
    label: "People",
    icon: <Users className="w-3.5 h-3.5" />,
  });
  if (showAccessTab) {
    tabs.push({
      id: "access",
      label: "Access",
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    });
  }

  const validActiveTab =
    tabs.find((t) => t.id === activeTab)?.id ??
    (isAttending ? "memories" : "media");

  return (
    <AuthGuard requireAuth={false} currentPath={`/moments/${momentId}`}>
      <Layout>
        {isLoading ? (
          <MomentDetailSkeleton />
        ) : !moment ? (
          <div className="py-6 px-4">
            <EmptyState
              title="Moment not found"
              description="This moment may have been removed or is no longer available."
              action={
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="tap-target"
                >
                  Back to Explore
                </Button>
              }
            />
          </div>
        ) : !hasAccess ? (
          <div className="py-4 px-4">
            <button
              type="button"
              onClick={handleBack}
              className="tap-target flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-4 -ml-1"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-body">Back</span>
            </button>
            <PrivateMomentPreview moment={moment} />
          </div>
        ) : (
          <div className="pb-10">
            {/* Hero */}
            <div className="relative -mx-4 md:-mx-6">
              <button
                type="button"
                onClick={handleBack}
                className="absolute top-4 left-4 z-20 flex items-center justify-center w-9 h-9 rounded-full glass-card transition-smooth button-spring"
                data-ocid="moment-back-btn"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4 text-foreground" />
              </button>

              {moment.isOwner && (
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/moments/$momentId/edit",
                      params: { momentId },
                    })
                  }
                  className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full glass-card text-xs font-body font-medium text-foreground transition-smooth button-spring"
                  data-ocid="edit-moment-btn"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}

              {coverUrl ? (
                <HeroImage src={coverUrl} alt={moment.title} />
              ) : (
                <HeroGradient />
              )}
            </div>

            {/* Glass info card */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="glass-card rounded-t-3xl -mt-16 relative z-10 mx-0 px-5 pt-6 pb-5 space-y-4"
            >
              {/* Title + visibility */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="font-display font-bold text-2xl text-foreground leading-tight flex-1 min-w-0">
                    {moment.title}
                  </h1>
                  <Badge
                    variant={isPrivate ? "outline" : "secondary"}
                    className="flex items-center gap-1 flex-shrink-0"
                  >
                    {isPrivate ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Globe className="w-3 h-3" />
                    )}
                    {isPrivate ? "Private" : "Public"}
                  </Badge>
                </div>

                {/* Meta */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="font-body">
                      {formatDate(moment.eventDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="font-body">
                      {formatTime(moment.eventDate)}
                    </span>
                  </div>
                  {moment.location && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="font-body">{moment.location}</span>
                      </div>
                      {moment.locationLat !== undefined &&
                        moment.locationLng !== undefined && (
                          <div
                            className="rounded-xl overflow-hidden border border-border"
                            data-ocid="moment-map-container"
                          >
                            <iframe
                              title={`Map of ${moment.location}`}
                              width="100%"
                              height="180"
                              style={{ border: 0, display: "block" }}
                              loading="lazy"
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=${moment.locationLng - 0.01},${moment.locationLat - 0.01},${moment.locationLng + 0.01},${moment.locationLat + 0.01}&layer=mapnik&marker=${moment.locationLat},${moment.locationLng}`}
                              data-ocid="moment-map-iframe"
                            />
                          </div>
                        )}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="font-body">
                      {moment.attendeeCount.toString()} attending
                    </span>
                  </div>
                </div>

                {/* Capacity indicator */}
                <CapacityIndicator
                  attendeeCount={moment.attendeeCount}
                  maxAttendees={moment.maxAttendees}
                  waitlistCount={moment.waitlistCount}
                />

                {moment.description && (
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {moment.description}
                  </p>
                )}

                {moment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {moment.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs font-body"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* RSVP */}
              <div>
                <p className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-wide">
                  Your RSVP
                </p>
                <RsvpButton momentId={momentId} />
              </div>

              {/* Event Pass — attending only */}
              {isAttending && (
                <motion.button
                  type="button"
                  onClick={() => setShowEventPass(true)}
                  whileTap={{ scale: 0.96 }}
                  className="relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-display font-semibold text-sm text-accent-foreground overflow-hidden animate-glow-pulse"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
                  }}
                  data-ocid="event-pass-open_modal_button"
                >
                  <span className="shimmer-sweep" />
                  <Ticket className="w-4 h-4" />
                  Your Event Pass
                </motion.button>
              )}

              {/* Share section */}
              {showShare && (
                <ShareSection momentId={moment.id} moment={moment} />
              )}
            </motion.div>

            {/* Announcements — below info card, above tabs */}
            {(moment.isOwner || isAttending) && (
              <div className="mt-4">
                <AnnouncementsSection
                  momentId={momentId}
                  isOwner={moment.isOwner}
                />
              </div>
            )}

            {/* Tab bar */}
            <div className="sticky top-0 z-header py-3 bg-background/80 backdrop-blur-md -mx-4 px-4 mt-4">
              <GlassTabBar
                tabs={tabs}
                active={validActiveTab}
                onChange={(id) => setActiveTab(id)}
              />
            </div>

            {/* Tab content */}
            <div className="mt-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={validActiveTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {validActiveTab === "memories" && isAttending && (
                    <MemoriesTab momentId={moment.id} />
                  )}
                  {validActiveTab === "media" && (
                    <MomentMediaTab
                      momentId={moment.id}
                      isOwner={moment.isOwner}
                      isAttending={isAttending}
                      currentUserId={principal?.toText() ?? null}
                    />
                  )}
                  {validActiveTab === "people" && (
                    <AttendeesTab
                      momentId={momentId}
                      maxAttendees={moment.maxAttendees}
                      isOwner={moment.isOwner}
                    />
                  )}
                  {validActiveTab === "access" && showAccessTab && (
                    <AccessRequestsPanel momentId={moment.id} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Agenda timeline — below tab content */}
            {moment.agendaItems.length > 0 && (
              <div className="mt-6 glass-card rounded-2xl p-4">
                <AgendaTimeline items={moment.agendaItems} />
              </div>
            )}
          </div>
        )}
      </Layout>

      {showEventPass && (
        <EventPassModal
          momentId={momentId}
          currentUserPrincipal={principal?.toText() ?? null}
          actor={actor}
          isFetchingActor={isFetching}
          onClose={() => setShowEventPass(false)}
        />
      )}
    </AuthGuard>
  );
}

export function MomentDetailPage() {
  const { momentId } = useParams({ from: "/moments/$momentId" });
  return <MomentDetailContent momentId={momentId} />;
}
