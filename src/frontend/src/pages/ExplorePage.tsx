import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  Compass,
  Filter,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { EmptyState } from "../components/EmptyState";
import { Layout } from "../components/Layout";
import { MomentCard } from "../components/MomentCard";
import { useBackend } from "../hooks/use-backend";
import { QUERY_KEYS } from "../lib/query-keys";
import type { MomentListItem } from "../types";

const PAGE_SIZE = 12n;
const NEAR_ME_RADIUS_KM = 50;

// ── Haversine distance (km) ───────────────────────────────────────────────────
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Filter state type ─────────────────────────────────────────────────────────
interface FilterState {
  query: string;
  tags: string[];
  dateFrom: string;
  dateTo: string;
  nearMe: boolean;
  nearMeLat?: number;
  nearMeLng?: number;
  nearMeLabel?: string;
}

function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.query) n++;
  if (f.tags.length) n += f.tags.length;
  if (f.dateFrom) n++;
  if (f.dateTo) n++;
  if (f.nearMe) n++;
  return n;
}

// ── Glass skeleton card ───────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden glass-card h-52"
      aria-hidden="true"
    >
      <div className="w-full h-full animate-shimmer rounded-2xl" />
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {["a", "b", "c", "d", "e", "f"].map((id) => (
        <SkeletonCard key={`sk-${id}`} />
      ))}
    </div>
  );
}

// ── Active filter chip ────────────────────────────────────────────────────────
function FilterChip({
  label,
  onRemove,
  ocid,
}: {
  label: string;
  onRemove: () => void;
  ocid: string;
}) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <motion.span
      data-ocid={ocid}
      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium font-body bg-accent text-accent-foreground border border-accent/30"
      initial={
        prefersReducedMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.85 }
      }
      animate={{ opacity: 1, scale: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.85 }
      }
      transition={{ duration: 0.15 }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-accent-foreground/20 transition-colors"
        data-ocid={`${ocid}.remove`}
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function ExplorePage() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── URL search params ──────────────────────────────────────────────────────
  const getUrlParams = useCallback(() => {
    const sp = new URLSearchParams(window.location.search);
    return {
      query: sp.get("q") ?? "",
      dateFrom: sp.get("from") ?? "",
      dateTo: sp.get("to") ?? "",
      tags: sp.getAll("tag"),
    };
  }, []);

  const urlParams = getUrlParams();

  // ── Filter state ───────────────────────────────────────────────────────────
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [filters, setFilters] = useState<FilterState>({
    query: urlParams.query,
    tags: urlParams.tags,
    dateFrom: urlParams.dateFrom,
    dateTo: urlParams.dateTo,
    nearMe: false,
  });

  const [nearMeLoading, setNearMeLoading] = useState(false);
  const [nearMeError, setNearMeError] = useState<string | null>(null);

  // ── Sync filters → URL ─────────────────────────────────────────────────────
  useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.query) sp.set("q", filters.query);
    if (filters.dateFrom) sp.set("from", filters.dateFrom);
    if (filters.dateTo) sp.set("to", filters.dateTo);
    for (const tag of filters.tags) sp.append("tag", tag);
    const newSearch = sp.toString();
    const currentSearch = window.location.search.replace(/^\?/, "");
    if (newSearch !== currentSearch) {
      const newUrl = newSearch
        ? `${window.location.pathname}?${newSearch}`
        : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [filters]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [extraPages, setExtraPages] = useState<MomentListItem[]>([]);
  const [nextOffset, setNextOffset] = useState(PAGE_SIZE);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const actorRef = useRef(actor);
  actorRef.current = actor;

  // ── Query ──────────────────────────────────────────────────────────────────
  const queryKey = [
    ...QUERY_KEYS.searchMoments(filters.query, filters.tags),
    filters.dateFrom,
    filters.dateTo,
    filters.nearMe ? `${filters.nearMeLat},${filters.nearMeLng}` : "",
  ] as const;

  const { data: firstPage, isLoading } = useQuery<MomentListItem[]>({
    queryKey,
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.searchMoments(
        filters.query.trim() || null,
        filters.tags,
        null,
        null,
        null,
        null,
        null,
        0n,
        PAGE_SIZE,
      );
      setExtraPages([]);
      setNextOffset(PAGE_SIZE);
      setHasMore(result.length === Number(PAGE_SIZE));
      return result;
    },
    enabled: actor !== null,
    refetchOnMount: true,
    staleTime: 0,
  });

  // ── Client-side post-filtering for date + near me ─────────────────────────
  const applyClientFilters = useCallback(
    (items: MomentListItem[]): MomentListItem[] => {
      let result = items;

      if (filters.dateFrom) {
        const fromMs = new Date(filters.dateFrom).getTime();
        result = result.filter(
          (m) => Number(m.eventDate) / 1_000_000 >= fromMs,
        );
      }
      if (filters.dateTo) {
        const toMs = new Date(filters.dateTo).getTime() + 86_400_000;
        result = result.filter((m) => Number(m.eventDate) / 1_000_000 <= toMs);
      }
      if (
        filters.nearMe &&
        filters.nearMeLat !== undefined &&
        filters.nearMeLng !== undefined
      ) {
        result = result.filter((m) => {
          if (m.locationLat === undefined || m.locationLng === undefined)
            return false;
          return (
            haversineKm(
              filters.nearMeLat!,
              filters.nearMeLng!,
              m.locationLat,
              m.locationLng,
            ) <= NEAR_ME_RADIUS_KM
          );
        });
      }

      return result;
    },
    [
      filters.dateFrom,
      filters.dateTo,
      filters.nearMe,
      filters.nearMeLat,
      filters.nearMeLng,
    ],
  );

  const allRaw = [...(firstPage ?? []), ...extraPages];
  const allMoments = applyClientFilters(allRaw);

  // ── Load more ──────────────────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!actorRef.current || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await actorRef.current.searchMoments(
        filters.query.trim() || null,
        filters.tags,
        null,
        null,
        null,
        null,
        null,
        nextOffset,
        PAGE_SIZE,
      );
      setExtraPages((prev) => [...prev, ...result]);
      setNextOffset((prev) => prev + PAGE_SIZE);
      setHasMore(result.length === Number(PAGE_SIZE));
    } finally {
      setLoadingMore(false);
    }
  }, [filters.query, filters.tags, nextOffset, loadingMore]);

  // ── Near Me handler ────────────────────────────────────────────────────────
  const handleNearMe = useCallback(() => {
    if (filters.nearMe) {
      setFilters((prev) => ({
        ...prev,
        nearMe: false,
        nearMeLat: undefined,
        nearMeLng: undefined,
        nearMeLabel: undefined,
      }));
      return;
    }

    if (!navigator.geolocation) {
      setNearMeError("Location not supported by your browser");
      return;
    }

    setNearMeLoading(true);
    setNearMeError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        let label = "Near you";
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } },
          );
          if (resp.ok) {
            const data = (await resp.json()) as {
              address?: {
                city?: string;
                town?: string;
                village?: string;
                county?: string;
              };
            };
            const place =
              data.address?.city ??
              data.address?.town ??
              data.address?.village ??
              data.address?.county;
            if (place) label = `Near ${place}`;
          }
        } catch {
          // fallback to "Near you"
        }

        setFilters((prev) => ({
          ...prev,
          nearMe: true,
          nearMeLat: latitude,
          nearMeLng: longitude,
          nearMeLabel: label,
        }));
        setNearMeLoading(false);
      },
      (err) => {
        setNearMeError(
          err.code === 1
            ? "Location permission denied"
            : "Could not get your location",
        );
        setNearMeLoading(false);
      },
      { timeout: 10000, maximumAge: 300_000 },
    );
  }, [filters.nearMe]);

  // ── Tag handlers ───────────────────────────────────────────────────────────
  const addTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase();
    if (!t || filters.tags.includes(t)) return;
    setFilters((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput("");
  }, [tagInput, filters.tags]);

  const removeTag = useCallback(
    (tag: string) =>
      setFilters((prev) => ({
        ...prev,
        tags: prev.tags.filter((t) => t !== tag),
      })),
    [],
  );

  const clearAll = useCallback(() => {
    setFilters({
      query: "",
      tags: [],
      dateFrom: "",
      dateTo: "",
      nearMe: false,
    });
    setNearMeError(null);
  }, []);

  const activeCount = countActiveFilters(filters);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AuthGuard requireAuth={false} currentPath="/explore">
      <Layout>
        <div className="py-6 space-y-4">
          {/* Page header */}
          <motion.div
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: -8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.3 },
                })}
          >
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              Explore
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-0.5">
              Discover public moments from the community
            </p>
          </motion.div>

          {/* ── Glass filter card ────────────────────────────────────────── */}
          <motion.div
            className="glass-card rounded-2xl p-3 space-y-3"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.3, delay: 0.05 },
                })}
          >
            {/* Search row */}
            <div className="flex gap-2 items-center">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex-1"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={filters.query}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, query: e.target.value }))
                  }
                  placeholder="Search moments…"
                  className="pl-9 pr-9 font-body glass-input border-transparent focus:border-accent/40 h-10 text-sm"
                  data-ocid="explore.search_input"
                />
                {filters.query && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, query: "" }))
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                    data-ocid="explore.clear_search_button"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Filter toggle */}
              <button
                type="button"
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shrink-0 ${
                  filtersOpen || activeCount > 0
                    ? "bg-accent text-accent-foreground glow-accent-sm"
                    : "glass-input text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setFiltersOpen((o) => !o)}
                aria-label="Toggle filters"
                aria-expanded={filtersOpen}
                data-ocid="explore.filter_toggle"
              >
                <Filter className="w-4 h-4" />
                {activeCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center border border-background pointer-events-none"
                    data-ocid="explore.active-filter-badge"
                  >
                    {activeCount}
                  </span>
                )}
              </button>
            </div>

            {/* Expanded filter panel */}
            <AnimatePresence initial={false}>
              {filtersOpen && (
                <motion.div
                  key="filter-panel"
                  data-ocid="explore.filter_panel"
                  initial={
                    prefersReducedMotion ? {} : { height: 0, opacity: 0 }
                  }
                  animate={
                    prefersReducedMotion ? {} : { height: "auto", opacity: 1 }
                  }
                  exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-1 space-y-4">
                    {/* Date range */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        Date range
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label
                            htmlFor="explore-date-from"
                            className="sr-only"
                          >
                            From date
                          </label>
                          <Input
                            id="explore-date-from"
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                dateFrom: e.target.value,
                              }))
                            }
                            className="font-body text-sm glass-input border-transparent h-9"
                            data-ocid="explore.date_from_input"
                          />
                        </div>
                        <div>
                          <label htmlFor="explore-date-to" className="sr-only">
                            To date
                          </label>
                          <Input
                            id="explore-date-to"
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                dateTo: e.target.value,
                              }))
                            }
                            className="font-body text-sm glass-input border-transparent h-9"
                            data-ocid="explore.date_to_input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        Tags
                      </p>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                          placeholder="Add a tag…"
                          className="flex-1 font-body text-sm glass-input border-transparent h-9"
                          data-ocid="explore.tag_input"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={addTag}
                          className="shrink-0 h-9 px-3 bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30"
                          data-ocid="explore.add_tag_button"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Near Me */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        Location
                      </p>
                      <button
                        type="button"
                        onClick={handleNearMe}
                        disabled={nearMeLoading}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 disabled:opacity-60 ${
                          filters.nearMe
                            ? "bg-accent text-accent-foreground glow-accent-sm"
                            : "bg-gradient-to-r from-violet-500/80 to-indigo-500/80 text-white glow-accent-sm hover:from-violet-500 hover:to-indigo-500"
                        }`}
                        data-ocid="explore.near_me_button"
                      >
                        {nearMeLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                        {nearMeLoading
                          ? "Detecting…"
                          : filters.nearMe
                            ? (filters.nearMeLabel ?? "Near you")
                            : "Near me"}
                        {filters.nearMe && (
                          <X className="w-3 h-3 ml-0.5 opacity-70" />
                        )}
                      </button>
                      {nearMeError && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="explore.near_me_error"
                        >
                          {nearMeError}
                        </p>
                      )}
                      {filters.nearMe && (
                        <p className="text-xs text-muted-foreground">
                          Showing moments within {NEAR_ME_RADIUS_KM} km
                        </p>
                      )}
                    </div>

                    {/* Clear all */}
                    {activeCount > 0 && (
                      <div className="pt-1 border-t border-border/40">
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-xs text-destructive hover:underline font-body transition-colors w-full text-left py-1"
                          data-ocid="explore.clear_all_button"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter chips — shown when panel is closed */}
            <AnimatePresence initial={false}>
              {!filtersOpen && activeCount > 0 && (
                <motion.div
                  key="active-chips"
                  className="flex flex-wrap gap-1.5 items-center"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: -4 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {filters.query && (
                    <FilterChip
                      label={`"${filters.query}"`}
                      onRemove={() =>
                        setFilters((prev) => ({ ...prev, query: "" }))
                      }
                      ocid="explore.chip-query"
                    />
                  )}
                  {filters.dateFrom && (
                    <FilterChip
                      label={`From ${filters.dateFrom}`}
                      onRemove={() =>
                        setFilters((prev) => ({ ...prev, dateFrom: "" }))
                      }
                      ocid="explore.chip-from"
                    />
                  )}
                  {filters.dateTo && (
                    <FilterChip
                      label={`To ${filters.dateTo}`}
                      onRemove={() =>
                        setFilters((prev) => ({ ...prev, dateTo: "" }))
                      }
                      ocid="explore.chip-to"
                    />
                  )}
                  {filters.tags.map((tag, i) => (
                    <FilterChip
                      key={tag}
                      label={`#${tag}`}
                      onRemove={() => removeTag(tag)}
                      ocid={`explore.filter-tag.${i + 1}`}
                    />
                  ))}
                  {filters.nearMe && (
                    <FilterChip
                      label={filters.nearMeLabel ?? "Near you"}
                      onRemove={() =>
                        setFilters((prev) => ({
                          ...prev,
                          nearMe: false,
                          nearMeLat: undefined,
                          nearMeLng: undefined,
                          nearMeLabel: undefined,
                        }))
                      }
                      ocid="explore.chip-near-me"
                    />
                  )}
                  <button
                    type="button"
                    className="text-[11px] text-muted-foreground hover:text-foreground underline transition-colors font-body"
                    onClick={clearAll}
                    data-ocid="explore.clear_all_inline"
                  >
                    Clear all
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Content ──────────────────────────────────────────────────── */}
          {isLoading ? (
            <SearchSkeleton />
          ) : allMoments.length === 0 ? (
            <EmptyState
              icon={Compass}
              title={
                activeCount
                  ? "No moments match your filters"
                  : "Nothing here yet"
              }
              description={
                activeCount
                  ? "Try adjusting or clearing your filters to see more results."
                  : "Be the first to share a public moment with the community."
              }
            />
          ) : (
            <div className="space-y-6">
              {/* Simple CSS grid — reliable rendering on all devices */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-ocid="explore.moments_grid"
              >
                {allMoments.map((moment, i) => (
                  <MomentCard
                    key={moment.id.toString()}
                    moment={moment}
                    index={i}
                    onClick={() =>
                      navigate({
                        to: "/moments/$momentId",
                        params: { momentId: moment.id.toString() },
                      })
                    }
                  />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center pb-4">
                  <motion.button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-body font-medium glass-card border-white/20 text-foreground hover:bg-accent/10 transition-all duration-200 disabled:opacity-60"
                    data-ocid="explore.load_more_button"
                    {...(prefersReducedMotion
                      ? {}
                      : { whileTap: { scale: 0.97 } })}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading…
                      </>
                    ) : (
                      "Load more"
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
