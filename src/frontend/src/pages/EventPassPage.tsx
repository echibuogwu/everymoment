import { createActorWithConfig } from "@caffeineai/core-infrastructure";
import { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  QrCode,
  Ticket,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { createActor } from "../backend";
import type { AttendanceInfo, MomentDetail } from "../types";

function formatTs(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PassDetail({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      className="flex items-start gap-3 py-3 border-b border-white/10 last:border-0"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-body text-white/40 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm font-body font-semibold break-words ${highlight ? "" : "text-white/90"}`}
          style={highlight ? { color: "oklch(0.72 0.28 280)" } : undefined}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/** Creates an anonymous (no-auth) actor instance for public queries. */
async function getAnonActor() {
  return createActorWithConfig(createActor) as unknown as {
    getEventPassInfo: (
      momentId: string,
      userId: Principal,
    ) => Promise<
      { __kind__: "ok"; ok: AttendanceInfo } | { __kind__: "err"; err: string }
    >;
    getMomentDetail: (momentId: string) => Promise<MomentDetail | null>;
  };
}

function EventPassContent({
  momentId,
  userId,
}: {
  momentId: string;
  userId: string;
}) {
  const {
    data: info,
    isLoading: isLoadingInfo,
    isError,
  } = useQuery<AttendanceInfo | null>({
    queryKey: ["event-pass", momentId, userId],
    queryFn: async () => {
      let principal: Principal;
      try {
        principal = Principal.fromText(decodeURIComponent(userId));
      } catch {
        return null;
      }
      const actor = await getAnonActor();
      const result = await actor.getEventPassInfo(momentId, principal);
      if ("ok" in result) return result.ok;
      return null;
    },
    retry: false,
  });

  const { data: momentDetail, isLoading: isLoadingMoment } =
    useQuery<MomentDetail | null>({
      queryKey: ["event-pass-moment", momentId],
      queryFn: async () => {
        const actor = await getAnonActor();
        return actor.getMomentDetail(momentId);
      },
      retry: false,
    });

  const isLoading = isLoadingInfo || isLoadingMoment;

  const coverImageUrl = momentDetail?.coverImage?.getDirectURL?.() ?? null;

  const momentShareUrl = `${window.location.origin}/moment/${momentId}`;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.08 0.04 280) 0%, oklch(0.05 0.02 300) 50%, oklch(0.06 0.03 260) 100%)",
      }}
    >
      {/* Background glow orbs */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, oklch(0.45 0.22 280 / 0.12) 0%, transparent 50%),radial-gradient(ellipse at 80% 80%, oklch(0.45 0.22 300 / 0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative w-full max-w-sm mx-auto">
        {/* EveryMoment branding header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
              boxShadow: "0 0 20px oklch(0.55 0.28 280 / 0.4)",
            }}
          >
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white/90 text-lg tracking-tight">
            EveryMoment
          </span>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 24,
            delay: 0.1,
          }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.14 0.04 280), oklch(0.08 0.03 300))",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset",
          }}
          data-ocid="event-pass-page-card"
        >
          {/* Cover image hero */}
          {!isLoading && (
            <div className="relative w-full h-44 overflow-hidden">
              {coverImageUrl ? (
                <motion.img
                  src={coverImageUrl}
                  alt={info?.momentTitle ?? "Moment cover"}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.08, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.35 0.18 280), oklch(0.25 0.14 300), oklch(0.20 0.10 260))",
                  }}
                />
              )}
              {/* Gradient fade to card bg */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 40%, oklch(0.14 0.04 280) 100%)",
                }}
              />
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 0%, oklch(0.55 0.28 280 / 0.15) 0%, transparent 55%)",
                }}
              />
            </div>
          )}

          {/* Top shimmer when no image shown yet */}
          {isLoading && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 0%, oklch(0.55 0.28 280 / 0.12) 0%, transparent 55%)",
              }}
            />
          )}

          {/* Card header */}
          <div className="relative px-6 pt-4 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
                  boxShadow: "0 0 20px oklch(0.55 0.28 280 / 0.35)",
                }}
              >
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-xl leading-tight">
                  Event Pass
                </p>
                {info && (
                  <p className="text-white/50 text-xs font-body mt-0.5 truncate max-w-[200px]">
                    {info.momentTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Verified badge */}
            {info && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-1"
                style={{
                  background: "rgba(100, 220, 140, 0.12)",
                  border: "1px solid rgba(100, 220, 140, 0.25)",
                }}
              >
                <CheckCircle2
                  className="w-3.5 h-3.5"
                  style={{ color: "oklch(0.72 0.20 142)" }}
                />
                <span
                  className="text-[11px] font-body font-semibold"
                  style={{ color: "oklch(0.72 0.20 142)" }}
                >
                  Verified Attendance
                </span>
              </motion.div>
            )}
          </div>

          {/* Dashed divider — ticket perforation */}
          <div className="mx-6 border-t border-dashed border-white/10" />

          {/* Content */}
          <div className="px-6 py-4">
            {isLoading && (
              <div
                className="py-8 flex flex-col items-center gap-3"
                data-ocid="event-pass-loading_state"
              >
                <div
                  className="w-10 h-10 rounded-full animate-pulse"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
                <p className="text-sm font-body text-white/40">
                  Loading pass details…
                </p>
              </div>
            )}

            {isError && !isLoading && (
              <div
                className="py-8 text-center"
                data-ocid="event-pass-error_state"
              >
                <p className="text-sm font-body text-white/50">
                  Could not load pass details. This link may be invalid.
                </p>
              </div>
            )}

            {!isLoading && !isError && !info && (
              <div
                className="py-8 text-center"
                data-ocid="event-pass-not-found_state"
              >
                <p className="text-sm font-body text-white/50">
                  No attendance record found for this user.
                </p>
              </div>
            )}

            {info && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                data-ocid="event-pass-details"
              >
                <PassDetail
                  icon={<User className="w-4 h-4 text-white/60" />}
                  label="Attendee"
                  value={`@${info.username}`}
                />
                <PassDetail
                  icon={<CheckCircle2 className="w-4 h-4 text-white/60" />}
                  label="Status"
                  value={info.status}
                  highlight
                />
                <PassDetail
                  icon={<CalendarDays className="w-4 h-4 text-white/60" />}
                  label="Event date"
                  value={formatTs(info.momentDate)}
                />
                <PassDetail
                  icon={<Clock className="w-4 h-4 text-white/60" />}
                  label="RSVP'd on"
                  value={formatTs(info.rsvpTime)}
                />
              </motion.div>
            )}
          </div>

          {/* Re-share QR code section */}
          {info && !isLoading && (
            <>
              <div className="mx-6 border-t border-dashed border-white/10" />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="px-6 py-5 flex flex-col items-center gap-3"
                data-ocid="event-pass-reshare-qr"
              >
                <div className="flex items-center gap-2">
                  <QrCode
                    className="w-4 h-4"
                    style={{ color: "oklch(0.72 0.28 280)" }}
                  />
                  <p className="text-[12px] font-body font-semibold text-white/60 uppercase tracking-wider">
                    Share this moment
                  </p>
                </div>
                <div
                  className="p-3 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.96)",
                    boxShadow: "0 0 24px oklch(0.55 0.28 280 / 0.25)",
                  }}
                >
                  <QRCodeSVG
                    value={momentShareUrl}
                    size={140}
                    bgColor="rgba(255,255,255,0)"
                    fgColor="#1a0a2e"
                    level="M"
                  />
                </div>
                <p className="text-[11px] font-body text-center text-white/30 leading-relaxed max-w-[200px]">
                  Scan to open this moment and invite others
                </p>
              </motion.div>
            </>
          )}

          {/* Footer watermark */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-body text-white/25">
              Powered by EveryMoment
            </span>
            <span className="text-[11px] font-body text-white/25">
              caffeine.ai
            </span>
          </div>
        </motion.div>

        {/* Sub-caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs font-body mt-4"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          This pass was generated from a verified QR code scan.
        </motion.p>
      </div>
    </div>
  );
}

export function EventPassPage() {
  const { momentId, userId } = useParams({
    from: "/event-pass/$momentId/$userId",
  });
  return <EventPassContent momentId={momentId} userId={userId} />;
}
