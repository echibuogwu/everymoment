import { c as createLucideIcon } from "./createLucideIcon-BUPz7SPw.js";
import { r as reactExports, j as jsxRuntimeExports } from "./index-DlqwQ7hd.js";
import { I as Input } from "./input-BrwhUD3l.js";
import { M as MapPin } from "./map-pin-CyFtcmKR.js";
import { S as Search } from "./search-C6FDed3b.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$1);
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
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode);
function LocationInput({
  value,
  onChange,
  id,
  placeholder = "e.g. Central Park, New York",
  "data-ocid": dataOcid
}) {
  const [query, setQuery] = reactExports.useState(value);
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [noResults, setNoResults] = reactExports.useState(false);
  const debounceRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const abortRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setQuery(value);
  }, [value]);
  const search = reactExports.useCallback(async (q) => {
    var _a;
    if (q.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setNoResults(false);
      return;
    }
    (_a = abortRef.current) == null ? void 0 : _a.abort();
    abortRef.current = new AbortController();
    setIsLoading(true);
    setNoResults(false);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        signal: abortRef.current.signal,
        headers: {
          "Accept-Language": "en",
          "User-Agent": "EveryMoment/1.0"
        }
      });
      const data = await res.json();
      setSuggestions(data);
      setNoResults(data.length === 0);
      setIsOpen(true);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setSuggestions([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val, void 0, void 0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(val);
    }, 350);
  };
  const handleSelect = (result) => {
    const full = result.display_name;
    const name = full.length > 80 ? `${full.slice(0, 77)}…` : full;
    setQuery(name);
    setSuggestions([]);
    setIsOpen(false);
    setNoResults(false);
    onChange(
      name,
      Number.parseFloat(result.lat),
      Number.parseFloat(result.lon)
    );
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSuggestions([]);
    }
  };
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  reactExports.useEffect(() => {
    return () => {
      var _a;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      (_a = abortRef.current) == null ? void 0 : _a.abort();
    };
  }, []);
  const truncate = (s, max = 60) => s.length > max ? `${s.slice(0, max - 1)}…` : s;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "relative", "data-ocid": dataOcid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id,
          value: query,
          onChange: handleInputChange,
          onKeyDown: handleKeyDown,
          onFocus: () => {
            if (suggestions.length > 0) setIsOpen(true);
          },
          placeholder,
          className: "font-body tap-target pl-9 pr-8",
          autoComplete: "off"
        }
      ),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-pulse pointer-events-none" })
    ] }),
    isOpen && (suggestions.length > 0 || noResults) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden", children: noResults ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3 text-sm text-muted-foreground font-body text-center", children: "No results — try a different search" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: suggestions.map((result) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "w-full flex items-start gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-muted transition-colors border-b border-border/50 last:border-b-0 text-left",
        onMouseDown: (e) => {
          e.preventDefault();
          handleSelect(result);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground leading-snug min-w-0", children: truncate(result.display_name) })
        ]
      },
      result.place_id
    )) }) })
  ] });
}
export {
  ImagePlus as I,
  LocationInput as L,
  Tag as T
};
