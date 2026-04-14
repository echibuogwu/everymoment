import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
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
    <div className="space-y-4 py-6">
      <Skeleton className="w-full aspect-[16/9] rounded-lg" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

/** Inline share section — copy button + collapsible QR code */
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
      className="rounded-xl border border-border bg-card p-4 space-y-3"
      data-ocid="share-section"
    >
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-display font-semibold text-sm text-foreground">
          Share this Moment
        </h3>
      </div>

      {/* Copy Link — primary action */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="w-full gap-2 transition-colors"
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

      {/* QR Code — collapsible */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setQrOpen((v) => !v)}
          className="tap-target w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
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

        {qrOpen && (
          <div
            className="flex justify-center p-4 bg-background rounded-lg border border-border"
            data-ocid="qr-code-container"
          >
            <QRCodeSVG
              value={shareUrl}
              size={160}
              level="M"
              includeMargin={false}
              className="rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/** Core content component — accepts momentId as a prop so it can be used from
 *  both /moments/$momentId and /moment/$momentId (public share link) routes. */
export function MomentDetailContent({ momentId }: { momentId: string }) {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, principal } = useAuth();
  const navigate = useNavigate();
  const [showEventPass, setShowEventPass] = useState(false);

  const { data: moment, isLoading } = useQuery<MomentDetail | null>({
    queryKey: QUERY_KEYS.momentDetail(momentId),
    queryFn: async () => {
      // Use authenticated actor when available, otherwise create an anonymous
      // actor so unauthenticated visitors can still load public moments and
      // see the access-request screen for private ones.
      const effectiveActor = actor
        ? actor
        : await createActorWithConfig(createActor);
      return effectiveActor.getMomentDetail(momentId);
    },
    // Always enabled — getMomentDetail is a public query that anonymous
    // principals can call. The actor is never null after the fallback above.
    enabled: true,
  });

  // Fetch attendees to determine if the current user is attending
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

  // A user can see Memories if they are the owner OR have an attending/maybe RSVP
  const myAttendance = attendees?.find(
    (a) => principal && a.userId.toText() === principal.toText(),
  );
  const isAttending =
    isAuthenticated &&
    (moment?.isOwner ||
      myAttendance?.rsvpStatus === RsvpStatus.attending ||
      myAttendance?.rsvpStatus === RsvpStatus.maybe);

  // Share section is visible to:
  // - Owner always
  // - Approved viewers of private moments
  // - All authenticated users for public moments
  const showShare =
    !!moment &&
    isAuthenticated &&
    (moment.isOwner ||
      !isPrivate ||
      moment.callerAccessStatus === AccessStatus.approved);

  const handleBack = () => {
    navigate({ to: "/explore" });
  };

  return (
    <AuthGuard requireAuth={false} currentPath={`/moments/${momentId}`}>
      <Layout>
        {isLoading ? (
          <MomentDetailSkeleton />
        ) : !moment ? (
          <div className="py-6">
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
          <div className="py-4">
            <button
              type="button"
              onClick={handleBack}
              className="tap-target flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 -ml-1"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-body">Back</span>
            </button>
            <PrivateMomentPreview moment={moment} />
          </div>
        ) : (
          <div className="py-6 space-y-0">
            {/* Back */}
            <button
              type="button"
              onClick={handleBack}
              className="tap-target flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 -ml-1"
              data-ocid="moment-back-btn"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-body">Back</span>
            </button>

            {/* Cover image */}
            {coverUrl && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-muted mb-5">
                <img
                  src={coverUrl}
                  alt={moment.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="space-y-3 pb-5">
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-display font-bold text-2xl text-foreground leading-tight flex-1 min-w-0">
                  {moment.title}
                </h1>
                {moment.isOwner && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate({
                        to: "/moments/$momentId/edit",
                        params: { momentId },
                      })
                    }
                    className="flex-shrink-0 tap-target"
                    data-ocid="edit-moment-btn"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {/* Visibility badge */}
              <Badge
                variant={isPrivate ? "outline" : "secondary"}
                className="flex items-center gap-1 w-fit"
              >
                {isPrivate ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                {isPrivate ? "Private" : "Public"}
              </Badge>

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
                          className="rounded-lg overflow-hidden border border-border"
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

              {/* RSVP — RsvpButton handles both authenticated and guest states */}
              <div className="pt-1">
                <p className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-wide">
                  Your RSVP
                </p>
                <RsvpButton momentId={momentId} />
              </div>

              {/* Event Pass — only visible when attending */}
              {isAttending && (
                <div className="pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEventPass(true)}
                    className="w-full gap-2 tap-target"
                    data-ocid="event-pass-open_modal_button"
                  >
                    <QrCode className="w-4 h-4" />
                    Your Event Pass
                  </Button>
                </div>
              )}
            </div>

            {/* Share section — inline below RSVP, never in a modal */}
            {showShare && (
              <div className="pb-5">
                <ShareSection momentId={moment.id} />
              </div>
            )}

            <Separator className="my-1" />

            {/* Tabs */}
            <Tabs
              defaultValue={isAttending ? "memories" : "media"}
              className="mt-5"
            >
              <TabsList
                className={`w-full grid bg-muted/50 ${
                  isAttending && showAccessTab
                    ? "grid-cols-4"
                    : isAttending || showAccessTab
                      ? "grid-cols-3"
                      : "grid-cols-2"
                }`}
                data-ocid="moment-tabs"
              >
                {isAttending && (
                  <TabsTrigger
                    value="memories"
                    className="font-body text-xs gap-1.5"
                    data-ocid="moment-tab-memories"
                  >
                    <MessageSquareHeart className="w-3.5 h-3.5" />
                    Memories
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="media"
                  className="font-body text-xs gap-1.5"
                  data-ocid="moment-tab-media"
                >
                  <Images className="w-3.5 h-3.5" />
                  Media
                </TabsTrigger>
                <TabsTrigger
                  value="people"
                  className="font-body text-xs gap-1.5"
                  data-ocid="moment-tab-people"
                >
                  <Users className="w-3.5 h-3.5" />
                  People
                </TabsTrigger>
                {showAccessTab && (
                  <TabsTrigger
                    value="access"
                    className="font-body text-xs gap-1.5"
                    data-ocid="moment-tab-access"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Access
                  </TabsTrigger>
                )}
              </TabsList>

              {isAttending && (
                <TabsContent value="memories" className="mt-4">
                  <MemoriesTab momentId={moment.id} />
                </TabsContent>
              )}

              <TabsContent value="media" className="mt-4">
                <MomentMediaTab momentId={moment.id} isOwner={moment.isOwner} />
              </TabsContent>

              <TabsContent value="people" className="mt-4">
                <AttendeesTab momentId={momentId} />
              </TabsContent>

              {showAccessTab && (
                <TabsContent value="access" className="mt-4">
                  <AccessRequestsPanel momentId={moment.id} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </Layout>

      {/* Event Pass modal — rendered outside Layout to avoid stacking context issues */}
      {showEventPass && (
        <EventPassModal
          momentId={momentId}
          actor={actor}
          isFetchingActor={isFetching}
          onClose={() => setShowEventPass(false)}
        />
      )}
    </AuthGuard>
  );
}

/** Route component for /moments/$momentId */
export function MomentDetailPage() {
  const { momentId } = useParams({ from: "/moments/$momentId" });
  return <MomentDetailContent momentId={momentId} />;
}
