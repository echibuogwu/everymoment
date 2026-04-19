import { u as useAuth, U as useNotifications, W as useMarkAllNotificationsRead, j as jsxRuntimeExports, g as Link, c as useNavigate, X as useMarkNotificationRead, i as cn, Y as NotificationKind } from "./index-DXT1CttK.js";
import { L as Layout, x as Bell, B as Button, M as MessageCircle } from "./Layout-DiYsrWyj.js";
import { S as Skeleton } from "./skeleton-bPGqVL12.js";
import { c as createLucideIcon } from "./proxy-BmYmrhIs.js";
import { M as Megaphone } from "./megaphone-DOIflHTp.js";
import { C as Check } from "./check-D4eYWkjZ.js";
import { U as UserPlus } from "./user-plus-DcnJnNhR.js";
import "./index-C1qqjek8.js";
import "./user--0LaG4fi.js";
import "./sun-BljhWh_d.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8", key: "7n84p3" }]
];
const AtSign = createLucideIcon("at-sign", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m9 16 2 2 4-4", key: "19s6y9" }]
];
const CalendarCheck = createLucideIcon("calendar-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode);
const KIND_META = {
  [NotificationKind.newFollower]: {
    icon: UserPlus,
    label: "New follower",
    color: "text-blue-400"
  },
  [NotificationKind.rsvpToYourMoment]: {
    icon: CalendarCheck,
    label: "New RSVP",
    color: "text-green-400"
  },
  [NotificationKind.accessRequestResolved]: {
    icon: Check,
    label: "Access request",
    color: "text-accent"
  },
  [NotificationKind.newMessage]: {
    icon: MessageCircle,
    label: "New message",
    color: "text-purple-400"
  },
  [NotificationKind.mentioned]: {
    icon: AtSign,
    label: "Mention",
    color: "text-yellow-400"
  },
  [NotificationKind.newAnnouncement]: {
    icon: Megaphone,
    label: "Announcement",
    color: "text-orange-400"
  }
};
function getNavigationTarget(notification) {
  if (notification.kind === NotificationKind.rsvpToYourMoment || notification.kind === NotificationKind.newAnnouncement || notification.kind === NotificationKind.accessRequestResolved) {
    if (notification.referenceId) {
      return {
        to: "/moments/$momentId",
        params: { momentId: notification.referenceId }
      };
    }
  }
  if (notification.kind === NotificationKind.newMessage) {
    return { to: "/messages" };
  }
  if (notification.kind === NotificationKind.newFollower) {
    if (notification.referenceId) {
      return {
        to: "/profile/$username",
        params: { username: notification.referenceId }
      };
    }
    return { to: "/dashboard" };
  }
  return null;
}
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
function getDateGroup(ts) {
  const now = /* @__PURE__ */ new Date();
  const then = new Date(Number(ts) / 1e6);
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thenDay = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const diffDays = Math.floor(
    (nowDay.getTime() - thenDay.getTime()) / 864e5
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier";
}
function NotificationItem({ notification }) {
  const navigate = useNavigate();
  const { mutate: markRead } = useMarkNotificationRead();
  const meta = KIND_META[notification.kind] ?? {
    icon: Bell,
    label: "Notification",
    color: "text-muted-foreground"
  };
  const Icon = meta.icon;
  const target = getNavigationTarget(notification);
  const handleClick = () => {
    var _a, _b;
    if (!notification.isRead) {
      markRead(notification.id);
    }
    if (!target) return;
    if ((_a = target.params) == null ? void 0 : _a.momentId) {
      navigate({
        to: "/moments/$momentId",
        params: { momentId: target.params.momentId }
      });
    } else if ((_b = target.params) == null ? void 0 : _b.username) {
      navigate({
        to: "/profile/$username",
        params: { username: target.params.username }
      });
    } else if (target.to === "/messages") {
      navigate({ to: "/messages", search: { with: void 0 } });
    } else if (target.to === "/dashboard") {
      navigate({ to: "/dashboard" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: handleClick,
      className: cn(
        "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors duration-150",
        "hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        !notification.isRead && "bg-accent/5 border-l-2 border-accent hover:bg-accent/8",
        notification.isRead && "border-l-2 border-transparent"
      ),
      "data-ocid": `notification.item.${String(notification.id)}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "mt-0.5 flex items-center justify-center w-9 h-9 rounded-full shrink-0",
              "bg-muted/60",
              meta.color
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-muted-foreground uppercase tracking-wide", children: meta.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: relativeTime(notification.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-0.5 leading-snug break-words", children: notification.message }),
          target && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-accent mt-1 inline-block", children: "View →" })
        ] }),
        !notification.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5 flex-shrink-0" })
      ]
    }
  );
}
function NotificationGroup({
  label,
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 bg-muted/20 border-b border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-widest", children: label }) }),
    items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "border-b border-border/20 last:border-0",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationItem, { notification: n })
      },
      String(n.id)
    ))
  ] });
}
function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markAll, isPending } = useMarkAllNotificationsRead();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 gap-4",
        "data-ocid": "notifications.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-7 h-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Sign in to view notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/explore",
              className: "text-xs text-accent hover:underline",
              "data-ocid": "notifications.explore_link",
              children: "Browse moments →"
            }
          )
        ]
      }
    ) });
  }
  const groups = {};
  for (const n of notifications) {
    const group = getDateGroup(n.createdAt);
    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  }
  const groupOrder = ["Today", "Yesterday", "Earlier"].filter(
    (g) => {
      var _a;
      return (_a = groups[g]) == null ? void 0 : _a.length;
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6", "data-ocid": "notifications.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Notifications" }),
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          unreadCount,
          " unread"
        ] })
      ] }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => markAll(),
          disabled: isPending,
          className: "h-8 px-3 text-xs gap-1.5 rounded-full",
          "data-ocid": "notifications.mark_all_read_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5" }),
            "Mark all read"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/20",
        style: {
          backdropFilter: "blur(12px)",
          backgroundColor: "color-mix(in oklch, var(--card) 50%, transparent)"
        },
        "data-ocid": "notifications.list",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" })
          ] })
        ] }, i)) }) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 gap-3 text-center px-6",
            "data-ocid": "notifications.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "w-6 h-6 text-muted-foreground/50" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "You're all caught up!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "New activity will appear here" })
            ]
          }
        ) : groupOrder.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationGroup,
          {
            label: group,
            items: groups[group]
          },
          group
        ))
      }
    )
  ] }) });
}
export {
  NotificationsPage
};
