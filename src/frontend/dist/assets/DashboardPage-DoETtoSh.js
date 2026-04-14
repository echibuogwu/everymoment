import { a as useBackend, c as useNavigate, r as reactExports, f as useQuery, j as jsxRuntimeExports, Q as QUERY_KEYS } from "./index-DlqwQ7hd.js";
import { A as AuthGuard, B as Button } from "./AuthGuard-DwWnaabs.js";
import { S as Skeleton } from "./skeleton-B1svKeA7.js";
import { c as createLucideIcon } from "./createLucideIcon-BUPz7SPw.js";
import { C as Clock } from "./clock-BEGfysa9.js";
import { E as EmptyState } from "./EmptyState-D402-w7e.js";
import { L as Layout, P as Plus } from "./badge-D1wUDQ0J.js";
import { M as MomentCard } from "./MomentCard-yEIYveNg.js";
import "./sun-DHiVM1rX.js";
import "./map-pin-CyFtcmKR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode);
function getMomentCategory(m, source) {
  const rel = m.callerRelation;
  if (rel) {
    if (rel.__kind__ === "owned") return "owned";
    if (rel.__kind__ === "rsvp") return "attending";
    if (rel.__kind__ === "following") return "following";
  }
  return source === "own" ? "owned" : "following";
}
function categoryStyle(category) {
  if (category === "owned")
    return {
      pill: "bg-[oklch(var(--chart-1)/0.12)] border border-[oklch(var(--chart-1)/0.3)]",
      dot: "bg-[oklch(var(--chart-1))]",
      dotActive: "bg-primary-foreground"
    };
  if (category === "attending")
    return {
      pill: "bg-[oklch(var(--chart-3)/0.12)] border border-[oklch(var(--chart-3)/0.3)]",
      dot: "bg-[oklch(var(--chart-3))]",
      dotActive: "bg-primary-foreground/85"
    };
  return {
    pill: "bg-[oklch(var(--chart-2)/0.10)] border border-[oklch(var(--chart-2)/0.25)]",
    dot: "bg-[oklch(var(--chart-2))]",
    dotActive: "bg-primary-foreground/70"
  };
}
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function formatDayLabel(date) {
  const today = /* @__PURE__ */ new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfDay(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
function groupByDate(moments) {
  const map = /* @__PURE__ */ new Map();
  for (const m of moments) {
    const key = startOfDay(m.date).toISOString();
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(m);
  }
  for (const [, group] of map) {
    group.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  return map;
}
function MomentPill({
  item,
  onClick
}) {
  const style = categoryStyle(item.category);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: [
        "w-full text-left px-3 py-2 rounded-lg flex items-start gap-2.5 transition-smooth hover:opacity-80 active:scale-[0.98]",
        style.pill
      ].join(" "),
      "data-ocid": `calendar-moment-${item.moment.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: ["mt-1 flex-shrink-0 w-2 h-2 rounded-full", style.dot].join(
              " "
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate leading-tight", children: item.moment.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-muted-foreground flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatTime(item.date) }),
            item.moment.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground truncate", children: [
              "· ",
              item.moment.location
            ] })
          ] })
        ] })
      ]
    }
  );
}
function DaySection({
  dateKey,
  items,
  onNavigate
}) {
  const date = new Date(dateKey);
  const isToday = isSameDay(date, /* @__PURE__ */ new Date());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: [
            "text-xs font-semibold tracking-wide uppercase",
            isToday ? "text-foreground" : "text-muted-foreground"
          ].join(" "),
          children: formatDayLabel(date)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 h-px bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: items.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      MomentPill,
      {
        item,
        onClick: () => onNavigate(item.moment.id.toString())
      },
      `${item.moment.id}-${item.category}`
    )) })
  ] });
}
function WeekView({
  moments,
  windowStart,
  onNavigate
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(windowStart);
    d.setDate(windowStart.getDate() + i);
    return d;
  });
  const [selectedDay, setSelectedDay] = reactExports.useState(null);
  const grouped = reactExports.useMemo(() => groupByDate(moments), [moments]);
  const activeDay = selectedDay ?? days.find((d) => {
    var _a;
    const key = startOfDay(d).toISOString();
    return grouped.has(key) && (((_a = grouped.get(key)) == null ? void 0 : _a.length) ?? 0) > 0;
  }) ?? days[0];
  const activeDayItems = grouped.get(startOfDay(activeDay).toISOString()) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: days.map((day) => {
      const key = startOfDay(day).toISOString();
      const dayItems = grouped.get(key) ?? [];
      const isToday = isSameDay(day, /* @__PURE__ */ new Date());
      const isActive = isSameDay(day, activeDay);
      const hasOwned = dayItems.some((m) => m.category === "owned");
      const hasAttending = dayItems.some((m) => m.category === "attending");
      const hasFollowing = dayItems.some((m) => m.category === "following");
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setSelectedDay(day),
          className: [
            "flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-smooth",
            isActive ? "bg-foreground text-primary-foreground" : isToday ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50"
          ].join(" "),
          "data-ocid": `calendar-week-day-${day.getDay()}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wide", children: day.toLocaleDateString([], { weekday: "narrow" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: day.getDate() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5 h-1.5", children: [
              hasOwned && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: [
                    "w-1.5 h-1.5 rounded-full",
                    isActive ? "bg-primary-foreground" : "bg-[oklch(var(--chart-1))]"
                  ].join(" ")
                }
              ),
              hasAttending && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: [
                    "w-1.5 h-1.5 rounded-full",
                    isActive ? "bg-primary-foreground/85" : "bg-[oklch(var(--chart-3))]"
                  ].join(" ")
                }
              ),
              hasFollowing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: [
                    "w-1.5 h-1.5 rounded-full",
                    isActive ? "bg-primary-foreground/70" : "bg-[oklch(var(--chart-2))]"
                  ].join(" ")
                }
              )
            ] })
          ]
        },
        key
      );
    }) }),
    activeDayItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground py-3", children: [
      "No moments on ",
      formatDayLabel(activeDay).toLowerCase()
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: activeDayItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      MomentPill,
      {
        item,
        onClick: () => onNavigate(item.moment.id.toString())
      },
      `${item.moment.id}-${item.category}`
    )) })
  ] });
}
function CalendarSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 mt-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" })
    ] })
  ] });
}
function CalendarView() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const [view, setView] = reactExports.useState("week");
  const { data: calendarMoments = [], isLoading: calLoading } = useQuery({
    queryKey: QUERY_KEYS.myCalendarMoments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCalendarMoments();
    },
    enabled: !!actor
  });
  const { data: feedMoments = [], isLoading: feedLoading } = useQuery({
    queryKey: QUERY_KEYS.feedMoments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeedMoments();
    },
    enabled: !!actor
  });
  const isLoading = calLoading || feedLoading;
  const today = startOfDay(/* @__PURE__ */ new Date());
  const windowEnd = reactExports.useMemo(() => {
    const end = new Date(today);
    if (view === "day") {
      end.setDate(today.getDate() + 1);
    } else if (view === "week") {
      end.setDate(today.getDate() + 7);
    } else {
      end.setDate(today.getDate() + 30);
    }
    return end;
  }, [view, today]);
  const allMoments = reactExports.useMemo(() => {
    const calIds = new Set(calendarMoments.map((m) => m.id.toString()));
    const cal = calendarMoments.map((m) => ({
      moment: m,
      category: getMomentCategory(m, "own"),
      date: new Date(Number(m.eventDate) / 1e6)
      // nanoseconds → ms
    }));
    const feed = feedMoments.filter((m) => !calIds.has(m.id.toString())).map((m) => ({
      moment: m,
      category: getMomentCategory(m, "feed"),
      date: new Date(Number(m.eventDate) / 1e6)
    }));
    return [...cal, ...feed];
  }, [calendarMoments, feedMoments]);
  const windowMoments = reactExports.useMemo(
    () => allMoments.filter((m) => m.date >= today && m.date < windowEnd),
    [allMoments, today, windowEnd]
  );
  const grouped = reactExports.useMemo(() => groupByDate(windowMoments), [windowMoments]);
  const sortedDateKeys = reactExports.useMemo(() => [...grouped.keys()].sort(), [grouped]);
  function handleNavigate(id) {
    navigate({ to: "/moments/$momentId", params: { momentId: id } });
  }
  const viewOptions = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "30 Days", value: "30day" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated p-4 space-y-4", "data-ocid": "calendar-view", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-foreground", children: "Upcoming" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center bg-muted rounded-full p-0.5 gap-0.5",
          "data-ocid": "calendar-view-toggle",
          children: viewOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setView(opt.value),
              className: [
                "text-xs font-medium px-3 py-1.5 rounded-full transition-smooth",
                view === opt.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              ].join(" "),
              "data-ocid": `calendar-toggle-${opt.value}`,
              children: opt.label
            },
            opt.value
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(var(--chart-1))]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "My moments" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(var(--chart-3))]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Attending" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(var(--chart-2))]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Following" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarSkeleton, {}) : view === "week" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      WeekView,
      {
        moments: windowMoments,
        windowStart: today,
        onNavigate: handleNavigate
      }
    ) : windowMoments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-6 space-y-1",
        "data-ocid": "calendar-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-8 h-8 text-muted-foreground mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No moments in this window" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create a moment or follow others to see events here" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "calendar-moments-list", children: sortedDateKeys.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      DaySection,
      {
        dateKey: key,
        items: grouped.get(key),
        onNavigate: handleNavigate
      },
      key
    )) })
  ] });
}
function MomentGridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-elevated overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[16/9]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-1/2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-2/3" })
    ] })
  ] }, k)) });
}
function DashboardPage() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const { data: moments, isLoading } = useQuery({
    queryKey: QUERY_KEYS.myMoments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyMoments();
    },
    enabled: actor !== null
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: true, requireProfile: true, currentPath: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-tight", children: "My Moments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-0.5", children: "Events you own or have access to" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => navigate({ to: "/moments/new" }),
            className: "tap-target hidden sm:flex gap-1",
            "data-ocid": "dashboard-create-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Create"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarView, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-base text-foreground", children: "All Moments" }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(MomentGridSkeleton, {}) : !moments || moments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: CalendarDays,
            title: "No moments yet",
            description: "Create your first Moment to start capturing and sharing memories.",
            action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "tap-target",
                onClick: () => navigate({ to: "/moments/new" }),
                "data-ocid": "dashboard-empty-create-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                  "Create your first Moment"
                ]
              }
            )
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
            "data-ocid": "dashboard-moments-grid",
            children: moments.map((moment) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              MomentCard,
              {
                moment,
                onClick: () => navigate({
                  to: "/moments/$momentId",
                  params: { momentId: moment.id.toString() }
                })
              },
              moment.id.toString()
            ))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/moments/new" }),
        className: "fixed bottom-20 right-4 sm:hidden w-14 h-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center shadow-lg tap-target z-30 transition-smooth active:scale-95",
        "data-ocid": "dashboard-fab",
        "aria-label": "Create moment",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-6 h-6" })
      }
    )
  ] }) });
}
export {
  DashboardPage
};
