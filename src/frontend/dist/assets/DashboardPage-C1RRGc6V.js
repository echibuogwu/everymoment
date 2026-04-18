import { a as useBackend, c as useNavigate, r as reactExports, f as useQuery, j as jsxRuntimeExports, Q as QUERY_KEYS } from "./index-CqHW4ujE.js";
import { S as Skeleton } from "./skeleton-DB5QWWmW.js";
import { A as AuthGuard } from "./AuthGuard-BAH2Huar.js";
import { c as createLucideIcon, m as motion } from "./proxy-DHxO4phe.js";
import { R as RefreshCw } from "./refresh-cw-DEAsbOII.js";
import { A as AnimatePresence, X, L as Layout, S as Sparkles, P as Plus } from "./Layout-BTHeHKiQ.js";
import { C as CalendarDays } from "./calendar-days-B2QPOxKI.js";
import { C as Clock } from "./clock-BmJ2D4Wz.js";
import { M as MomentCard } from "./MomentCard-CPRs-D8K.js";
import "./user-DyEDxtSt.js";
import "./sun-BIK3o8tY.js";
import "./map-pin-C-IuSehz.js";
import "./users-BgOmMkth.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
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
      pill: "bg-[oklch(var(--chart-1)/0.12)] border border-[oklch(var(--chart-1)/0.3)] text-[oklch(var(--chart-1))]",
      dot: "bg-[oklch(var(--chart-1))]",
      glow: "oklch(var(--chart-1))"
    };
  if (category === "attending")
    return {
      pill: "bg-[oklch(var(--chart-3)/0.12)] border border-[oklch(var(--chart-3)/0.3)] text-[oklch(var(--chart-3))]",
      dot: "bg-[oklch(var(--chart-3))]",
      glow: "oklch(var(--chart-3))"
    };
  return {
    pill: "bg-[oklch(var(--chart-2)/0.10)] border border-[oklch(var(--chart-2)/0.25)] text-[oklch(var(--chart-2))]",
    dot: "bg-[oklch(var(--chart-2))]",
    glow: "oklch(var(--chart-2))"
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
function resolveDate(m) {
  const ts = m.occurrenceDate ?? m.eventDate;
  return new Date(Number(ts) / 1e6);
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
  onClick,
  animated = false
}) {
  const style = categoryStyle(item.category);
  const isRecurring = !!item.moment.recurrence;
  const [pulse, setPulse] = reactExports.useState(animated);
  reactExports.useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => setPulse(false), 1500);
    return () => clearTimeout(t);
  }, [animated]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      onClick,
      whileTap: { scale: 0.97 },
      whileHover: { opacity: 0.85 },
      className: [
        "w-full text-left px-3 py-2 rounded-full flex items-center gap-2.5 transition-smooth",
        style.pill,
        pulse ? "animate-pulse" : ""
      ].join(" "),
      "data-ocid": `calendar-moment-${item.moment.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: ["flex-shrink-0 w-2 h-2 rounded-full", style.dot].join(" ")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold truncate leading-tight flex-1 min-w-0", children: item.moment.title }),
          isRecurring && /* @__PURE__ */ jsxRuntimeExports.jsx(
            RefreshCw,
            {
              className: "w-2.5 h-2.5 flex-shrink-0 opacity-70",
              "aria-label": "Recurring"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-2.5 h-2.5 opacity-60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-70", children: formatTime(item.date) })
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
            "text-[10px] font-bold tracking-widest uppercase",
            isToday ? "text-[oklch(var(--accent))]" : "text-muted-foreground"
          ].join(" "),
          children: formatDayLabel(date)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 h-px bg-border/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground px-2 py-0.5 glass-card rounded-full", children: items.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      MomentPill,
      {
        item,
        onClick: () => onNavigate(item.moment.id.toString()),
        animated: true
      },
      `${item.moment.id}-${item.date.toISOString()}`
    )) })
  ] });
}
function DayDrawer({
  date,
  items,
  onClose,
  onNavigate
}) {
  const dragStartY = reactExports.useRef(null);
  const [dragDelta, setDragDelta] = reactExports.useState(0);
  function handleTouchStart(e) {
    dragStartY.current = e.touches[0].clientY;
  }
  function handleTouchMove(e) {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragDelta(delta);
  }
  function handleTouchEnd() {
    if (dragDelta > 80) onClose();
    else setDragDelta(0);
    dragStartY.current = null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
        className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]",
        onClick: onClose
      },
      "drawer-backdrop"
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { y: "100%" },
        animate: { y: dragDelta > 0 ? dragDelta : 0 },
        exit: { y: "100%" },
        transition: { type: "spring", stiffness: 300, damping: 30 },
        className: "fixed bottom-0 left-0 right-0 z-[60] glass-modal rounded-t-3xl overflow-hidden",
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        "data-ocid": "calendar-day-drawer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 bg-border rounded-full" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold tracking-widest uppercase text-[oklch(var(--accent))]", children: isSameDay(date, /* @__PURE__ */ new Date()) ? "Today" : date.toLocaleDateString([], { weekday: "long" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-foreground", children: date.toLocaleDateString([], { month: "long", day: "numeric" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "w-8 h-8 rounded-full glass-card flex items-center justify-center",
                "data-ocid": "calendar-day-drawer-close",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-foreground" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-8 space-y-2 max-h-[50vh] overflow-y-auto", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No moments on this day" })
          ] }) : items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            MomentPill,
            {
              item,
              onClick: () => {
                onClose();
                onNavigate(item.moment.id.toString());
              }
            },
            `${item.moment.id}-${item.date.toISOString()}`
          )) })
        ]
      },
      "drawer-panel"
    )
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
  const [drawerDay, setDrawerDay] = reactExports.useState(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const grouped = reactExports.useMemo(() => groupByDate(moments), [moments]);
  const activeDay = selectedDay ?? days.find((d) => {
    var _a;
    const key = startOfDay(d).toISOString();
    return grouped.has(key) && (((_a = grouped.get(key)) == null ? void 0 : _a.length) ?? 0) > 0;
  }) ?? days[0];
  const activeDayItems = grouped.get(startOfDay(activeDay).toISOString()) ?? [];
  function handleDayClick(day) {
    if (isMobile) {
      setDrawerDay(day);
    } else {
      setSelectedDay(day);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: days.map((day) => {
        const key = startOfDay(day).toISOString();
        const dayItems = grouped.get(key) ?? [];
        const isToday = isSameDay(day, /* @__PURE__ */ new Date());
        const isActive = isSameDay(day, activeDay);
        const hasOwned = dayItems.some((m) => m.category === "owned");
        const hasAttending = dayItems.some(
          (m) => m.category === "attending"
        );
        const hasFollowing = dayItems.some(
          (m) => m.category === "following"
        );
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.button,
          {
            type: "button",
            whileTap: { scale: 0.9 },
            onClick: () => handleDayClick(day),
            className: [
              "flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-smooth relative overflow-hidden",
              isActive && !isMobile ? "bg-[oklch(var(--accent))] text-[oklch(var(--accent-foreground))] shadow-lg" : isToday ? "ring-2 ring-[oklch(var(--accent))] text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50"
            ].join(" "),
            style: isToday ? { boxShadow: "0 0 12px oklch(var(--accent) / 0.3)" } : void 0,
            "data-ocid": `calendar-week-day-${day.getDay()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider font-semibold", children: day.toLocaleDateString([], { weekday: "narrow" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: day.getDate() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5 h-1.5", children: [
                hasOwned && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: [
                      "w-1.5 h-1.5 rounded-full",
                      isActive && !isMobile ? "bg-white/80" : "bg-[oklch(var(--chart-1))]"
                    ].join(" ")
                  }
                ),
                hasAttending && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: [
                      "w-1.5 h-1.5 rounded-full",
                      isActive && !isMobile ? "bg-white/60" : "bg-[oklch(var(--chart-3))]"
                    ].join(" ")
                  }
                ),
                hasFollowing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: [
                      "w-1.5 h-1.5 rounded-full",
                      isActive && !isMobile ? "bg-white/50" : "bg-[oklch(var(--chart-2))]"
                    ].join(" ")
                  }
                )
              ] })
            ]
          },
          key
        );
      }) }),
      !isMobile && (activeDayItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground py-3", children: [
        "No moments on ",
        formatDayLabel(activeDay).toLowerCase()
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: activeDayItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        MomentPill,
        {
          item,
          onClick: () => onNavigate(item.moment.id.toString())
        },
        `${item.moment.id}-${item.date.toISOString()}`
      )) })),
      isMobile && !drawerDay && (activeDayItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground py-3", children: "Tap a day to view moments" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: activeDayItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        MomentPill,
        {
          item,
          onClick: () => onNavigate(item.moment.id.toString())
        },
        `${item.moment.id}-${item.date.toISOString()}`
      )) }))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: drawerDay && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DayDrawer,
      {
        date: drawerDay,
        items: grouped.get(startOfDay(drawerDay).toISOString()) ?? [],
        onClose: () => setDrawerDay(null),
        onNavigate
      }
    ) })
  ] });
}
function ThirtyDayView({
  moments,
  monthOffset,
  onNavigate
}) {
  const [drawerDay, setDrawerDay] = reactExports.useState(null);
  const grouped = reactExports.useMemo(() => groupByDate(moments), [moments]);
  const { firstDay, daysInMonth } = reactExports.useMemo(() => {
    const today = /* @__PURE__ */ new Date();
    const target = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset,
      1
    );
    const first = new Date(target.getFullYear(), target.getMonth(), 1);
    const last = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    return { firstDay: first, daysInMonth: last.getDate() };
  }, [monthOffset]);
  const startOffset = firstDay.getDay();
  const totalCells = startOffset + daysInMonth;
  const totalRows = Math.ceil(totalCells / 7);
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1 mb-1", children: dayHeaders.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground py-1",
          children: d
        },
        d
      )) }),
      Array.from({ length: totalRows }, (_, rowIdx) => {
        const firstCellDay = rowIdx * 7 - startOffset + 1;
        const rowKey = `week-${firstDay.getFullYear()}-${firstDay.getMonth()}-${firstCellDay}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: Array.from({ length: 7 }, (_2, colIdx) => {
          const cellIndex = rowIdx * 7 + colIdx;
          const dayNumber = cellIndex - startOffset + 1;
          const isInMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
          if (!isInMonth) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, `empty-${cellIndex}`);
          }
          const day = new Date(
            firstDay.getFullYear(),
            firstDay.getMonth(),
            dayNumber
          );
          const key = startOfDay(day).toISOString();
          const dayItems = grouped.get(key) ?? [];
          const isToday = isSameDay(day, /* @__PURE__ */ new Date());
          const hasOwned = dayItems.some((m) => m.category === "owned");
          const hasAttending = dayItems.some(
            (m) => m.category === "attending"
          );
          const hasFollowing = dayItems.some(
            (m) => m.category === "following"
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              whileTap: { scale: 0.88 },
              onClick: () => setDrawerDay(day),
              className: [
                "flex flex-col items-center py-1.5 rounded-xl transition-smooth",
                isToday ? "ring-2 ring-[oklch(var(--accent))]" : "hover:bg-muted/40"
              ].join(" "),
              style: isToday ? { boxShadow: "0 0 10px oklch(var(--accent) / 0.25)" } : void 0,
              "data-ocid": `calendar-30day-${dayNumber}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: [
                      "text-[10px] font-semibold",
                      isToday ? "text-[oklch(var(--accent))]" : "text-foreground"
                    ].join(" "),
                    children: dayNumber
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5 mt-0.5 h-1.5", children: [
                  hasOwned && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[oklch(var(--chart-1))]" }),
                  hasAttending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[oklch(var(--chart-3))]" }),
                  hasFollowing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[oklch(var(--chart-2))]" })
                ] })
              ]
            },
            key
          );
        }) }, rowKey);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: drawerDay && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DayDrawer,
      {
        date: drawerDay,
        items: grouped.get(startOfDay(drawerDay).toISOString()) ?? [],
        onClose: () => setDrawerDay(null),
        onNavigate
      }
    ) })
  ] });
}
function CalendarSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: Array.from({ length: 7 }, (_, i) => `skel-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-2xl" }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-full" })
    ] })
  ] });
}
function CalendarView() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const [view, setView] = reactExports.useState("week");
  const [monthOffset, setMonthOffset] = reactExports.useState(0);
  const today = reactExports.useMemo(() => startOfDay(/* @__PURE__ */ new Date()), []);
  const { rangeStart, rangeEnd } = reactExports.useMemo(() => {
    if (view === "30day") {
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1
      );
      const monthStart = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth(),
        1
      );
      const monthEnd = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      return {
        rangeStart: BigInt(monthStart.getTime()) * 1000000n,
        rangeEnd: BigInt(monthEnd.getTime()) * 1000000n
      };
    }
    const start = new Date(today);
    const end = new Date(today);
    if (view === "day") {
      end.setDate(today.getDate() + 1);
    } else {
      end.setDate(today.getDate() + 7);
    }
    return {
      rangeStart: BigInt(start.getTime()) * 1000000n,
      rangeEnd: BigInt(end.getTime()) * 1000000n
    };
  }, [view, today, monthOffset]);
  const { data: calendarMoments = [], isLoading: calLoading } = useQuery({
    queryKey: [...QUERY_KEYS.myCalendarMoments, view, monthOffset],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCalendarMoments(rangeStart, rangeEnd);
    },
    enabled: !!actor
  });
  const { data: feedMoments = [], isLoading: feedLoading } = useQuery({
    queryKey: [...QUERY_KEYS.feedMoments, view, monthOffset],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeedMoments();
    },
    enabled: !!actor
  });
  const isLoading = calLoading || feedLoading;
  const windowEnd = reactExports.useMemo(() => {
    if (view === "30day") {
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1
      );
      return new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }
    const end = new Date(today);
    if (view === "day") {
      end.setDate(today.getDate() + 1);
    } else {
      end.setDate(today.getDate() + 7);
    }
    return end;
  }, [view, today, monthOffset]);
  const windowStart = reactExports.useMemo(() => {
    if (view === "30day") {
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1
      );
      return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    }
    return today;
  }, [view, today, monthOffset]);
  const allMoments = reactExports.useMemo(() => {
    const calIds = new Set(
      calendarMoments.map(
        (m) => `${m.id}-${String(m.occurrenceDate ?? m.eventDate)}`
      )
    );
    const cal = calendarMoments.map((m) => ({
      moment: m,
      category: getMomentCategory(m, "own"),
      date: resolveDate(m)
    }));
    const feed = feedMoments.filter(
      (m) => !calIds.has(`${m.id}-${String(m.occurrenceDate ?? m.eventDate)}`)
    ).map((m) => ({
      moment: m,
      category: getMomentCategory(m, "feed"),
      date: resolveDate(m)
    })).filter((m) => m.date >= windowStart && m.date < windowEnd);
    return [...cal, ...feed];
  }, [calendarMoments, feedMoments, windowStart, windowEnd]);
  const grouped = reactExports.useMemo(() => groupByDate(allMoments), [allMoments]);
  const sortedDateKeys = reactExports.useMemo(() => [...grouped.keys()].sort(), [grouped]);
  const monthLabel = reactExports.useMemo(() => {
    const d = new Date(today);
    d.setMonth(today.getMonth() + monthOffset);
    return d.toLocaleDateString([], { month: "long", year: "numeric" });
  }, [today, monthOffset]);
  function handleNavigate(id) {
    navigate({ to: "/moments/$momentId", params: { momentId: id } });
  }
  const viewOptions = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "30 Days", value: "30day" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "glass-card rounded-3xl p-4 overflow-hidden space-y-4",
      "data-ocid": "calendar-view",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileTap: { scale: 0.9 },
                onClick: () => setMonthOffset((o) => o - 1),
                className: "w-7 h-7 rounded-full glass-card flex items-center justify-center",
                "aria-label": "Previous",
                "data-ocid": "calendar-prev",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5 text-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-sm bg-gradient-to-r from-foreground to-[oklch(var(--accent))] bg-clip-text text-transparent min-w-[120px] text-center", children: monthLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.button,
              {
                type: "button",
                whileTap: { scale: 0.9 },
                onClick: () => setMonthOffset((o) => o + 1),
                className: "w-7 h-7 rounded-full glass-card flex items-center justify-center",
                "aria-label": "Next",
                "data-ocid": "calendar-next",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-foreground" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "relative flex items-center bg-black/10 dark:bg-white/5 rounded-full p-1",
              "data-ocid": "calendar-view-toggle",
              children: viewOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setView(opt.value),
                  className: "relative px-3 py-1.5 rounded-full text-xs font-semibold z-10 transition-colors duration-150",
                  style: {
                    color: view === opt.value ? "oklch(var(--foreground))" : "oklch(var(--muted-foreground))"
                  },
                  "data-ocid": `calendar-toggle-${opt.value}`,
                  children: [
                    view === opt.value && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.span,
                      {
                        layoutId: "calendar-view-active",
                        className: "absolute inset-0 rounded-full bg-card shadow-sm",
                        style: { zIndex: -1 },
                        transition: { type: "spring", stiffness: 400, damping: 30 }
                      }
                    ),
                    opt.label
                  ]
                },
                opt.value
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(var(--chart-1))]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Mine" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(var(--chart-3))]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Attending" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-[oklch(var(--chart-2))]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Following" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-2.5 h-2.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Recurring" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarSkeleton, {})
          },
          "skeleton"
        ) : view === "week" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 12 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -12 },
            transition: { duration: 0.22 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              WeekView,
              {
                moments: allMoments,
                windowStart: today,
                onNavigate: handleNavigate
              }
            )
          },
          "week"
        ) : view === "30day" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 12 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -12 },
            transition: { duration: 0.22 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ThirtyDayView,
              {
                moments: allMoments,
                monthOffset,
                onNavigate: handleNavigate
              }
            )
          },
          "30day"
        ) : allMoments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "text-center py-6 space-y-2",
            "data-ocid": "calendar-empty-state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-8 h-8 text-[oklch(var(--accent)/0.5)] mx-auto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No moments in this window" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create a moment or follow others to see events here" })
            ]
          },
          "empty"
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 12 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -12 },
            transition: { duration: 0.22 },
            className: "space-y-4",
            "data-ocid": "calendar-moments-list",
            children: sortedDateKeys.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              DaySection,
              {
                dateKey: key,
                items: grouped.get(key),
                onNavigate: handleNavigate
              },
              key
            ))
          },
          "day-list"
        ) })
      ]
    }
  );
}
function MomentGridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[4/3]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
    ] })
  ] }, k)) });
}
function StatBadge({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-full px-4 py-2 flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-display font-bold bg-gradient-to-br from-[oklch(0.72_0.28_280)] to-[oklch(0.65_0.25_310)] bg-clip-text text-transparent", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: label })
  ] });
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
  const momentCount = (moments == null ? void 0 : moments.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: true, requireProfile: true, currentPath: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, ease: [0.34, 1.2, 0.64, 1] },
          className: "glass-card rounded-3xl p-5 space-y-4",
          "data-ocid": "dashboard-hero",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-[oklch(var(--accent))]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-widest", children: "Welcome back" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl bg-gradient-to-r from-foreground via-foreground to-[oklch(var(--accent))] bg-clip-text text-transparent leading-tight", children: "Your Moments" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Every memory, beautifully captured" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  type: "button",
                  whileTap: { scale: 0.92 },
                  whileHover: { scale: 1.04 },
                  onClick: () => navigate({ to: "/moments/new" }),
                  className: "flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold bg-[oklch(var(--accent))] text-[oklch(var(--accent-foreground))] shadow-lg transition-smooth animate-glow-pulse",
                  "data-ocid": "dashboard-create-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Create" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatBadge, { label: "moments", value: momentCount }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: 0.1 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarView, {})
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay: 0.18 },
          className: "space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-base bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent px-1", children: "All Moments" }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(MomentGridSkeleton, {}) : !moments || moments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.96 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.35, ease: [0.34, 1.2, 0.64, 1] },
                className: "glass-card rounded-3xl p-8 flex flex-col items-center text-center space-y-4",
                "data-ocid": "dashboard-empty-state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-[oklch(var(--accent)/0.12)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-8 h-8 text-[oklch(var(--accent))]" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg text-foreground", children: "No moments yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Create your first Moment to start capturing and sharing memories with the people who matter most." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.button,
                    {
                      type: "button",
                      whileTap: { scale: 0.95 },
                      whileHover: { scale: 1.03 },
                      onClick: () => navigate({ to: "/moments/new" }),
                      className: "flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-[oklch(0.72_0.28_280)] to-[oklch(0.65_0.25_310)] text-white shadow-lg animate-glow-pulse",
                      "data-ocid": "dashboard-empty-create-btn",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                        "Create your first Moment"
                      ]
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid grid-cols-2 gap-3",
                "data-ocid": "dashboard-moments-grid",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: moments.map((moment, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 14 },
                    animate: { opacity: 1, y: 0 },
                    transition: {
                      duration: 0.35,
                      delay: i * 0.06,
                      ease: [0.34, 1.1, 0.64, 1]
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MomentCard,
                      {
                        moment,
                        onClick: () => navigate({
                          to: "/moments/$momentId",
                          params: { momentId: moment.id.toString() }
                        })
                      }
                    )
                  },
                  moment.id.toString()
                )) })
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.button,
      {
        type: "button",
        whileTap: { scale: 0.9 },
        whileHover: { scale: 1.08 },
        onClick: () => navigate({ to: "/moments/new" }),
        className: "fixed bottom-20 right-4 sm:hidden w-14 h-14 rounded-full flex items-center justify-center shadow-2xl tap-target z-30 animate-glow-pulse bg-gradient-to-br from-[oklch(0.72_0.28_280)] to-[oklch(0.65_0.25_310)] text-white",
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
