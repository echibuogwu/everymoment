import { MapPin, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationInputProps {
  value: string;
  lat?: number;
  lng?: number;
  onChange: (
    name: string,
    lat: number | undefined,
    lng: number | undefined,
  ) => void;
  id?: string;
  placeholder?: string;
  "data-ocid"?: string;
}

export function LocationInput({
  value,
  onChange,
  id,
  placeholder = "e.g. Central Park, New York",
  "data-ocid": dataOcid,
}: LocationInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Sync external value into local query when it changes externally (e.g. pre-fill)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setNoResults(false);
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setNoResults(false);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        signal: abortRef.current.signal,
        headers: {
          "Accept-Language": "en",
          "User-Agent": "EveryMoment/1.0",
        },
      });
      const data: NominatimResult[] = await res.json();
      setSuggestions(data);
      setNoResults(data.length === 0);
      setIsOpen(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setSuggestions([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    // Notify parent that the free-text changed (clear lat/lng since user is typing)
    onChange(val, undefined, undefined);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(val);
    }, 350);
  };

  const handleSelect = (result: NominatimResult) => {
    const full = result.display_name;
    const name = full.length > 80 ? `${full.slice(0, 77)}…` : full;
    setQuery(name);
    setSuggestions([]);
    setIsOpen(false);
    setNoResults(false);
    onChange(
      name,
      Number.parseFloat(result.lat),
      Number.parseFloat(result.lon),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSuggestions([]);
    }
  };

  // Dismiss on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const truncate = (s: string, max = 60) =>
    s.length > max ? `${s.slice(0, max - 1)}…` : s;

  return (
    <div ref={containerRef} className="relative" data-ocid={dataOcid}>
      <div className="relative">
        {/* Map pin icon */}
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none z-10" />
        <input
          id={id}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="
            w-full h-12 pl-10 pr-10 rounded-xl font-body text-sm
            glass-input
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-accent/40
            transition-all duration-200
          "
          autoComplete="off"
        />
        {isLoading && (
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-pulse pointer-events-none" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || noResults) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 right-0 mt-2 z-[200] glass-modal rounded-2xl overflow-hidden"
          >
            {noResults ? (
              <div className="px-4 py-4 text-sm text-muted-foreground font-body text-center">
                No locations found — try a different search
              </div>
            ) : (
              <div className="py-1">
                {suggestions.map((result, index) => (
                  <motion.button
                    key={result.place_id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.15 }}
                    type="button"
                    className="
                      w-full flex items-start gap-3 px-4 py-3 cursor-pointer text-left
                      hover:bg-accent/10 transition-colors duration-150
                      border-b border-white/10 last:border-b-0
                    "
                    onMouseDown={(e) => {
                      // mousedown prevents input blur before click fires
                      e.preventDefault();
                      handleSelect(result);
                    }}
                  >
                    <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-body font-medium text-foreground leading-snug truncate">
                        {result.display_name.split(",")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground font-body leading-snug mt-0.5 truncate">
                        {truncate(
                          result.display_name
                            .split(",")
                            .slice(1)
                            .join(",")
                            .trim(),
                          55,
                        )}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
