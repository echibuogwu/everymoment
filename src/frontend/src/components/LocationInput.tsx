import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
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
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="font-body tap-target pl-9 pr-8"
          autoComplete="off"
        />
        {isLoading && (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-pulse pointer-events-none" />
        )}
      </div>

      {isOpen && (suggestions.length > 0 || noResults) && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {noResults ? (
            <div className="px-3 py-3 text-sm text-muted-foreground font-body text-center">
              No results — try a different search
            </div>
          ) : (
            <div>
              {suggestions.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  className="w-full flex items-start gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-muted transition-colors border-b border-border/50 last:border-b-0 text-left"
                  onMouseDown={(e) => {
                    // mousedown prevents input blur before click fires
                    e.preventDefault();
                    handleSelect(result);
                  }}
                >
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-body text-foreground leading-snug min-w-0">
                    {truncate(result.display_name)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
