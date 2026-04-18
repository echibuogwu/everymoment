import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AtSign,
  Bell,
  BellOff,
  CalendarCheck,
  Check,
  CheckCheck,
  Megaphone,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../hooks/use-backend";
import { NotificationKind } from "../types";
import type { Notification } from "../types";

const KIND_META: Record<
  NotificationKind,
  { icon: React.ElementType; label: string; color: string }
> = {
  [NotificationKind.newFollower]: {
    icon: UserPlus,
    label: "New follower",
    color: "text-blue-400",
  },
  [NotificationKind.rsvpToYourMoment]: {
    icon: CalendarCheck,
    label: "New RSVP",
    color: "text-green-400",
  },
  [NotificationKind.accessRequestResolved]: {
    icon: Check,
    label: "Access request",
    color: "text-accent",
  },
  [NotificationKind.newMessage]: {
    icon: MessageCircle,
    label: "New message",
    color: "text-purple-400",
  },
  [NotificationKind.mentioned]: {
    icon: AtSign,
    label: "Mention",
    color: "text-yellow-400",
  },
  [NotificationKind.newAnnouncement]: {
    icon: Megaphone,
    label: "Announcement",
    color: "text-orange-400",
  },
};

function getNavigationTarget(
  notification: Notification,
): { to: string; params?: Record<string, string> } | null {
  if (
    notification.kind === NotificationKind.rsvpToYourMoment ||
    notification.kind === NotificationKind.newAnnouncement ||
    notification.kind === NotificationKind.accessRequestResolved
  ) {
    if (notification.referenceId) {
      return {
        to: "/moments/$momentId",
        params: { momentId: notification.referenceId },
      };
    }
  }
  if (notification.kind === NotificationKind.newMessage) {
    return { to: "/messages" };
  }
  if (notification.kind === NotificationKind.newFollower) {
    // referenceId may carry the follower's username — navigate to their profile
    if (notification.referenceId) {
      return {
        to: "/profile/$username",
        params: { username: notification.referenceId },
      };
    }
    return { to: "/dashboard" };
  }
  return null;
}

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

function getDateGroup(ts: bigint): string {
  const now = new Date();
  const then = new Date(Number(ts) / 1_000_000);
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thenDay = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const diffDays = Math.floor(
    (nowDay.getTime() - thenDay.getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier";
}

function NotificationItem({ notification }: { notification: Notification }) {
  const navigate = useNavigate();
  const { mutate: markRead } = useMarkNotificationRead();
  const meta = KIND_META[notification.kind] ?? {
    icon: Bell,
    label: "Notification",
    color: "text-muted-foreground",
  };
  const Icon = meta.icon;
  const target = getNavigationTarget(notification);

  const handleClick = () => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
    if (!target) return;
    if (target.params?.momentId) {
      navigate({
        to: "/moments/$momentId",
        params: { momentId: target.params.momentId },
      });
    } else if (target.params?.username) {
      navigate({
        to: "/profile/$username",
        params: { username: target.params.username },
      });
    } else if (target.to === "/messages") {
      navigate({ to: "/messages" });
    } else if (target.to === "/dashboard") {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors duration-150",
        "hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        !notification.isRead &&
          "bg-accent/5 border-l-2 border-accent hover:bg-accent/8",
        notification.isRead && "border-l-2 border-transparent",
      )}
      data-ocid={`notification.item.${String(notification.id)}`}
    >
      {/* Icon bubble */}
      <div
        className={cn(
          "mt-0.5 flex items-center justify-center w-9 h-9 rounded-full shrink-0",
          "bg-muted/60",
          meta.color,
        )}
      >
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {meta.label}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {relativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-foreground mt-0.5 leading-snug break-words">
          {notification.message}
        </p>
        {target && (
          <span className="text-xs text-accent mt-1 inline-block">View →</span>
        )}
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5 flex-shrink-0" />
      )}
    </button>
  );
}

function NotificationGroup({
  label,
  items,
}: {
  label: string;
  items: Notification[];
}) {
  return (
    <div>
      <div className="px-4 py-2 bg-muted/20 border-b border-border/30">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
      </div>
      {items.map((n) => (
        <div
          key={String(n.id)}
          className="border-b border-border/20 last:border-0"
        >
          <NotificationItem notification={n} />
        </div>
      ))}
    </div>
  );
}

export function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markAll, isPending } = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-24 gap-4"
          data-ocid="notifications.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
            <Bell className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Sign in to view notifications
          </p>
          <Link
            to="/explore"
            className="text-xs text-accent hover:underline"
            data-ocid="notifications.explore_link"
          >
            Browse moments →
          </Link>
        </div>
      </Layout>
    );
  }

  // Group notifications by date
  const groups: Record<string, Notification[]> = {};
  for (const n of notifications) {
    const group = getDateGroup(n.createdAt);
    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  }
  const groupOrder = ["Today", "Yesterday", "Earlier"].filter(
    (g) => groups[g]?.length,
  );

  return (
    <Layout>
      <div className="pt-6" data-ocid="notifications.page">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markAll()}
              disabled={isPending}
              className="h-8 px-3 text-xs gap-1.5 rounded-full"
              data-ocid="notifications.mark_all_read_button"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div
          className="rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/20"
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor:
              "color-mix(in oklch, var(--card) 50%, transparent)",
          }}
          data-ocid="notifications.list"
        >
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6"
              data-ocid="notifications.empty_state"
            >
              <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center">
                <BellOff className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">
                You're all caught up!
              </p>
              <p className="text-xs text-muted-foreground">
                New activity will appear here
              </p>
            </div>
          ) : (
            groupOrder.map((group) => (
              <NotificationGroup
                key={group}
                label={group}
                items={groups[group]}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
