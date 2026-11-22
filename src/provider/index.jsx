/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FavoriteContext,
  LocationContext,
  SettingsContext,
  ToastContext,
  WeatherContext,
  useLocation,
  useToast,
} from "../context";
import { useLocalStorage, useWeather } from "../hooks";
import { locationId, reverseGeocode } from "../lib/api";

const DEFAULT_LOCATION = { lat: 23.8103, lon: 90.4125, name: "Dhaka", country: "BD" };

/* ---------------------------------------------------------------- toasts */

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const toast = useCallback((message, tone = "info") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-slide-up rounded-full border px-5 py-2.5 text-sm font-medium shadow-2xl backdrop-blur-xl ${
              t.tone === "error"
                ? "border-red-300/30 bg-red-500/80"
                : "border-white/20 bg-slate-900/80"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* -------------------------------------------------------------- location */

export function LocationProvider({ children }) {
  const toast = useToast();
  const [location, setLocation] = useLocalStorage("wa:location", null);
  const [locating, setLocating] = useState(false);

  const locate = useCallback(() => {
    const fallback = () => setLocation((l) => l ?? DEFAULT_LOCATION);
    if (!navigator.geolocation) {
      toast("Location isn't supported in this browser.", "error");
      return fallback();
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        let place = {};
        try {
          const [r] = await reverseGeocode(lat, lon);
          if (r) place = { name: r.local_names?.en || r.name, state: r.state, country: r.country };
        } catch {
          /* name will come from the weather response */
        }
        setLocation({ lat, lon, ...place, isCurrent: true });
        setLocating(false);
      },
      () => {
        setLocating(false);
        toast("Couldn't get your location. Showing a default city.", "error");
        fallback();
      },
      { timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, [setLocation, toast]);

  // First visit: try the device location (once, even under StrictMode).
  const tried = useRef(false);
  useEffect(() => {
    if (tried.current) return;
    tried.current = true;
    if (!location) locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ location, setLocation, locate, locating }),
    [location, setLocation, locate, locating]
  );
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

/* --------------------------------------------------------------- weather */

export function WeatherProvider({ children }) {
  const { location } = useLocation();
  const toast = useToast();
  const weather = useWeather(location);

  useEffect(() => {
    if (weather.error && weather.data) toast(weather.error.message, "error");
  }, [weather.error, weather.data, toast]);

  return <WeatherContext.Provider value={weather}>{children}</WeatherContext.Provider>;
}

/* ------------------------------------------------------------- favorites */

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage("wa:favorites", []);

  const value = useMemo(() => {
    const isFavorite = (loc) => !!loc && favorites.some((f) => f.id === locationId(loc));
    const removeFavorite = (id) => setFavorites((fs) => fs.filter((f) => f.id !== id));
    const toggleFavorite = (loc) => {
      const id = locationId(loc);
      if (favorites.some((f) => f.id === id)) {
        removeFavorite(id);
        return false;
      }
      const { lat, lon, name, state, country } = loc;
      setFavorites((fs) => [...fs, { id, lat, lon, name, state, country }]);
      return true;
    };
    return { favorites, isFavorite, toggleFavorite, removeFavorite };
  }, [favorites, setFavorites]);

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

/* -------------------------------------------------------------- settings */

export function SettingsProvider({ children }) {
  const [unit, setUnit] = useLocalStorage("wa:unit", "metric");

  const value = useMemo(() => {
    const imperial = unit === "imperial";
    return {
      unit,
      setUnit,
      /** °C in → number in the chosen unit */
      t: (c) => Math.round(imperial ? (c * 9) / 5 + 32 : c),
      tempUnit: imperial ? "°F" : "°C",
      /** m/s in → formatted speed */
      speed: (ms) => (imperial ? Math.round(ms * 2.237) : Math.round(ms * 3.6)),
      speedUnit: imperial ? "mph" : "km/h",
      distance: (m) =>
        imperial ? `${(m / 1609).toFixed(1)} mi` : `${(m / 1000).toFixed(m < 10000 ? 1 : 0)} km`,
    };
  }, [unit, setUnit]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
