import { useEffect, useRef, useState } from "react";
import { useLocation } from "../context";
import { useClickOutside, useDebouncedValue, useLocalStorage } from "../hooks";
import { locationId, searchCities, toLocation } from "../lib/api";
import { HistoryIcon, PinIcon, SearchIcon, XIcon } from "./Icons";

const subtitle = (l) => [l.state, l.country].filter(Boolean).join(", ");

export default function Search() {
  const { setLocation } = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useLocalStorage("wa:recent", []);
  const inputRef = useRef(null);
  const boxRef = useClickOutside(() => setOpen(false));

  const term = useDebouncedValue(query.trim(), 300);
  const showingRecent = query.trim().length < 2;
  const items = showingRecent ? recent : results;

  useEffect(() => {
    if (term.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setBusy(true);
    searchCities(term)
      .then((r) => {
        if (cancelled) return;
        // The geocoder can return the same city twice (e.g. different admin levels).
        const seen = new Set();
        setResults(
          r.map(toLocation).filter((l) => {
            const k = `${l.name}|${l.country}|${l.state}`;
            return seen.has(k) ? false : seen.add(k);
          })
        );
        setActive(0);
      })
      .catch(() => !cancelled && setResults([]))
      .finally(() => !cancelled && setBusy(false));
    return () => {
      cancelled = true;
    };
  }, [term]);

  // Press "/" anywhere to jump to search.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function choose(loc) {
    setLocation(loc);
    setRecent((r) => [loc, ...r.filter((x) => locationId(x) !== locationId(loc))].slice(0, 5));
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[active]) choose(items[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showPanel = open && (items.length > 0 || (!showingRecent && !busy && term.length >= 2));

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5 transition focus-within:bg-white/20 focus-within:ring-2 focus-within:ring-white/40">
        <SearchIcon size={18} className={`shrink-0 opacity-70 ${busy ? "animate-pulse" : ""}`} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-sm outline-none focus-visible:ring-0 placeholder:text-white/60 sm:text-base"
          placeholder="Search for a city…"
          aria-label="Search for a city"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="search-results"
          autoComplete="off"
        />
        {query ? (
          <button onClick={() => setQuery("")} className="rounded-full p-1 opacity-70 hover:bg-white/15 hover:opacity-100" aria-label="Clear search">
            <XIcon size={16} />
          </button>
        ) : (
          <kbd className="hidden rounded-md border border-white/25 px-1.5 text-xs opacity-60 sm:block">/</kbd>
        )}
      </div>

      {showPanel && (
        <div
          id="search-results"
          role="listbox"
          className="panel animate-pop absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl p-1.5"
        >
          {showingRecent && (
            <div className="flex items-center justify-between px-3 pb-1 pt-2 text-xs uppercase tracking-wider text-white/50">
              <span>Recent searches</span>
              <button className="normal-case tracking-normal hover:text-white" onClick={() => setRecent([])}>
                Clear
              </button>
            </div>
          )}
          {items.length === 0 && (
            <p className="px-3 py-4 text-sm text-white/60">No places match “{term}”.</p>
          )}
          {items.map((loc, i) => (
            <button
              key={locationId(loc) + i}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(loc)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                i === active ? "bg-white/15" : ""
              }`}
            >
              {showingRecent ? (
                <HistoryIcon size={16} className="shrink-0 opacity-60" />
              ) : (
                <PinIcon size={16} className="shrink-0 opacity-60" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{loc.name}</span>
                <span className="block truncate text-xs text-white/55">{subtitle(loc)}</span>
              </span>
              {loc.country && (
                <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide">
                  {loc.country}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
