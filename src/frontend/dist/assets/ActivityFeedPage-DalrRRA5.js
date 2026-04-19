import { u as useAuth, d as useQueryClient, _ as useActivityFeed, j as jsxRuntimeExports, g as Link, Q as QUERY_KEYS, $ as ActivityKind, a as useBackend, f as useQuery } from "./index-DXT1CttK.js";
import { L as Layout, a as Activity, f as Avatar, h as AvatarFallback } from "./Layout-DiYsrWyj.js";
import { S as Skeleton } from "./skeleton-bPGqVL12.js";
import { R as RefreshCw } from "./refresh-cw-hMIBzGt8.js";
import { U as UserPlus } from "./user-plus-DcnJnNhR.js";
import { c as createLucideIcon } from "./proxy-BmYmrhIs.js";
import { C as CalendarPlus } from "./calendar-plus-gyUAFyGe.js";
import "./index-C1qqjek8.js";
import "./user--0LaG4fi.js";
import "./sun-BljhWh_d.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
const KIND_META = {
  [ActivityKind.createdMoment]: {
    icon: CalendarPlus,
    verb: "created a moment",
    color: "text-accent"
  },
  [ActivityKind.rsvpdToMoment]: {
    icon: Star,
    verb: "is attending",
    color: "text-green-400"
  },
  [ActivityKind.followedUser]: {
    icon: UserPlus,
    verb: "started following",
    color: "text-blue-400"
  }
};
function relativeTime(ts) {
  const now = Date.now();
  const then = Number(ts) / 1e6;
  const diff = now - then;
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
function useUserDisplay(userId) {
  const { actor } = useBackend();
  const { data: profile } = useQuery({
    queryKey: QUERY_KEYS.userProfile(userId ?? ""),
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        return actor.getUserProfile({ toString: () => userId });
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!userId,
    staleTime: 5 * 6e4
  });
  if (!userId) return { label: "Someone", username: null };
  const username = (profile == null ? void 0 : profile.username) ?? null;
  const label = username ? `@${username}` : (profile == null ? void 0 : profile.name) ?? (userId.length > 14 ? `${userId.slice(0, 12)}…` : userId);
  return { label, username };
}
function useMomentTitle(momentId) {
  const { actor } = useBackend();
  const { data: moment } = useQuery({
    queryKey: QUERY_KEYS.momentDetail(momentId ?? ""),
    queryFn: async () => {
      if (!actor || !momentId) return null;
      return actor.getMomentDetail(momentId);
    },
    enabled: !!actor && !!momentId,
    staleTime: 5 * 6e4
  });
  return (moment == null ? void 0 : moment.title) ?? "a moment";
}
function ActivityItem({
  event,
  index
}) {
  var _a;
  const meta = KIND_META[event.kind] ?? {
    icon: Activity,
    verb: "did something",
    color: "text-muted-foreground"
  };
  const Icon = meta.icon;
  const actorId = event.actorId.toString();
  const targetId = (_a = event.targetUserId) == null ? void 0 : _a.toString();
  const { label: actorLabel, username: actorUsername } = useUserDisplay(actorId);
  const { label: targetLabel, username: targetUsername } = useUserDisplay(
    event.kind === ActivityKind.followedUser ? targetId : void 0
  );
  const momentTitle = useMomentTitle(
    event.kind !== ActivityKind.followedUser ? event.momentId : void 0
  );
  const actorInitials = actorLabel.replace("@", "").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start gap-3.5 px-4 py-3.5 border-b border-border/20 last:border-0",
      "data-ocid": `activity.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-9 h-9 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs bg-muted text-foreground/70 font-semibold", children: actorInitials }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground leading-snug", children: [
            actorUsername ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/profile/$username",
                params: { username: actorUsername },
                className: "font-semibold text-foreground hover:text-accent hover:underline transition-colors",
                "data-ocid": `activity.actor_link.${index + 1}`,
                children: actorLabel
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: actorLabel }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: meta.color, children: meta.verb }),
            event.momentId && event.kind !== ActivityKind.followedUser && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/moments/$momentId",
                  params: { momentId: event.momentId },
                  className: "font-medium text-foreground hover:text-accent hover:underline transition-colors",
                  "data-ocid": `activity.moment_link.${index + 1}`,
                  children: momentTitle
                }
              )
            ] }),
            event.kind === ActivityKind.followedUser && targetId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " ",
              targetUsername ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/profile/$username",
                  params: { username: targetUsername },
                  className: "font-semibold text-foreground hover:text-accent hover:underline transition-colors",
                  "data-ocid": `activity.target_link.${index + 1}`,
                  children: targetLabel
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: targetLabel })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-5 h-5 rounded-full flex items-center justify-center bg-muted/60 ${meta.color}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3 h-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: relativeTime(event.createdAt) })
          ] })
        ] })
      ]
    }
  );
}
function ActivityFeedPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { data: events = [], isLoading, isFetching } = useActivityFeed();
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activityFeed });
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 gap-4",
        "data-ocid": "activity.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-7 h-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Sign in to view your activity feed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/explore",
              className: "text-xs text-accent hover:underline",
              "data-ocid": "activity.explore_link",
              children: "Browse moments →"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6", "data-ocid": "activity.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Activity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "What people you follow are up to" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleRefresh,
          disabled: isFetching,
          className: "w-9 h-9 rounded-full glass-card flex items-center justify-center hover:ring-1 hover:ring-accent/40 transition-smooth disabled:opacity-50",
          "aria-label": "Refresh activity feed",
          "data-ocid": "activity.refresh_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefreshCw,
            {
              className: `w-4 h-4 text-foreground ${isFetching ? "animate-spin" : ""}`
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-2xl border border-border/40 overflow-hidden",
        style: {
          backdropFilter: "blur(12px)",
          backgroundColor: "color-mix(in oklch, var(--card) 50%, transparent)"
        },
        "data-ocid": "activity.list",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-4", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3" })
          ] })
        ] }, i)) }) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 gap-3 text-center px-6",
            "data-ocid": "activity.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-6 h-6 text-muted-foreground/40" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Nothing to show yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Follow people to see their activity here" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/explore",
                  className: "text-xs text-accent hover:underline mt-1",
                  "data-ocid": "activity.explore_cta",
                  children: "Discover moments →"
                }
              )
            ]
          }
        ) : events.map((event, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityItem, { event, index: i }, String(event.id)))
      }
    )
  ] }) });
}
export {
  ActivityFeedPage
};
