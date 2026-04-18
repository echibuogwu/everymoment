import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Lock, LogIn, UserX } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { AccessStatus } from "../types";
import type { MomentDetail } from "../types";

interface PrivateMomentPreviewProps {
  moment: MomentDetail;
  ownerUsername?: string;
}

export function PrivateMomentPreview({
  moment,
  ownerUsername,
}: PrivateMomentPreviewProps) {
  const { actor } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const status = moment.callerAccessStatus ?? null;
  const [requestSent, setRequestSent] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const requestMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.requestMomentAccess(moment.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
    },
    onSuccess: () => {
      setRequestSent(true);
      setInlineError(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentDetail(moment.id.toString()),
      });
    },
    onError: (err: Error) => {
      setInlineError(
        err.message || "Failed to request access, please try again",
      );
    },
  });

  const handleRequestAccess = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setInlineError(null);
    requestMutation.mutate();
  };

  const isDeniedOrRevoked =
    status === AccessStatus.denied || status === AccessStatus.revoked;

  return (
    <div
      className="flex flex-col items-center text-center space-y-5"
      data-ocid="private-moment-preview"
    >
      {/* Dimmed cover image with glass overlay */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
        {moment.coverImage ? (
          <img
            src={moment.coverImage.getDirectURL()}
            alt={moment.title}
            className="w-full h-full object-cover"
            style={{
              filter: "brightness(0.3) blur(3px)",
              transform: "scale(1.06)",
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        {/* Glass overlay card centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center glass-card glow-accent"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <p className="text-white font-display font-bold text-xl leading-tight drop-shadow-lg">
            {moment.title}
          </p>
          {ownerUsername && (
            <p className="text-white/60 text-sm font-body drop-shadow">
              by @{ownerUsername}
            </p>
          )}
        </div>
      </div>

      {/* Status + Action */}
      <div className="space-y-3 px-2 pb-2 w-full max-w-xs">
        {requestSent ? (
          <div
            className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 animate-scale-in"
            data-ocid="access-request-sent"
          >
            <CheckCircle2 className="w-6 h-6 text-accent" />
            <p className="text-sm font-body font-semibold text-foreground">
              Access request sent!
            </p>
            <p className="text-xs text-muted-foreground font-body">
              The owner will review your request.
            </p>
          </div>
        ) : status === AccessStatus.pending ? (
          <div
            className="glass-card rounded-2xl px-4 py-3 flex items-center gap-2 justify-center"
            data-ocid="access-pending-badge"
          >
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-sm font-body font-medium text-foreground">
              Access Requested — Pending Approval
            </span>
          </div>
        ) : isDeniedOrRevoked ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <UserX className="w-4 h-4" />
              <span className="text-sm font-body">
                {status === AccessStatus.revoked
                  ? "Your access has been revoked."
                  : "Your access request was denied."}
              </span>
            </div>
            {inlineError && (
              <p
                className="text-xs text-destructive font-body"
                data-ocid="access-request-error"
              >
                {inlineError}
              </p>
            )}
            <button
              type="button"
              onClick={handleRequestAccess}
              disabled={requestMutation.isPending}
              data-ocid="re-request-access-btn"
              className="w-full glass-card rounded-2xl px-5 py-3 text-sm font-body font-semibold text-foreground button-spring transition-smooth hover:opacity-80 disabled:opacity-50 min-h-12"
            >
              {requestMutation.isPending ? "Requesting…" : "Re-request Access"}
            </button>
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-body">
              This is a private moment. Sign in to request access.
            </p>
            <button
              type="button"
              onClick={login}
              data-ocid="sign-in-to-request-access-btn"
              className="w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-body font-semibold text-accent-foreground bg-accent glow-accent button-spring transition-smooth hover:opacity-90 min-h-12"
            >
              <LogIn className="w-4 h-4" />
              Sign in to Request Access
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-body">
              This is a private moment. Request access to view it.
            </p>
            {inlineError && (
              <p
                className="text-xs text-destructive font-body"
                data-ocid="access-request-error"
              >
                {inlineError}
              </p>
            )}
            <button
              type="button"
              onClick={handleRequestAccess}
              disabled={requestMutation.isPending}
              data-ocid="request-access-btn"
              className="w-full flex items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-body font-semibold text-accent-foreground bg-accent glow-accent button-spring transition-smooth hover:opacity-90 disabled:opacity-50 min-h-12"
            >
              {requestMutation.isPending ? "Requesting…" : "Request Access"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
