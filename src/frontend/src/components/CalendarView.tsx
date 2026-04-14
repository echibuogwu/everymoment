import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import type { CallerRelation } from "../backend";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import type { MomentListItem } from "../types";

type ViewWindow = "day" | "week" | "30day";

/** Resolve the calendar colour category from callerRelation or fallback. */
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
      pill: "bg-[oklch(var(--chart-1)/0.12)] border border-[oklch(var(--chart-1)/0.3)]",
      dot: "bg-[oklch(var(--chart-1))]",
      dotActive: "bg-primary-foreground",
    };
  if (category === "attending")
    return {
      pill: "bg-[oklch(var(--chart-3)/0.12)] border border-[oklch(var(--chart-3)/0.3)]",
      dot: "bg-[oklch(var(--chart-3))]",
      dotActive: "bg-primary-foreground/85",
    };
  return {
    pill: "bg-[oklch(var(--chart-2)/0.10)] border border-[oklch(var(--chart-2)/0.25)]",
    dot: "bg-[oklch(var(--chart-2))]",
    dotActive: "bg-primary-foreground/70",
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

function groupByDate(moments: CalendarMoment[]): Map<string, CalendarMoment[]> {
  const map = new Map<string, CalendarMoment[]>();
  for (const m of moments) {
    const key = startOfDay(m.date).toISOString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  // Sort each group by time
  for (const [, group] of map) {
    group.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  return map;
}

function MomentPill({
  item,
  onClick,
}: {
  item: CalendarMoment;
  onClick: () => void;
}) {
  const style = categoryStyle(item.category);
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-2 rounded-lg flex items-start gap-2.5 transition-smooth hover:opacity-80 active:scale-[0.98]",
        style.pill,
      ].join(" ")}
      data-ocid={`calendar-moment-${item.moment.id}`}
    >
      <span
        className={["mt-1 flex-shrink-0 w-2 h-2 rounded-full", style.dot].join(
          " ",
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate leading-tight">
          {item.moment.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground">
            {formatTime(item.date)}
          </span>
          {item.moment.location && (
            <span className="text-xs text-muted-foreground truncate">
              · {item.moment.location}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

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
            "text-xs font-semibold tracking-wide uppercase",
            isToday ? "text-foreground" : "text-muted-foreground",
          ].join(" ")}
        >
          {formatDayLabel(date)}
        </span>
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <MomentPill
            key={`${item.moment.id}-${item.category}`}
            item={item}
            onClick={() => onNavigate(item.moment.id.toString())}
          />
        ))}
      </div>
    </div>
  );
}

// Week view — 7 columns with dots and count
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

  const grouped = useMemo(() => groupByDate(moments), [moments]);

  const activeDay =
    selectedDay ??
    days.find((d) => {
      const key = startOfDay(d).toISOString();
      return grouped.has(key) && (grouped.get(key)?.length ?? 0) > 0;
    }) ??
    days[0];

  const activeDayItems = grouped.get(startOfDay(activeDay).toISOString()) ?? [];

  return (
    <div className="space-y-3">
      {/* 7 day strip */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = startOfDay(day).toISOString();
          const dayItems = grouped.get(key) ?? [];
          const isToday = isSameDay(day, new Date());
          const isActive = isSameDay(day, activeDay);
          const hasOwned = dayItems.some((m) => m.category === "owned");
          const hasAttending = dayItems.some((m) => m.category === "attending");
          const hasFollowing = dayItems.some((m) => m.category === "following");
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={[
                "flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-smooth",
                isActive
                  ? "bg-foreground text-primary-foreground"
                  : isToday
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50",
              ].join(" ")}
              data-ocid={`calendar-week-day-${day.getDay()}`}
            >
              <span className="text-[10px] uppercase tracking-wide">
                {day.toLocaleDateString([], { weekday: "narrow" })}
              </span>
              <span className="text-sm font-medium">{day.getDate()}</span>
              {/* Dot indicators */}
              <div className="flex gap-0.5 h-1.5">
                {hasOwned && (
                  <span
                    className={[
                      "w-1.5 h-1.5 rounded-full",
                      isActive
                        ? "bg-primary-foreground"
                        : "bg-[oklch(var(--chart-1))]",
                    ].join(" ")}
                  />
                )}
                {hasAttending && (
                  <span
                    className={[
                      "w-1.5 h-1.5 rounded-full",
                      isActive
                        ? "bg-primary-foreground/85"
                        : "bg-[oklch(var(--chart-3))]",
                    ].join(" ")}
                  />
                )}
                {hasFollowing && (
                  <span
                    className={[
                      "w-1.5 h-1.5 rounded-full",
                      isActive
                        ? "bg-primary-foreground/70"
                        : "bg-[oklch(var(--chart-2))]",
                    ].join(" ")}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected day moments */}
      {activeDayItems.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-3">
          No moments on {formatDayLabel(activeDay).toLowerCase()}
        </p>
      ) : (
        <div className="space-y-1.5">
          {activeDayItems.map((item) => (
            <MomentPill
              key={`${item.moment.id}-${item.category}`}
              item={item}
              onClick={() => onNavigate(item.moment.id.toString())}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Skeleton loader
function CalendarSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-4 w-20 mt-2" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function CalendarView() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewWindow>("week");

  // getMyCalendarMoments returns owned + approved + RSVP'd public moments
  // with callerRelation field for colour differentiation
  const { data: calendarMoments = [], isLoading: calLoading } = useQuery<
    MomentListItem[]
  >({
    queryKey: QUERY_KEYS.myCalendarMoments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCalendarMoments();
    },
    enabled: !!actor,
  });

  const { data: feedMoments = [], isLoading: feedLoading } = useQuery<
    MomentListItem[]
  >({
    queryKey: QUERY_KEYS.feedMoments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeedMoments();
    },
    enabled: !!actor,
  });

  const isLoading = calLoading || feedLoading;

  // Build the window
  const today = startOfDay(new Date());

  const windowEnd = useMemo(() => {
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

  // Deduplicate: calendar moments (owned+attending) take priority over feed
  const allMoments = useMemo((): CalendarMoment[] => {
    const calIds = new Set(calendarMoments.map((m) => m.id.toString()));
    const cal: CalendarMoment[] = calendarMoments.map((m) => ({
      moment: m,
      category: getMomentCategory(m, "own"),
      date: new Date(Number(m.eventDate) / 1_000_000), // nanoseconds → ms
    }));
    const feed: CalendarMoment[] = feedMoments
      .filter((m) => !calIds.has(m.id.toString()))
      .map((m) => ({
        moment: m,
        category: getMomentCategory(m, "feed"),
        date: new Date(Number(m.eventDate) / 1_000_000),
      }));
    return [...cal, ...feed];
  }, [calendarMoments, feedMoments]);

  const windowMoments = useMemo(
    () => allMoments.filter((m) => m.date >= today && m.date < windowEnd),
    [allMoments, today, windowEnd],
  );

  const grouped = useMemo(() => groupByDate(windowMoments), [windowMoments]);
  const sortedDateKeys = useMemo(() => [...grouped.keys()].sort(), [grouped]);

  function handleNavigate(id: string) {
    navigate({ to: "/moments/$momentId", params: { momentId: id } });
  }

  const viewOptions: { label: string; value: ViewWindow }[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "30 Days", value: "30day" },
  ];

  return (
    <div className="card-elevated p-4 space-y-4" data-ocid="calendar-view">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-display font-semibold text-sm text-foreground">
            Upcoming
          </h2>
        </div>
        {/* View toggle pills */}
        <div
          className="flex items-center bg-muted rounded-full p-0.5 gap-0.5"
          data-ocid="calendar-view-toggle"
        >
          {viewOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setView(opt.value)}
              className={[
                "text-xs font-medium px-3 py-1.5 rounded-full transition-smooth",
                view === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              data-ocid={`calendar-toggle-${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[oklch(var(--chart-1))]" />
          <span className="text-xs text-muted-foreground">My moments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[oklch(var(--chart-3))]" />
          <span className="text-xs text-muted-foreground">Attending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[oklch(var(--chart-2))]" />
          <span className="text-xs text-muted-foreground">Following</span>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <CalendarSkeleton />
      ) : view === "week" ? (
        <WeekView
          moments={windowMoments}
          windowStart={today}
          onNavigate={handleNavigate}
        />
      ) : windowMoments.length === 0 ? (
        <div
          className="text-center py-6 space-y-1"
          data-ocid="calendar-empty-state"
        >
          <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            No moments in this window
          </p>
          <p className="text-xs text-muted-foreground">
            Create a moment or follow others to see events here
          </p>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="calendar-moments-list">
          {sortedDateKeys.map((key) => (
            <DaySection
              key={key}
              dateKey={key}
              items={grouped.get(key)!}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
