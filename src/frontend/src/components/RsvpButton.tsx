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
    activeClass: "bg-accent text-accent-foreground glow-accent-sm",
    inactiveClass:
      "glass-card text-muted-foreground hover:text-accent hover:border-accent/30",
  },
  {
    status: RsvpStatus.maybe,
    label: "Maybe",
    icon: HelpCircle,
    activeClass: "bg-yellow-400/20 text-yellow-500 border-yellow-400/40",
    inactiveClass:
      "glass-card text-muted-foreground hover:text-yellow-500 hover:border-yellow-400/30",
  },
  {
    status: RsvpStatus.notAttending,
    label: "Not Attending",
    icon: X,
    activeClass: "bg-destructive/20 text-destructive border-destructive/40",
    inactiveClass:
      "glass-card text-muted-foreground hover:text-destructive hover:border-destructive/30",
  },
];

export function RsvpButton({ momentId }: RsvpButtonProps) {
  const { actor, isFetching } = useBackend();
  const { principal, isAuthenticated, login, isLoggingIn } = useAuth();
  const queryClient = useQueryClient();

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

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <button
        type="button"
        data-ocid="rsvp-login-prompt"
        onClick={() => login()}
        disabled={isLoggingIn}
        className="glass-card rounded-full flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-smooth button-spring disabled:opacity-60 min-h-10"
      >
        <LogIn className="w-3.5 h-3.5" />
        {isLoggingIn ? "Signing in…" : "Sign in to RSVP"}
      </button>
    );
  }

  // Loading shimmer
  if (attendeesQuery.isLoading) {
    return (
      <div className="flex gap-2" data-ocid="rsvp-buttons">
        {RSVP_OPTIONS.map(({ status }) => (
          <div
            key={status}
            className="h-9 rounded-full animate-shimmer px-4 py-2 min-w-[80px]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap" data-ocid="rsvp-buttons">
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
                "flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-body font-semibold",
                "transition-smooth button-spring",
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
