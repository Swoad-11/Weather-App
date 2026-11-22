import { useEffect, useRef, useState } from "react";
import useWeather from "./useWeather";
import useLocalStorage from "./useLocalStorage";

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Calls `handler` when a pointer goes down outside `ref`. */
export function useClickOutside(handler) {
  const ref = useRef(null);
  const saved = useRef(handler);
  saved.current = handler;
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) saved.current(e);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return ref;
}

/** Re-renders every `ms` so clocks and "updated x ago" stay live. */
export function useTick(ms = 30000) {
  const [, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((n) => n + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
}

export { useWeather, useLocalStorage };
