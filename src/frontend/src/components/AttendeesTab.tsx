import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const RSVP_VARIANT: Record<
  RsvpStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [RsvpStatus.attending]: "default",
  [RsvpStatus.maybe]: "secondary",
  [RsvpStatus.notAttending]: "destructive",
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
      className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0"
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
        className="flex items-center gap-3 flex-1 min-w-0 text-left tap-target"
      >
        <Avatar className="w-9 h-9 flex-shrink-0">
          {profile?.photo && (
            <AvatarImage
              src={profile.photo.getDirectURL()}
              alt={profile.username}
            />
          )}
          <AvatarFallback className="font-display font-semibold text-sm bg-secondary text-secondary-foreground">
            {profile ? profile.username.slice(0, 2).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-body font-medium text-sm text-foreground truncate">
            {profile ? `@${profile.username}` : "Loading…"}
          </span>
          <Badge
            variant={RSVP_VARIANT[attendee.rsvpStatus]}
            className="w-fit text-xs mt-0.5"
            data-ocid="rsvp-badge"
          >
            {RSVP_LABELS[attendee.rsvpStatus]}
          </Badge>
        </div>
      </button>

      {!isOwnProfile && (
        <Button
          size="sm"
          variant={isFollowingQuery.data ? "outline" : "ghost"}
          onClick={() => followMutation.mutate()}
          disabled={followMutation.isPending || isFollowingQuery.isLoading}
          className="tap-target flex-shrink-0"
          data-ocid="attendee-follow-btn"
          aria-label={isFollowingQuery.data ? "Unfollow" : "Follow"}
        >
          {isFollowingQuery.data ? (
            <UserMinus className="w-4 h-4" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
        </Button>
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
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="w-28 h-4 rounded" />
              <Skeleton className="w-16 h-3 rounded" />
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
    <div className="pt-2" data-ocid="attendees-list">
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
