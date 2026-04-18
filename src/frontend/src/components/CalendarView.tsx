import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CallerRelation } from "../backend";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import type { MomentListItem } from "../types";

type ViewWindow = "day" | "week" | "30day";

function getMomentCategory(
  m: MomentListItem,
  source: "own" | "feed",
): "owned" | "attending" | "following" {
  const rel = m.callerRelation as CallerRelation | undefined;
  if (rel) {
    if (rel.__kind__ === "owned") return "owned";
    if (rel.__kind__ === "rsvp") return "attending";
    if (rel.__kind__ === "following") return "following";
  }
  return source === "own" ? "owned" : "following";
}

interface CalendarMoment {
  moment: MomentListItem;
  category: "owned" | "attending" | "following";
  date: Date;
}

function categoryStyle(category: "owned" | "attending" | "following") {
  if (category === "owned")
    return {
      pill: "bg-[oklch(var(--chart-1)/0.12)] border border-[oklch(var(--chart-1)/0.3)] text-[oklch(var(--chart-1))]",
      dot: "bg-[oklch(var(--chart-1))]",
      glow: "oklch(var(--chart-1))",
    };
  if (category === "attending")
    return {
      pill: "bg-[oklch(var(--chart-3)/0.12)] border border-[oklch(var(--chart-3)/0.3)] text-[oklch(var(--chart-3))]",
      dot: "bg-[oklch(var(--chart-3))]",
      glow: "oklch(var(--chart-3))",
    };
  return {
    pill: "bg-[oklch(var(--chart-2)/0.10)] border border-[oklch(var(--chart-2)/0.25)] text-[oklch(var(--chart-2))]",
    dot: "bg-[oklch(var(--chart-2))]",
    glow: "oklch(var(--chart-2))",
  };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDayLabel(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Resolve the effective display date: occurrenceDate takes priority over eventDate */
function resolveDate(m: MomentListItem): Date {
  const ts = m.occurrenceDate ?? m.eventDate;
  return new Date(Number(ts) / 1_000_000);
}

function groupByDate(moments: CalendarMoment[]): Map<string, CalendarMoment[]> {
  const map = new Map<string, CalendarMoment[]>();
  for (const m of moments) {
    const key = startOfDay(m.date).toISOString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  for (const [, group] of map) {
    group.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  return map;
}

// ── Moment pill ──────────────────────────────────────────────────────────────

function MomentPill({
  item,
  onClick,
  animated = false,
}: {
  item: CalendarMoment;
  onClick: () => void;
  animated?: boolean;
}) {
  const style = categoryStyle(item.category);
  const isRecurring = !!item.moment.recurrence;
  const [pulse, setPulse] = useState(animated);

  useEffect(() => {
    if (!animated) return;
    const t = setTimeout(() => setPulse(false), 1500);
    return () => clearTimeout(t);
  }, [animated]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      whileHover={{ opacity: 0.85 }}
      className={[
        "w-full text-left px-3 py-2 rounded-full flex items-center gap-2.5 transition-smooth",
        style.pill,
        pulse ? "animate-pulse" : "",
      ].join(" ")}
      data-ocid={`calendar-moment-${item.moment.id}`}
    >
      <span
        className={["flex-shrink-0 w-2 h-2 rounded-full", style.dot].join(" ")}
      />
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <p className="text-xs font-semibold truncate leading-tight flex-1 min-w-0">
          {item.moment.title}
        </p>
        {isRecurring && (
          <RefreshCw
            className="w-2.5 h-2.5 flex-shrink-0 opacity-70"
            aria-label="Recurring"
          />
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Clock className="w-2.5 h-2.5 opacity-60" />
        <span className="text-[10px] opacity-70">{formatTime(item.date)}</span>
      </div>
    </motion.button>
  );
}

// ── Day section (list view) ──────────────────────────────────────────────────

function DaySection({
  dateKey,
  items,
  onNavigate,
}: {
  dateKey: string;
  items: CalendarMoment[];
  onNavigate: (id: string) => void;
}) {
  const date = new Date(dateKey);
  const isToday = isSameDay(date, new Date());
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={[
            "text-[10px] font-bold tracking-widest uppercase",
            isToday ? "text-[oklch(var(--accent))]" : "text-muted-foreground",
          ].join(" ")}
        >
          {formatDayLabel(date)}
        </span>
        <span className="flex-1 h-px bg-border/50" />
        <span className="text-[10px] text-muted-foreground px-2 py-0.5 glass-card rounded-full">
          {items.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <MomentPill
            key={`${item.moment.id}-${item.date.toISOString()}`}
            item={item}
            onClick={() => onNavigate(item.moment.id.toString())}
            animated
          />
        ))}
      </div>
    </div>
  );
}

// ── Glass day drawer (mobile) ─────────────────────────────────────────────────

function DayDrawer({
  date,
  items,
  onClose,
  onNavigate,
}: {
  date: Date;
  items: CalendarMoment[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const dragStartY = useRef<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);

  function handleTouchStart(e: React.TouchEvent) {
    dragStartY.current = e.touches[0].clientY;
  }
  function handleTouchMove(e: React.TouchEvent) {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) setDragDelta(delta);
  }
  function handleTouchEnd() {
    if (dragDelta > 80) onClose();
    else setDragDelta(0);
    dragStartY.current = null;
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
        onClick={onClose}
      />
      {/* Drawer */}
      <motion.div
        key="drawer-panel"
        initial={{ y: "100%" }}
        animate={{ y: dragDelta > 0 ? dragDelta : 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-[60] glass-modal rounded-t-3xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-ocid="calendar-day-drawer"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[oklch(var(--accent))]">
              {isSameDay(date, new Date())
                ? "Today"
                : date.toLocaleDateString([], { weekday: "long" })}
            </p>
            <h3 className="font-display font-bold text-lg text-foreground">
              {date.toLocaleDateString([], { month: "long", day: "numeric" })}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center"
            data-ocid="calendar-day-drawer-close"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Moments list */}
        <div className="px-5 pb-8 space-y-2 max-h-[50vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No moments on this day
              </p>
            </div>
          ) : (
            items.map((item) => (
              <MomentPill
                key={`${item.moment.id}-${item.date.toISOString()}`}
                item={item}
                onClick={() => {
                  onClose();
                  onNavigate(item.moment.id.toString());
                }}
              />
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}

// ── Week view ─────────────────────────────────────────────────────────────────

function WeekView({
  moments,
  windowStart,
  onNavigate,
}: {
  moments: CalendarMoment[];
  windowStart: Date;
  onNavigate: (id: string) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(windowStart);
    d.setDate(windowStart.getDate() + i);
    return d;
  });

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [drawerDay, setDrawerDay] = useState<Date | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const grouped = useMemo(() => groupByDate(moments), [moments]);

  const activeDay =
    selectedDay ??
    days.find((d) => {
      const key = startOfDay(d).toISOString();
      return grouped.has(key) && (grouped.get(key)?.length ?? 0) > 0;
    }) ??
    days[0];

  const activeDayItems = grouped.get(startOfDay(activeDay).toISOString()) ?? [];

  function handleDayClick(day: Date) {
    if (isMobile) {
      setDrawerDay(day);
    } else {
      setSelectedDay(day);
    }
  }

  return (
    <>
      <div className="space-y-3">
        {/* 7-day strip */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = startOfDay(day).toISOString();
            const dayItems = grouped.get(key) ?? [];
            const isToday = isSameDay(day, new Date());
            const isActive = isSameDay(day, activeDay);
            const hasOwned = dayItems.some((m) => m.category === "owned");
            const hasAttending = dayItems.some(
              (m) => m.category === "attending",
            );
            const hasFollowing = dayItems.some(
              (m) => m.category === "following",
            );
            return (
              <motion.button
                key={key}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDayClick(day)}
                className={[
                  "flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-smooth relative overflow-hidden",
                  isActive && !isMobile
                    ? "bg-[oklch(var(--accent))] text-[oklch(var(--accent-foreground))] shadow-lg"
                    : isToday
                      ? "ring-2 ring-[oklch(var(--accent))] text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/50",
                ].join(" ")}
                style={
                  isToday
                    ? { boxShadow: "0 0 12px oklch(var(--accent) / 0.3)" }
                    : undefined
                }
                data-ocid={`calendar-week-day-${day.getDay()}`}
              >
                <span className="text-[9px] uppercase tracking-wider font-semibold">
                  {day.toLocaleDateString([], { weekday: "narrow" })}
                </span>
                <span className="text-sm font-bold">{day.getDate()}</span>
                <div className="flex gap-0.5 h-1.5">
                  {hasOwned && (
                    <span
                      className={[
                        "w-1.5 h-1.5 rounded-full",
                        isActive && !isMobile
                          ? "bg-white/80"
                          : "bg-[oklch(var(--chart-1))]",
                      ].join(" ")}
                    />
                  )}
                  {hasAttending && (
                    <span
                      className={[
                        "w-1.5 h-1.5 rounded-full",
                        isActive && !isMobile
                          ? "bg-white/60"
                          : "bg-[oklch(var(--chart-3))]",
                      ].join(" ")}
                    />
                  )}
                  {hasFollowing && (
                    <span
                      className={[
                        "w-1.5 h-1.5 rounded-full",
                        isActive && !isMobile
                          ? "bg-white/50"
                          : "bg-[oklch(var(--chart-2))]",
                      ].join(" ")}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected day moments (desktop) */}
        {!isMobile &&
          (activeDayItems.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-3">
              No moments on {formatDayLabel(activeDay).toLowerCase()}
            </p>
          ) : (
            <div className="space-y-1.5">
              {activeDayItems.map((item) => (
                <MomentPill
                  key={`${item.moment.id}-${item.date.toISOString()}`}
                  item={item}
                  onClick={() => onNavigate(item.moment.id.toString())}
                />
              ))}
            </div>
          ))}

        {/* Mobile: show selected-day moments below strip too */}
        {isMobile &&
          !drawerDay &&
          (activeDayItems.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-3">
              Tap a day to view moments
            </p>
          ) : (
            <div className="space-y-1.5">
              {activeDayItems.map((item) => (
                <MomentPill
                  key={`${item.moment.id}-${item.date.toISOString()}`}
                  item={item}
                  onClick={() => onNavigate(item.moment.id.toString())}
                />
              ))}
            </div>
          ))}
      </div>

      {/* Glass drawer (mobile day tap) */}
      <AnimatePresence>
        {drawerDay && (
          <DayDrawer
            date={drawerDay}
            items={grouped.get(startOfDay(drawerDay).toISOString()) ?? []}
            onClose={() => setDrawerDay(null)}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── 30-day / month grid view ──────────────────────────────────────────────────

function ThirtyDayView({
  moments,
  monthOffset,
  onNavigate,
}: {
  moments: CalendarMoment[];
  monthOffset: number;
  onNavigate: (id: string) => void;
}) {
  const [drawerDay, setDrawerDay] = useState<Date | null>(null);
  const grouped = useMemo(() => groupByDate(moments), [moments]);

  // Compute the first and last day of the target month
  const { firstDay, daysInMonth } = useMemo(() => {
    const today = new Date();
    const target = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset,
      1,
    );
    const first = new Date(target.getFullYear(), target.getMonth(), 1);
    const last = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    return { firstDay: first, daysInMonth: last.getDate() };
  }, [monthOffset]);

  // Sunday = 0, Saturday = 6 — offset cells before the 1st of the month
  const startOffset = firstDay.getDay();

  // Build all day cells including leading empty cells
  const totalCells = startOffset + daysInMonth;
  // Round up to full weeks
  const totalRows = Math.ceil(totalCells / 7);

  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <div className="space-y-1">
        {/* Day-of-week headers — 7 columns */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayHeaders.map((d) => (
            <div
              key={d}
              className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date rows — iterate over pre-computed week keys to avoid index-as-key */}
        {Array.from({ length: totalRows }, (_, rowIdx) => {
          // Use the day number of the first in-month cell in this row as stable key
          const firstCellDay = rowIdx * 7 - startOffset + 1;
          const rowKey = `week-${firstDay.getFullYear()}-${firstDay.getMonth()}-${firstCellDay}`;
          return (
            <div key={rowKey} className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }, (_, colIdx) => {
                const cellIndex = rowIdx * 7 + colIdx;
                const dayNumber = cellIndex - startOffset + 1;
                const isInMonth = dayNumber >= 1 && dayNumber <= daysInMonth;

                if (!isInMonth) {
                  return <div key={`empty-${cellIndex}`} />;
                }

                const day = new Date(
                  firstDay.getFullYear(),
                  firstDay.getMonth(),
                  dayNumber,
                );
                const key = startOfDay(day).toISOString();
                const dayItems = grouped.get(key) ?? [];
                const isToday = isSameDay(day, new Date());
                const hasOwned = dayItems.some((m) => m.category === "owned");
                const hasAttending = dayItems.some(
                  (m) => m.category === "attending",
                );
                const hasFollowing = dayItems.some(
                  (m) => m.category === "following",
                );

                return (
                  <motion.button
                    key={key}
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setDrawerDay(day)}
                    className={[
                      "flex flex-col items-center py-1.5 rounded-xl transition-smooth",
                      isToday
                        ? "ring-2 ring-[oklch(var(--accent))]"
                        : "hover:bg-muted/40",
                    ].join(" ")}
                    style={
                      isToday
                        ? { boxShadow: "0 0 10px oklch(var(--accent) / 0.25)" }
                        : undefined
                    }
                    data-ocid={`calendar-30day-${dayNumber}`}
                  >
                    <span
                      className={[
                        "text-[10px] font-semibold",
                        isToday
                          ? "text-[oklch(var(--accent))]"
                          : "text-foreground",
                      ].join(" ")}
                    >
                      {dayNumber}
                    </span>
                    <div className="flex gap-0.5 mt-0.5 h-1.5">
                      {hasOwned && (
                        <span className="w-1 h-1 rounded-full bg-[oklch(var(--chart-1))]" />
                      )}
                      {hasAttending && (
                        <span className="w-1 h-1 rounded-full bg-[oklch(var(--chart-3))]" />
                      )}
                      {hasFollowing && (
                        <span className="w-1 h-1 rounded-full bg-[oklch(var(--chart-2))]" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Glass drawer */}
      <AnimatePresence>
        {drawerDay && (
          <DayDrawer
            date={drawerDay}
            items={grouped.get(startOfDay(drawerDay).toISOString()) ?? []}
            onClose={() => setDrawerDay(null)}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Calendar skeleton ─────────────────────────────────────────────────────────

function CalendarSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-center">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }, (_, i) => `skel-${i}`).map((k) => (
          <Skeleton key={k} className="h-14 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full rounded-full" />
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

// ── Main CalendarView ──────────────────────────────────────────────────────────

export function CalendarView() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewWindow>("week");
  const [monthOffset, setMonthOffset] = useState(0);

  const today = useMemo(() => startOfDay(new Date()), []);

  const { rangeStart, rangeEnd } = useMemo(() => {
    if (view === "30day") {
      // Use the full month for the 30day view, respecting monthOffset
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1,
      );
      const monthStart = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth(),
        1,
      );
      const monthEnd = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      return {
        rangeStart: BigInt(monthStart.getTime()) * 1_000_000n,
        rangeEnd: BigInt(monthEnd.getTime()) * 1_000_000n,
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
      rangeStart: BigInt(start.getTime()) * 1_000_000n,
      rangeEnd: BigInt(end.getTime()) * 1_000_000n,
    };
  }, [view, today, monthOffset]);

  const { data: calendarMoments = [], isLoading: calLoading } = useQuery<
    MomentListItem[]
  >({
    queryKey: [...QUERY_KEYS.myCalendarMoments, view, monthOffset],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCalendarMoments(rangeStart, rangeEnd);
    },
    enabled: !!actor,
  });

  const { data: feedMoments = [], isLoading: feedLoading } = useQuery<
    MomentListItem[]
  >({
    queryKey: [...QUERY_KEYS.feedMoments, view, monthOffset],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeedMoments();
    },
    enabled: !!actor,
  });

  const isLoading = calLoading || feedLoading;

  const windowEnd = useMemo(() => {
    if (view === "30day") {
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1,
      );
      return new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
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

  const windowStart = useMemo(() => {
    if (view === "30day") {
      const targetMonth = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1,
      );
      return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    }
    return today;
  }, [view, today, monthOffset]);

  const allMoments = useMemo((): CalendarMoment[] => {
    const calIds = new Set(
      calendarMoments.map(
        (m) => `${m.id}-${String(m.occurrenceDate ?? m.eventDate)}`,
      ),
    );

    const cal: CalendarMoment[] = calendarMoments.map((m) => ({
      moment: m,
      category: getMomentCategory(m, "own"),
      date: resolveDate(m),
    }));

    const feed: CalendarMoment[] = feedMoments
      .filter(
        (m) =>
          !calIds.has(`${m.id}-${String(m.occurrenceDate ?? m.eventDate)}`),
      )
      .map((m) => ({
        moment: m,
        category: getMomentCategory(m, "feed"),
        date: resolveDate(m),
      }))
      .filter((m) => m.date >= windowStart && m.date < windowEnd);

    return [...cal, ...feed];
  }, [calendarMoments, feedMoments, windowStart, windowEnd]);

  const grouped = useMemo(() => groupByDate(allMoments), [allMoments]);
  const sortedDateKeys = useMemo(() => [...grouped.keys()].sort(), [grouped]);

  // Month navigation label
  const monthLabel = useMemo(() => {
    const d = new Date(today);
    d.setMonth(today.getMonth() + monthOffset);
    return d.toLocaleDateString([], { month: "long", year: "numeric" });
  }, [today, monthOffset]);

  function handleNavigate(id: string) {
    navigate({ to: "/moments/$momentId", params: { momentId: id } });
  }

  const viewOptions: { label: string; value: ViewWindow }[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "30 Days", value: "30day" },
  ];

  return (
    <div
      className="glass-card rounded-3xl p-4 overflow-hidden space-y-4"
      data-ocid="calendar-view"
    >
      {/* Top row: title + pill toggle */}
      <div className="flex items-center justify-between gap-2">
        {/* Month navigation */}
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMonthOffset((o) => o - 1)}
            className="w-7 h-7 rounded-full glass-card flex items-center justify-center"
            aria-label="Previous"
            data-ocid="calendar-prev"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
          </motion.button>
          <h2 className="font-display font-bold text-sm bg-gradient-to-r from-foreground to-[oklch(var(--accent))] bg-clip-text text-transparent min-w-[120px] text-center">
            {monthLabel}
          </h2>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMonthOffset((o) => o + 1)}
            className="w-7 h-7 rounded-full glass-card flex items-center justify-center"
            aria-label="Next"
            data-ocid="calendar-next"
          >
            <ChevronRight className="w-3.5 h-3.5 text-foreground" />
          </motion.button>
        </div>

        {/* Pill toggle with sliding capsule */}
        <div
          className="relative flex items-center bg-black/10 dark:bg-white/5 rounded-full p-1"
          data-ocid="calendar-view-toggle"
        >
          {viewOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setView(opt.value)}
              className="relative px-3 py-1.5 rounded-full text-xs font-semibold z-10 transition-colors duration-150"
              style={{
                color:
                  view === opt.value
                    ? "oklch(var(--foreground))"
                    : "oklch(var(--muted-foreground))",
              }}
              data-ocid={`calendar-toggle-${opt.value}`}
            >
              {view === opt.value && (
                <motion.span
                  layoutId="calendar-view-active"
                  className="absolute inset-0 rounded-full bg-card shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[oklch(var(--chart-1))]" />
          <span className="text-[10px] text-muted-foreground">Mine</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[oklch(var(--chart-3))]" />
          <span className="text-[10px] text-muted-foreground">Attending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[oklch(var(--chart-2))]" />
          <span className="text-[10px] text-muted-foreground">Following</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-2.5 h-2.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Recurring</span>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CalendarSkeleton />
          </motion.div>
        ) : view === "week" ? (
          <motion.div
            key="week"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <WeekView
              moments={allMoments}
              windowStart={today}
              onNavigate={handleNavigate}
            />
          </motion.div>
        ) : view === "30day" ? (
          <motion.div
            key="30day"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <ThirtyDayView
              moments={allMoments}
              monthOffset={monthOffset}
              onNavigate={handleNavigate}
            />
          </motion.div>
        ) : allMoments.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6 space-y-2"
            data-ocid="calendar-empty-state"
          >
            <CalendarDays className="w-8 h-8 text-[oklch(var(--accent)/0.5)] mx-auto" />
            <p className="text-sm text-muted-foreground">
              No moments in this window
            </p>
            <p className="text-xs text-muted-foreground">
              Create a moment or follow others to see events here
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="day-list"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
            data-ocid="calendar-moments-list"
          >
            {sortedDateKeys.map((key) => (
              <DaySection
                key={key}
                dateKey={key}
                items={grouped.get(key)!}
                onNavigate={handleNavigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
