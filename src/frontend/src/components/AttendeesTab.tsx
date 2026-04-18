import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { UserMinus, UserPlus, Users } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { showError, showSuccess } from "../lib/toast";
import { RsvpStatus } from "../types";
import type { Attendee } from "../types";
import { EmptyState } from "./EmptyState";

interface AttendeesTabProps {
  momentId: string;
}

const RSVP_LABELS: Record<RsvpStatus, string> = {
  [RsvpStatus.attending]: "Attending",
  [RsvpStatus.maybe]: "Maybe",
  [RsvpStatus.notAttending]: "Not Attending",
};

// Glass pill color per RSVP status
const RSVP_DOT: Record<RsvpStatus, string> = {
  [RsvpStatus.attending]: "bg-accent",
  [RsvpStatus.maybe]: "bg-yellow-400",
  [RsvpStatus.notAttending]: "bg-destructive",
};

interface AttendeeRowProps {
  attendee: Attendee;
  isOwnProfile: boolean;
}

function AttendeeRow({ attendee, isOwnProfile }: AttendeeRowProps) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const attendeeId = attendee.userId.toText();

  const profileQuery = useQuery({
    queryKey: QUERY_KEYS.userProfile(attendeeId),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(attendee.userId);
    },
    enabled: !!actor,
  });

  const isFollowingQuery = useQuery<boolean>({
    queryKey: QUERY_KEYS.isFollowing(attendeeId),
    queryFn: async () => {
      if (!actor || isOwnProfile) return false;
      return actor.isFollowingUser(attendee.userId);
    },
    enabled: !!actor && !isOwnProfile,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (isFollowingQuery.data) {
        await actor.unfollowUser(attendee.userId);
      } else {
        await actor.followUser(attendee.userId);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.isFollowing(attendeeId),
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.userProfile(attendeeId),
      });
      showSuccess(isFollowingQuery.data ? "Unfollowed" : "Now following!");
    },
    onError: () => showError("Action failed. Try again."),
  });

  const profile = profileQuery.data;

  return (
    <div
      className="glass-card rounded-2xl flex items-center justify-between gap-3 px-4 py-3 animate-slide-up"
      data-ocid="attendee-row"
    >
      <button
        type="button"
        onClick={() =>
          profile &&
          navigate({
            to: "/profile/$username",
            params: { username: profile.username },
          })
        }
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-accent/20">
          {profile?.photo && (
            <AvatarImage
              src={profile.photo.getDirectURL()}
              alt={profile.username}
            />
          )}
          <AvatarFallback className="font-display font-bold text-sm bg-accent/20 text-accent">
            {profile ? profile.username.slice(0, 2).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 gap-1">
          <span className="font-body font-semibold text-sm text-foreground truncate">
            {profile ? `@${profile.username}` : "Loading…"}
          </span>
          {/* Glass RSVP badge */}
          <span className="inline-flex items-center gap-1.5 glass-card rounded-full px-2 py-0.5 w-fit">
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${RSVP_DOT[attendee.rsvpStatus]}`}
            />
            <span
              className="text-xs font-body text-muted-foreground"
              data-ocid="rsvp-badge"
            >
              {RSVP_LABELS[attendee.rsvpStatus]}
            </span>
          </span>
        </div>
      </button>

      {!isOwnProfile && (
        <button
          type="button"
          data-ocid="attendee-follow-btn"
          onClick={() => followMutation.mutate()}
          disabled={followMutation.isPending || isFollowingQuery.isLoading}
          aria-label={isFollowingQuery.data ? "Unfollow" : "Follow"}
          className={[
            "w-9 h-9 rounded-xl flex items-center justify-center transition-smooth button-spring disabled:opacity-50 flex-shrink-0",
            isFollowingQuery.data
              ? "glass-card text-muted-foreground hover:text-foreground"
              : "glass-card text-accent hover:opacity-80",
          ].join(" ")}
        >
          {isFollowingQuery.data ? (
            <UserMinus className="w-4 h-4" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}

export function AttendeesTab({ momentId }: AttendeesTabProps) {
  const { actor, isFetching } = useBackend();
  const { principal } = useAuth();

  const attendeesQuery = useQuery<Attendee[]>({
    queryKey: QUERY_KEYS.momentAttendees(momentId),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMomentAttendees(momentId);
    },
    enabled: !!actor && !isFetching,
  });

  if (attendeesQuery.isLoading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card rounded-2xl flex items-center gap-3 px-4 py-3"
          >
            <Skeleton className="w-10 h-10 rounded-full animate-shimmer" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-28 h-4 rounded-full animate-shimmer" />
              <Skeleton className="w-16 h-3 rounded-full animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!attendeesQuery.data?.length) {
    return (
      <EmptyState
        icon={Users}
        title="No attendees yet"
        description="Be the first to RSVP to this moment."
      />
    );
  }

  return (
    <div className="pt-2 space-y-2" data-ocid="attendees-list">
      {attendeesQuery.data.map((attendee) => {
        const isOwnProfile =
          !!principal && attendee.userId.toText() === principal.toText();
        return (
          <AttendeeRow
            key={attendee.userId.toText()}
            attendee={attendee}
            isOwnProfile={isOwnProfile}
          />
        );
      })}
    </div>
  );
}
