import { a as useBackend, c as useNavigate, r as reactExports, Q as QUERY_KEYS, f as useQuery, j as jsxRuntimeExports } from "./index-CtLY6vs2.js";
import { L as Layout, A as AnimatePresence, B as Button, C as Compass } from "./Layout--chq1LOo.js";
import { I as Input } from "./input-2BuC702O.js";
import { A as AuthGuard } from "./AuthGuard-DMUXLMEr.js";
import { E as EmptyState } from "./EmptyState-CyoGzm3h.js";
import { M as MomentCard } from "./MomentCard-BN4hJRRA.js";
import { c as createLucideIcon, m as motion } from "./proxy-C4ENgEup.js";
import { S as Search } from "./search-_cZ3z0mp.js";
import { X } from "./x-ByUr0oC6.js";
import { C as Calendar, M as MapPin } from "./map-pin-BZ9OY5eh.js";
import { L as LoaderCircle } from "./loader-circle-IsGqk4oh.js";
import "./index-DIX-OhXh.js";
import "./user-DWv8V36G.js";
import "./sun-Dp_dfXPb.js";
import "./users-Cc_IBNm5.js";
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
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode);
const PAGE_SIZE = 12n;
const NEAR_ME_RADIUS_KM = 50;
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function countActiveFilters(f) {
  let n = 0;
  if (f.query) n++;
  if (f.tags.length) n += f.tags.length;
  if (f.dateFrom) n++;
  if (f.dateTo) n++;
  if (f.nearMe) n++;
  return n;
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "rounded-2xl overflow-hidden glass-card h-52",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full animate-shimmer rounded-2xl" })
    }
  );
}
function SearchSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["a", "b", "c", "d", "e", "f"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, `sk-${id}`)) });
}
function FilterChip({
  label,
  onRemove,
  ocid
}) {
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.span,
    {
      "data-ocid": ocid,
      className: "inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium font-body bg-accent text-accent-foreground border border-accent/30",
      initial: prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 },
      animate: { opacity: 1, scale: 1 },
      exit: prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 },
      transition: { duration: 0.15 },
      children: [
        label,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            "aria-label": `Remove filter: ${label}`,
            className: "w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-accent-foreground/20 transition-colors",
            "data-ocid": `${ocid}.remove`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2.5 h-2.5" })
          }
        )
      ]
    }
  );
}
function ExplorePage() {
  const { actor } = useBackend();
  const navigate = useNavigate();
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getUrlParams = reactExports.useCallback(() => {
    const sp = new URLSearchParams(window.location.search);
    return {
      query: sp.get("q") ?? "",
      dateFrom: sp.get("from") ?? "",
      dateTo: sp.get("to") ?? "",
      tags: sp.getAll("tag")
    };
  }, []);
  const urlParams = getUrlParams();
  const [filtersOpen, setFiltersOpen] = reactExports.useState(false);
  const [tagInput, setTagInput] = reactExports.useState("");
  const [filters, setFilters] = reactExports.useState({
    query: urlParams.query,
    tags: urlParams.tags,
    dateFrom: urlParams.dateFrom,
    dateTo: urlParams.dateTo,
    nearMe: false
  });
  const [nearMeLoading, setNearMeLoading] = reactExports.useState(false);
  const [nearMeError, setNearMeError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.query) sp.set("q", filters.query);
    if (filters.dateFrom) sp.set("from", filters.dateFrom);
    if (filters.dateTo) sp.set("to", filters.dateTo);
    for (const tag of filters.tags) sp.append("tag", tag);
    const newSearch = sp.toString();
    const currentSearch = window.location.search.replace(/^\?/, "");
    if (newSearch !== currentSearch) {
      const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [filters]);
  const [extraPages, setExtraPages] = reactExports.useState([]);
  const [nextOffset, setNextOffset] = reactExports.useState(PAGE_SIZE);
  const [hasMore, setHasMore] = reactExports.useState(false);
  const [loadingMore, setLoadingMore] = reactExports.useState(false);
  const actorRef = reactExports.useRef(actor);
  actorRef.current = actor;
  const queryKey = [
    ...QUERY_KEYS.searchMoments(filters.query, filters.tags),
    filters.dateFrom,
    filters.dateTo,
    filters.nearMe ? `${filters.nearMeLat},${filters.nearMeLng}` : ""
  ];
  const { data: firstPage, isLoading } = useQuery({
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
        PAGE_SIZE
      );
      setExtraPages([]);
      setNextOffset(PAGE_SIZE);
      setHasMore(result.length === Number(PAGE_SIZE));
      return result;
    },
    enabled: actor !== null,
    refetchOnMount: true,
    staleTime: 0
  });
  const applyClientFilters = reactExports.useCallback(
    (items) => {
      let result = items;
      if (filters.dateFrom) {
        const fromMs = new Date(filters.dateFrom).getTime();
        result = result.filter(
          (m) => Number(m.eventDate) / 1e6 >= fromMs
        );
      }
      if (filters.dateTo) {
        const toMs = new Date(filters.dateTo).getTime() + 864e5;
        result = result.filter((m) => Number(m.eventDate) / 1e6 <= toMs);
      }
      if (filters.nearMe && filters.nearMeLat !== void 0 && filters.nearMeLng !== void 0) {
        result = result.filter((m) => {
          if (m.locationLat === void 0 || m.locationLng === void 0)
            return false;
          return haversineKm(
            filters.nearMeLat,
            filters.nearMeLng,
            m.locationLat,
            m.locationLng
          ) <= NEAR_ME_RADIUS_KM;
        });
      }
      return result;
    },
    [
      filters.dateFrom,
      filters.dateTo,
      filters.nearMe,
      filters.nearMeLat,
      filters.nearMeLng
    ]
  );
  const allRaw = [...firstPage ?? [], ...extraPages];
  const allMoments = applyClientFilters(allRaw);
  const loadMore = reactExports.useCallback(async () => {
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
        PAGE_SIZE
      );
      setExtraPages((prev) => [...prev, ...result]);
      setNextOffset((prev) => prev + PAGE_SIZE);
      setHasMore(result.length === Number(PAGE_SIZE));
    } finally {
      setLoadingMore(false);
    }
  }, [filters.query, filters.tags, nextOffset, loadingMore]);
  const handleNearMe = reactExports.useCallback(() => {
    if (filters.nearMe) {
      setFilters((prev) => ({
        ...prev,
        nearMe: false,
        nearMeLat: void 0,
        nearMeLng: void 0,
        nearMeLabel: void 0
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
        var _a, _b, _c, _d;
        const { latitude, longitude } = pos.coords;
        let label = "Near you";
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          if (resp.ok) {
            const data = await resp.json();
            const place = ((_a = data.address) == null ? void 0 : _a.city) ?? ((_b = data.address) == null ? void 0 : _b.town) ?? ((_c = data.address) == null ? void 0 : _c.village) ?? ((_d = data.address) == null ? void 0 : _d.county);
            if (place) label = `Near ${place}`;
          }
        } catch {
        }
        setFilters((prev) => ({
          ...prev,
          nearMe: true,
          nearMeLat: latitude,
          nearMeLng: longitude,
          nearMeLabel: label
        }));
        setNearMeLoading(false);
      },
      (err) => {
        setNearMeError(
          err.code === 1 ? "Location permission denied" : "Could not get your location"
        );
        setNearMeLoading(false);
      },
      { timeout: 1e4, maximumAge: 3e5 }
    );
  }, [filters.nearMe]);
  const addTag = reactExports.useCallback(() => {
    const t = tagInput.trim().toLowerCase();
    if (!t || filters.tags.includes(t)) return;
    setFilters((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput("");
  }, [tagInput, filters.tags]);
  const removeTag = reactExports.useCallback(
    (tag) => setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag)
    })),
    []
  );
  const clearAll = reactExports.useCallback(() => {
    setFilters({
      query: "",
      tags: [],
      dateFrom: "",
      dateTo: "",
      nearMe: false
    });
    setNearMeError(null);
  }, []);
  const activeCount = countActiveFilters(filters);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { requireAuth: false, currentPath: "/explore", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        ...prefersReducedMotion ? {} : {
          initial: { opacity: 0, y: -8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-tight", children: "Explore" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-0.5", children: "Discover public moments from the community" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "glass-card rounded-2xl p-3 space-y-3",
        ...prefersReducedMotion ? {} : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, delay: 0.05 }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: (e) => e.preventDefault(),
                className: "relative flex-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: filters.query,
                      onChange: (e) => setFilters((prev) => ({ ...prev, query: e.target.value })),
                      placeholder: "Search moments…",
                      className: "pl-9 pr-9 font-body glass-input border-transparent focus:border-accent/40 h-10 text-sm",
                      "data-ocid": "explore.search_input"
                    }
                  ),
                  filters.query && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFilters((prev) => ({ ...prev, query: "" })),
                      className: "absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors",
                      "aria-label": "Clear search",
                      "data-ocid": "explore.clear_search_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: `relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shrink-0 ${filtersOpen || activeCount > 0 ? "bg-accent text-accent-foreground glow-accent-sm" : "glass-input text-muted-foreground hover:text-foreground"}`,
                onClick: () => setFiltersOpen((o) => !o),
                "aria-label": "Toggle filters",
                "aria-expanded": filtersOpen,
                "data-ocid": "explore.filter_toggle",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4" }),
                  activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute -top-1 -right-1 h-4 w-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center border border-background pointer-events-none",
                      "data-ocid": "explore.active-filter-badge",
                      children: activeCount
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: filtersOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              "data-ocid": "explore.filter_panel",
              initial: prefersReducedMotion ? {} : { height: 0, opacity: 0 },
              animate: prefersReducedMotion ? {} : { height: "auto", opacity: 1 },
              exit: prefersReducedMotion ? {} : { height: 0, opacity: 0 },
              transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
              className: "overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                    "Date range"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "explore-date-from",
                          className: "sr-only",
                          children: "From date"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "explore-date-from",
                          type: "date",
                          value: filters.dateFrom,
                          onChange: (e) => setFilters((prev) => ({
                            ...prev,
                            dateFrom: e.target.value
                          })),
                          className: "font-body text-sm glass-input border-transparent h-9",
                          "data-ocid": "explore.date_from_input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "explore-date-to", className: "sr-only", children: "To date" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "explore-date-to",
                          type: "date",
                          value: filters.dateTo,
                          onChange: (e) => setFilters((prev) => ({
                            ...prev,
                            dateTo: e.target.value
                          })),
                          className: "font-body text-sm glass-input border-transparent h-9",
                          "data-ocid": "explore.date_to_input"
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest", children: "Tags" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: tagInput,
                        onChange: (e) => setTagInput(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        },
                        placeholder: "Add a tag…",
                        className: "flex-1 font-body text-sm glass-input border-transparent h-9",
                        "data-ocid": "explore.tag_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        onClick: addTag,
                        className: "shrink-0 h-9 px-3 bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30",
                        "data-ocid": "explore.add_tag_button",
                        children: "Add"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                    "Location"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleNearMe,
                      disabled: nearMeLoading,
                      className: `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 disabled:opacity-60 ${filters.nearMe ? "bg-accent text-accent-foreground glow-accent-sm" : "bg-gradient-to-r from-violet-500/80 to-indigo-500/80 text-white glow-accent-sm hover:from-violet-500 hover:to-indigo-500"}`,
                      "data-ocid": "explore.near_me_button",
                      children: [
                        nearMeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
                        nearMeLoading ? "Detecting…" : filters.nearMe ? filters.nearMeLabel ?? "Near you" : "Near me",
                        filters.nearMe && /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 ml-0.5 opacity-70" })
                      ]
                    }
                  ),
                  nearMeError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "explore.near_me_error",
                      children: nearMeError
                    }
                  ),
                  filters.nearMe && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Showing moments within ",
                    NEAR_ME_RADIUS_KM,
                    " km"
                  ] })
                ] }),
                activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: clearAll,
                    className: "text-xs text-destructive hover:underline font-body transition-colors w-full text-left py-1",
                    "data-ocid": "explore.clear_all_button",
                    children: "Clear all filters"
                  }
                ) })
              ] })
            },
            "filter-panel"
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: !filtersOpen && activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "flex flex-wrap gap-1.5 items-center",
              initial: prefersReducedMotion ? {} : { opacity: 0, y: -4 },
              animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
              exit: prefersReducedMotion ? {} : { opacity: 0, y: -4 },
              transition: { duration: 0.15 },
              children: [
                filters.query && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FilterChip,
                  {
                    label: `"${filters.query}"`,
                    onRemove: () => setFilters((prev) => ({ ...prev, query: "" })),
                    ocid: "explore.chip-query"
                  }
                ),
                filters.dateFrom && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FilterChip,
                  {
                    label: `From ${filters.dateFrom}`,
                    onRemove: () => setFilters((prev) => ({ ...prev, dateFrom: "" })),
                    ocid: "explore.chip-from"
                  }
                ),
                filters.dateTo && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FilterChip,
                  {
                    label: `To ${filters.dateTo}`,
                    onRemove: () => setFilters((prev) => ({ ...prev, dateTo: "" })),
                    ocid: "explore.chip-to"
                  }
                ),
                filters.tags.map((tag, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FilterChip,
                  {
                    label: `#${tag}`,
                    onRemove: () => removeTag(tag),
                    ocid: `explore.filter-tag.${i + 1}`
                  },
                  tag
                )),
                filters.nearMe && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FilterChip,
                  {
                    label: filters.nearMeLabel ?? "Near you",
                    onRemove: () => setFilters((prev) => ({
                      ...prev,
                      nearMe: false,
                      nearMeLat: void 0,
                      nearMeLng: void 0,
                      nearMeLabel: void 0
                    })),
                    ocid: "explore.chip-near-me"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-[11px] text-muted-foreground hover:text-foreground underline transition-colors font-body",
                    onClick: clearAll,
                    "data-ocid": "explore.clear_all_inline",
                    children: "Clear all"
                  }
                )
              ]
            },
            "active-chips"
          ) })
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SearchSkeleton, {}) : allMoments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Compass,
        title: activeCount ? "No moments match your filters" : "Nothing here yet",
        description: activeCount ? "Try adjusting or clearing your filters to see more results." : "Be the first to share a public moment with the community."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
          "data-ocid": "explore.moments_grid",
          children: allMoments.map((moment, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            MomentCard,
            {
              moment,
              index: i,
              onClick: () => navigate({
                to: "/moments/$momentId",
                params: { momentId: moment.id.toString() }
              })
            },
            moment.id.toString()
          ))
        }
      ),
      hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          type: "button",
          onClick: loadMore,
          disabled: loadingMore,
          className: "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-body font-medium glass-card border-white/20 text-foreground hover:bg-accent/10 transition-all duration-200 disabled:opacity-60",
          "data-ocid": "explore.load_more_button",
          ...prefersReducedMotion ? {} : { whileTap: { scale: 0.97 } },
          children: loadingMore ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            "Loading…"
          ] }) : "Load more"
        }
      ) })
    ] })
  ] }) }) });
}
export {
  ExplorePage
};
