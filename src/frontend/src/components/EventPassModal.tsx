import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef } from "react";
import { QUERY_KEYS } from "../lib/query-keys";
import type { AttendanceInfo } from "../types";

interface EventPassModalProps {
  momentId: string;
  currentUserPrincipal: string | null;
  actor: {
    getMyAttendanceInfo: (id: string) => Promise<AttendanceInfo | null>;
  } | null;
  isFetchingActor: boolean;
  onClose: () => void;
}

function formatTs(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventPassModal({
  momentId,
  currentUserPrincipal,
  actor,
  isFetchingActor,
  onClose,
}: EventPassModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const { data: attendanceInfo, isLoading } = useQuery<AttendanceInfo | null>({
    queryKey: [...QUERY_KEYS.momentDetail(momentId), "attendance-info"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyAttendanceInfo(momentId);
    },
    enabled: !!actor && !isFetchingActor,
  });

  const qrPayload =
    attendanceInfo && currentUserPrincipal
      ? `${window.location.origin}/event-pass/${momentId}/${encodeURIComponent(currentUserPrincipal)}`
      : "";

  return (
    <dialog
      ref={dialogRef}
      aria-label="Event Pass"
      onClose={onClose}
      className="fixed inset-0 m-auto p-0 w-full max-w-xs bg-transparent border-0 overflow-visible backdrop:bg-black/60 backdrop:backdrop-blur-md"
      data-ocid="event-pass-modal"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.14 0.04 280), oklch(0.08 0.03 300))",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
        }}
      >
        {/* Shimmer overlay for visual depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, oklch(0.55 0.28 280 / 0.15) 0%, transparent 60%)",
          }}
        />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event pass"
          className="absolute top-3.5 right-3.5 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-smooth"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          data-ocid="event-pass-close-button"
        >
          <X className="w-4 h-4 text-white/70" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2.5 mb-1">
            {/* Ticket icon with glow */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
                boxShadow: "0 0 16px oklch(0.55 0.28 280 / 0.4)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M3 9v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
                <path d="M21 9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2" />
                <path d="M12 12v.01" />
              </svg>
            </div>
            <p className="font-display font-bold text-white text-lg leading-tight">
              Event Pass
            </p>
          </div>
          {attendanceInfo && (
            <p className="font-body text-white/50 text-sm truncate pl-9">
              {attendanceInfo.momentTitle}
            </p>
          )}
        </div>

        {/* Perforated divider */}
        <div className="relative mx-6 border-t border-dashed border-white/10 my-1" />

        {/* QR body */}
        <div className="px-6 py-6 flex flex-col items-center gap-5">
          {isLoading || isFetchingActor ? (
            <Skeleton className="w-[180px] h-[180px] rounded-2xl" />
          ) : !attendanceInfo || !qrPayload ? (
            <div
              className="w-[180px] h-[180px] rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)" }}
              data-ocid="event-pass-error_state"
            >
              <p className="text-xs text-white/50 font-body text-center px-4">
                Could not load attendance info.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 280,
                damping: 22,
              }}
              className="p-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.96)" }}
              data-ocid="event-pass-qr-container"
            >
              <QRCodeSVG
                value={qrPayload}
                size={180}
                level="M"
                includeMargin={false}
                className="rounded-lg"
              />
            </motion.div>
          )}

          {attendanceInfo && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full space-y-2.5"
            >
              <PassRow label="Status" value={attendanceInfo.status} highlight />
              <PassRow
                label="RSVP'd"
                value={formatTs(attendanceInfo.rsvpTime)}
              />
              <PassRow
                label="Event date"
                value={formatTs(attendanceInfo.momentDate)}
              />
              <PassRow label="User" value={`@${attendanceInfo.username}`} />
            </motion.div>
          )}

          <p className="text-[11px] text-white/30 font-body text-center leading-snug">
            Scan to verify attendance
          </p>
        </div>
      </motion.div>
    </dialog>
  );
}

function PassRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-white/40 font-body flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-xs font-body font-semibold text-right min-w-0 break-words ${
          highlight ? "text-accent" : "text-white/80"
        }`}
        style={highlight ? { color: "oklch(0.72 0.28 280)" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
