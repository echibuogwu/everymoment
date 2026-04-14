import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, HelpCircle, LogIn, X } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import { RsvpStatus } from "../types";
import type { Attendee } from "../types";

interface RsvpButtonProps {
  momentId: string;
}

interface RsvpOption {
  status: RsvpStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
  inactiveClass: string;
}

const RSVP_OPTIONS: RsvpOption[] = [
  {
    status: RsvpStatus.attending,
    label: "Attending",
    icon: Check,
    activeClass: "bg-foreground text-background border-foreground",
    inactiveClass:
      "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
  },
  {
    status: RsvpStatus.maybe,
    label: "Maybe",
    icon: HelpCircle,
    activeClass: "bg-muted text-foreground border-foreground",
    inactiveClass:
      "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
  },
  {
    status: RsvpStatus.notAttending,
    label: "Not Attending",
    icon: X,
    activeClass: "bg-destructive/10 text-destructive border-destructive",
    inactiveClass:
      "border-border text-muted-foreground hover:border-destructive hover:text-destructive",
  },
];

export function RsvpButton({ momentId }: RsvpButtonProps) {
  const { actor, isFetching } = useBackend();
  const { principal, isAuthenticated, login, isLoggingIn } = useAuth();
  const queryClient = useQueryClient();

  // Derive current RSVP from attendees list
  const attendeesQuery = useQuery<Attendee[]>({
    queryKey: QUERY_KEYS.momentAttendees(momentId),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMomentAttendees(momentId);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const currentRsvp =
    attendeesQuery.data?.find(
      (a) => principal && a.userId.toText() === principal.toText(),
    )?.rsvpStatus ?? null;

  const rsvpMutation = useMutation({
    mutationFn: async (status: RsvpStatus) => {
      if (!actor) throw new Error("Not connected");
      await actor.setRsvp(momentId, status);
      return status;
    },
    onMutate: async (status: RsvpStatus) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.momentAttendees(momentId),
      });
      const previous = queryClient.getQueryData<Attendee[]>(
        QUERY_KEYS.momentAttendees(momentId),
      );
      queryClient.setQueryData<Attendee[]>(
        QUERY_KEYS.momentAttendees(momentId),
        (old) => {
          if (!old || !principal) return old ?? [];
          const existing = old.find(
            (a) => a.userId.toText() === principal.toText(),
          );
          if (existing) {
            return old.map((a) =>
              a.userId.toText() === principal.toText()
                ? { ...a, rsvpStatus: status }
                : a,
            );
          }
          return [
            ...old,
            {
              userId: principal,
              momentId: momentId,
              rsvpStatus: status,
              joinedAt: BigInt(Date.now()) * 1_000_000n,
            },
          ];
        },
      );
      return { previous };
    },
    onSuccess: (status) => {
      const labels: Record<RsvpStatus, string> = {
        [RsvpStatus.attending]: "Marked as Attending",
        [RsvpStatus.maybe]: "Marked as Maybe",
        [RsvpStatus.notAttending]: "Marked as Not Attending",
      };
      showSuccess(labels[status]);
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QUERY_KEYS.momentAttendees(momentId),
          context.previous,
        );
      }
      showError("Could not save RSVP. Try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentAttendees(momentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.momentDetail(momentId),
      });
    },
  });

  // Unauthenticated: prompt to sign in
  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => login()}
        disabled={isLoggingIn}
        className="gap-2 tap-target font-body"
        data-ocid="rsvp-login-prompt"
      >
        <LogIn className="w-3.5 h-3.5" />
        {isLoggingIn ? "Signing in…" : "Sign in to RSVP"}
      </Button>
    );
  }

  return (
    <div className="flex gap-2" data-ocid="rsvp-buttons">
      {RSVP_OPTIONS.map(
        ({ status, label, icon: Icon, activeClass, inactiveClass }) => {
          const isActive = currentRsvp === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => rsvpMutation.mutate(status)}
              disabled={rsvpMutation.isPending}
              data-ocid={`rsvp-${status}`}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-body font-medium transition-all tap-target",
                isActive ? activeClass : inactiveClass,
                rsvpMutation.isPending
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer",
              ].join(" ")}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        },
      )}
    </div>
  );
}
