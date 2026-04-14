import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import type { MomentId } from "../types";
import { AccessStatus } from "../types";
import type { AccessRequest } from "../types";

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
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="access-requests-panel">
      {/* Pending requests */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-sm text-foreground">
            Pending Requests
          </h3>
          {pending.length > 0 && (
            <Badge variant="secondary" className="text-xs">
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
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      resolveMutation.mutate({
                        requester: req.requester,
                        approved: false,
                      })
                    }
                    disabled={resolveMutation.isPending}
                    data-ocid="deny-request-btn"
                    aria-label="Deny access"
                  >
                    <XCircle className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      resolveMutation.mutate({
                        requester: req.requester,
                        approved: true,
                      })
                    }
                    disabled={resolveMutation.isPending}
                    data-ocid="approve-request-btn"
                    aria-label="Approve access"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Approved users */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold text-sm text-foreground">
            Approved Access
          </h3>
          {approved.length > 0 && (
            <Badge variant="secondary" className="text-xs">
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
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => revokeMutation.mutate(req.requester)}
                  disabled={revokeMutation.isPending}
                  data-ocid="revoke-access-btn"
                  className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 flex-shrink-0"
                >
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
