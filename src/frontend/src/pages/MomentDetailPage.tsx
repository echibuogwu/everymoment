import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createActorWithConfig } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Globe,
  Images,
  Lock,
  MapPin,
  MessageSquareHeart,
  Pencil,
  QrCode,
  Share2,
  ShieldCheck,
  Ticket,
  Users,
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
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { AccessStatus, RsvpStatus } from "../types";
import type { Attendee, MomentDetail } from "../types";

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

/** Inline share section — glass surface with copy-link + collapsible QR */
function ShareSection({ momentId }: { momentId: string }) {
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
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-display font-semibold text-sm text-foreground">
          Share this Moment
        </h3>
      </div>

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
          style={{
            color: active === tab.id ? "oklch(var(--accent))" : undefined,
          }}
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

/** Parallax hero image */
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
      {/* Bottom gradient fade */}
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

  // Build tabs in fixed order: Memories first (always), then Media, People, Access
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

  // Ensure active tab is valid given available tabs
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
            {/* Hero — full bleed, no side padding */}
            <div className="relative -mx-4 md:-mx-6">
              {/* Floating back button */}
              <button
                type="button"
                onClick={handleBack}
                className="absolute top-4 left-4 z-20 flex items-center justify-center w-9 h-9 rounded-full glass-card transition-smooth button-spring"
                data-ocid="moment-back-btn"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4 text-foreground" />
              </button>

              {/* Edit button — floating top right */}
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

            {/* Glass info card — overlaps hero by 60px */}
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

                {/* Description */}
                {moment.description && (
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {moment.description}
                  </p>
                )}

                {/* Tags */}
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

              {/* Event Pass button — attending only */}
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
              {showShare && <ShareSection momentId={moment.id} />}
            </motion.div>

            {/* Glass tab bar */}
            <div className="sticky top-0 z-header py-3 bg-background/80 backdrop-blur-md -mx-4 px-4">
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
                    <AttendeesTab momentId={momentId} />
                  )}
                  {validActiveTab === "access" && showAccessTab && (
                    <AccessRequestsPanel momentId={moment.id} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
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
