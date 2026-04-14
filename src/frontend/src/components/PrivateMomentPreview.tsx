import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      const msg = err.message || "Failed to request access, please try again";
      setInlineError(msg);
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
      {/* Dimmed cover image */}
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted">
        {moment.coverImage ? (
          <img
            src={moment.coverImage.getDirectURL()}
            alt={moment.title}
            className="w-full h-full object-cover"
            style={{
              filter: "brightness(0.35) blur(2px)",
              transform: "scale(1.05)",
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
          <div className="w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center border border-border/30">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <p className="text-white font-display font-semibold text-lg leading-tight drop-shadow-md">
            {moment.title}
          </p>
          {ownerUsername && (
            <p className="text-white/70 text-sm font-body drop-shadow-sm">
              by @{ownerUsername}
            </p>
          )}
        </div>
      </div>

      {/* Status + Action */}
      <div className="space-y-3 px-2 pb-2">
        {/* Success state — request was just sent */}
        {requestSent ? (
          <div
            className="flex flex-col items-center gap-2"
            data-ocid="access-request-sent"
          >
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-5 h-5 text-foreground" />
              <span className="text-sm font-body font-medium">
                Access request sent!
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              The owner will review your request.
            </p>
          </div>
        ) : status === AccessStatus.pending ? (
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-body"
            data-ocid="access-pending-badge"
          >
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            Access Requested — Pending Approval
          </Badge>
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
            <Button
              size="sm"
              variant="outline"
              onClick={handleRequestAccess}
              disabled={requestMutation.isPending}
              data-ocid="re-request-access-btn"
              className="tap-target"
            >
              {requestMutation.isPending ? "Requesting…" : "Re-request Access"}
            </Button>
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-body">
              This is a private moment. Sign in to request access.
            </p>
            <Button
              onClick={login}
              data-ocid="sign-in-to-request-access-btn"
              className="tap-target gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign in to Request Access
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
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
            <Button
              onClick={handleRequestAccess}
              disabled={requestMutation.isPending}
              data-ocid="request-access-btn"
              className="tap-target"
            >
              {requestMutation.isPending ? "Requesting…" : "Request Access"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
