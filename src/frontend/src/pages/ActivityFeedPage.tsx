import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  CalendarPlus,
  RefreshCw,
  Star,
  UserPlus,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useActivityFeed, useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import { ActivityKind } from "../types";
import type { ActivityEvent } from "../types";

const KIND_META: Record<
  ActivityKind,
  { icon: React.ElementType; verb: string; color: string }
> = {
  [ActivityKind.createdMoment]: {
    icon: CalendarPlus,
    verb: "created a moment",
    color: "text-accent",
  },
  [ActivityKind.rsvpdToMoment]: {
    icon: Star,
    verb: "is attending",
    color: "text-green-400",
  },
  [ActivityKind.followedUser]: {
    icon: UserPlus,
    verb: "started following",
    color: "text-blue-400",
  },
};

function relativeTime(ts: bigint): string {
  const now = Date.now();
  const then = Number(ts) / 1_000_000;
  const diff = now - then;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

/** Resolve a principal string to a display label and optional username for routing */
function useUserDisplay(userId: string | undefined): {
  label: string;
  username: string | null;
} {
  const { actor } = useBackend();
  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.userProfile(userId ?? ""),
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return actor.getUserProfile({ toString: () => userId } as any);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!userId,
    staleTime: 5 * 60_000,
  });
  if (!userId) return { label: "Someone", username: null };
  const username = profile?.username ?? null;
  const label = username
    ? `@${username}`
    : (profile?.name ??
      (userId.length > 14 ? `${userId.slice(0, 12)}…` : userId));
  return { label, username };
}

/** Look up a moment's title for display in feed items */
function useMomentTitle(momentId: string | undefined): string {
  const { actor } = useBackend();
  const { data: moment } = useQuery({
    queryKey: QUERY_KEYS.momentDetail(momentId ?? ""),
    queryFn: async () => {
      if (!actor || !momentId) return null;
      return actor.getMomentDetail(momentId);
    },
    enabled: !!actor && !!momentId,
    staleTime: 5 * 60_000,
  });
  return moment?.title ?? "a moment";
}

function ActivityItem({
  event,
  index,
}: {
  event: ActivityEvent;
  index: number;
}) {
  const meta = KIND_META[event.kind] ?? {
    icon: Activity,
    verb: "did something",
    color: "text-muted-foreground",
  };
  const Icon = meta.icon;
  const actorId = event.actorId.toString();
  const targetId = event.targetUserId?.toString();
  const { label: actorLabel, username: actorUsername } =
    useUserDisplay(actorId);
  const { label: targetLabel, username: targetUsername } = useUserDisplay(
    event.kind === ActivityKind.followedUser ? targetId : undefined,
  );
  const momentTitle = useMomentTitle(
    event.kind !== ActivityKind.followedUser ? event.momentId : undefined,
  );
  const actorInitials = actorLabel.replace("@", "").slice(0, 2).toUpperCase();

  return (
    <div
      className="flex items-start gap-3.5 px-4 py-3.5 border-b border-border/20 last:border-0"
      data-ocid={`activity.item.${index + 1}`}
    >
      {/* Actor avatar */}
      <Avatar className="w-9 h-9 shrink-0 mt-0.5">
        <AvatarFallback className="text-xs bg-muted text-foreground/70 font-semibold">
          {actorInitials}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">
          {/* Actor name — links to profile if username available */}
          {actorUsername ? (
            <Link
              to="/profile/$username"
              params={{ username: actorUsername }}
              className="font-semibold text-foreground hover:text-accent hover:underline transition-colors"
              data-ocid={`activity.actor_link.${index + 1}`}
            >
              {actorLabel}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{actorLabel}</span>
          )}{" "}
          <span className={meta.color}>{meta.verb}</span>
          {/* Moment link with title */}
          {event.momentId && event.kind !== ActivityKind.followedUser && (
            <>
              {" "}
              <Link
                to="/moments/$momentId"
                params={{ momentId: event.momentId }}
                className="font-medium text-foreground hover:text-accent hover:underline transition-colors"
                data-ocid={`activity.moment_link.${index + 1}`}
              >
                {momentTitle}
              </Link>
            </>
          )}
          {/* Target user for follow events */}
          {event.kind === ActivityKind.followedUser && targetId && (
            <>
              {" "}
              {targetUsername ? (
                <Link
                  to="/profile/$username"
                  params={{ username: targetUsername }}
                  className="font-semibold text-foreground hover:text-accent hover:underline transition-colors"
                  data-ocid={`activity.target_link.${index + 1}`}
                >
                  {targetLabel}
                </Link>
              ) : (
                <span className="font-semibold text-foreground">
                  {targetLabel}
                </span>
              )}
            </>
          )}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center bg-muted/60 ${meta.color}`}
          >
            <Icon className="w-3 h-3" />
          </div>
          <span className="text-[11px] text-muted-foreground">
            {relativeTime(event.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ActivityFeedPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { data: events = [], isLoading, isFetching } = useActivityFeed();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activityFeed });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-24 gap-4"
          data-ocid="activity.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
            <Activity className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Sign in to view your activity feed
          </p>
          <Link
            to="/explore"
            className="text-xs text-accent hover:underline"
            data-ocid="activity.explore_link"
          >
            Browse moments →
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-6" data-ocid="activity.page">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Activity
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              What people you follow are up to
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:ring-1 hover:ring-accent/40 transition-smooth disabled:opacity-50"
            aria-label="Refresh activity feed"
            data-ocid="activity.refresh_button"
          >
            <RefreshCw
              className={`w-4 h-4 text-foreground ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Feed */}
        <div
          className="rounded-2xl border border-border/40 overflow-hidden"
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor:
              "color-mix(in oklch, var(--card) 50%, transparent)",
          }}
          data-ocid="activity.list"
        >
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6"
              data-ocid="activity.empty_state"
            >
              <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center">
                <Activity className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Nothing to show yet
              </p>
              <p className="text-xs text-muted-foreground">
                Follow people to see their activity here
              </p>
              <Link
                to="/explore"
                className="text-xs text-accent hover:underline mt-1"
                data-ocid="activity.explore_cta"
              >
                Discover moments →
              </Link>
            </div>
          ) : (
            events.map((event, i) => (
              <ActivityItem key={String(event.id)} event={event} index={i} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
