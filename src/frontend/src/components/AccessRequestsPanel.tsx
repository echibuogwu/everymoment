import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import type { AccessRequest, MomentId } from "../types";
import { AccessStatus } from "../types";

interface AccessRequestsPanelProps {
  momentId: MomentId;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AccessRequestsPanel({ momentId }: AccessRequestsPanelProps) {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const momentIdStr = momentId.toString();

  const { data: requests = [], isLoading } = useQuery<AccessRequest[]>({
    queryKey: QUERY_KEYS.momentAccessRequests(momentIdStr),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMomentAccessRequests(momentId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const resolveMutation = useMutation({
    mutationFn: async ({
      requester,
      approved,
    }: {
      requester: AccessRequest["requester"];
      approved: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.resolveAccessRequest(momentId, requester, approved);
    },
    onSuccess: (_, { approved }) => {
      showSuccess(approved ? "Access approved." : "Access denied.");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentAccessRequests(momentIdStr),
      });
    },
    onError: () => showError("Failed to resolve request. Please try again."),
  });

  const revokeMutation = useMutation({
    mutationFn: async (userId: AccessRequest["requester"]) => {
      if (!actor) throw new Error("Not connected");
      await actor.revokeMomentAccess(momentId, userId);
    },
    onSuccess: () => {
      showSuccess("Access revoked.");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentAccessRequests(momentIdStr),
      });
    },
    onError: () => showError("Failed to revoke access. Please try again."),
  });

  const pending = requests.filter((r) => r.status === AccessStatus.pending);
  const approved = requests.filter((r) => r.status === AccessStatus.approved);

  if (isLoading) {
    return (
      <div className="space-y-3 py-2" data-ocid="access-requests-panel">
        {[1, 2].map((i) => (
          <Skeleton
            key={i}
            className="h-16 w-full rounded-2xl animate-shimmer"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="access-requests-panel">
      {/* Pending requests */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-accent" />
          <h3 className="font-display font-semibold text-sm text-foreground">
            Pending Requests
          </h3>
          {pending.length > 0 && (
            <Badge
              variant="secondary"
              className="text-xs glass-card border-0 text-accent"
            >
              {pending.length}
            </Badge>
          )}
        </div>

        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground font-body py-2">
            No pending requests.
          </p>
        ) : (
          <ul className="space-y-2">
            {pending.map((req) => (
              <li
                key={req.requester.toString()}
                className="glass-card rounded-2xl flex items-center justify-between gap-3 px-4 py-3 animate-slide-up"
                data-ocid="access-request-row"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm text-foreground truncate">
                    {req.requester.toString().slice(0, 16)}…
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    Requested {formatDate(req.requestedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Deny */}
                  <button
                    type="button"
                    data-ocid="deny-request-btn"
                    aria-label="Deny access"
                    onClick={() =>
                      resolveMutation.mutate({
                        requester: req.requester,
                        approved: false,
                      })
                    }
                    disabled={resolveMutation.isPending}
                    className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-destructive hover:bg-destructive/15 transition-smooth button-spring disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  {/* Approve */}
                  <button
                    type="button"
                    data-ocid="approve-request-btn"
                    aria-label="Approve access"
                    onClick={() =>
                      resolveMutation.mutate({
                        requester: req.requester,
                        approved: true,
                      })
                    }
                    disabled={resolveMutation.isPending}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-accent glow-accent-sm hover:opacity-90 transition-smooth button-spring disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Approved users */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <h3 className="font-display font-semibold text-sm text-foreground">
            Approved Access
          </h3>
          {approved.length > 0 && (
            <Badge
              variant="secondary"
              className="text-xs glass-card border-0 text-accent"
            >
              {approved.length}
            </Badge>
          )}
        </div>

        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground font-body py-2">
            No approved users yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {approved.map((req) => (
              <li
                key={req.requester.toString()}
                className="glass-card rounded-2xl flex items-center justify-between gap-3 px-4 py-3"
                data-ocid="approved-user-row"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm text-foreground truncate">
                    {req.requester.toString().slice(0, 16)}…
                  </p>
                  {req.resolvedAt && (
                    <p className="text-xs text-muted-foreground font-body">
                      Approved {formatDate(req.resolvedAt)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  data-ocid="revoke-access-btn"
                  onClick={() => revokeMutation.mutate(req.requester)}
                  disabled={revokeMutation.isPending}
                  className="glass-card rounded-xl px-3 py-1.5 text-xs font-body font-medium text-destructive hover:bg-destructive/15 transition-smooth button-spring disabled:opacity-50 flex-shrink-0"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
