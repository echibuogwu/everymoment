import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef } from "react";
import { QUERY_KEYS } from "../lib/query-keys";
import type { AttendanceInfo } from "../types";

interface EventPassModalProps {
  momentId: string;
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
  actor,
  isFetchingActor,
  onClose,
}: EventPassModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open native dialog and handle close events
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Lock body scroll while open
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

  const qrPayload = attendanceInfo
    ? JSON.stringify({
        username: attendanceInfo.username,
        momentTitle: attendanceInfo.momentTitle,
        momentDate: formatTs(attendanceInfo.momentDate),
        rsvpTime: formatTs(attendanceInfo.rsvpTime),
        status: attendanceInfo.status,
      })
    : "";

  return (
    <dialog
      ref={dialogRef}
      aria-label="Event Pass"
      onClose={onClose}
      className="
        fixed inset-0 m-auto p-0 w-full max-w-xs
        rounded-2xl border border-border bg-card shadow-2xl
        backdrop:bg-foreground/60 backdrop:backdrop-blur-sm
        overflow-hidden
      "
      data-ocid="event-pass-modal"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close event pass"
        className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        data-ocid="event-pass-close-button"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Header strip */}
      <div className="bg-primary px-5 pt-6 pb-4">
        <p className="font-display font-bold text-primary-foreground text-lg leading-tight">
          Event Pass
        </p>
        {attendanceInfo && (
          <p className="font-body text-primary-foreground/70 text-sm mt-0.5 truncate">
            {attendanceInfo.momentTitle}
          </p>
        )}
      </div>

      {/* QR body */}
      <div className="px-5 py-6 flex flex-col items-center gap-4">
        {isLoading || isFetchingActor ? (
          <Skeleton className="w-[180px] h-[180px] rounded-lg" />
        ) : !attendanceInfo || !qrPayload ? (
          <div
            className="w-[180px] h-[180px] rounded-lg bg-muted flex items-center justify-center"
            data-ocid="event-pass-error_state"
          >
            <p className="text-xs text-muted-foreground font-body text-center px-4">
              Could not load attendance info.
            </p>
          </div>
        ) : (
          <div
            className="p-3 bg-background rounded-xl border border-border"
            data-ocid="event-pass-qr-container"
          >
            <QRCodeSVG
              value={qrPayload}
              size={180}
              level="M"
              includeMargin={false}
              className="rounded"
            />
          </div>
        )}

        {attendanceInfo && (
          <div className="w-full space-y-1 border-t border-border pt-4">
            <PassRow label="Status" value={attendanceInfo.status} />
            <PassRow label="RSVP'd" value={formatTs(attendanceInfo.rsvpTime)} />
            <PassRow
              label="Event date"
              value={formatTs(attendanceInfo.momentDate)}
            />
            <PassRow label="User" value={`@${attendanceInfo.username}`} />
          </div>
        )}

        <p className="text-[11px] text-muted-foreground font-body text-center leading-snug">
          Scan this QR code to verify attendance
        </p>
      </div>
    </dialog>
  );
}

function PassRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-0.5">
      <span className="text-xs text-muted-foreground font-body flex-shrink-0">
        {label}
      </span>
      <span className="text-xs font-body text-foreground font-medium text-right min-w-0 break-words">
        {value}
      </span>
    </div>
  );
}
