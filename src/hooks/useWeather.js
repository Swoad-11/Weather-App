import { useCallback, useEffect, useState } from "react";
import { fetchAirQuality, fetchCurrent, fetchForecast } from "../lib/api";
import { dayKey, localHour } from "../lib/format";

const REFRESH_MS = 10 * 60 * 1000;

function normalize(location, cur, fc, air) {
  const tz = cur.timezone;
  const current = {
    id: cur.weather[0].id,
    main: cur.weather[0].main,
    description: cur.weather[0].description,
    icon: cur.weather[0].icon,
    isDay: cur.weather[0].icon.endsWith("d"),
    temp: cur.main.temp,
    feelsLike: cur.main.feels_like,
    min: cur.main.temp_min,
    max: cur.main.temp_max,
    humidity: cur.main.humidity,
    pressure: cur.main.pressure,
    visibility: cur.visibility ?? 10000,
    clouds: cur.clouds?.all ?? 0,
    windSpeed: cur.wind?.speed ?? 0,
    windDeg: cur.wind?.deg ?? 0,
    windGust: cur.wind?.gust,
    rain: cur.rain?.["1h"] ?? 0,
    sunrise: cur.sys.sunrise,
    sunset: cur.sys.sunset,
    dt: cur.dt,
    tz,
  };

  const hourly = fc.list.map((h) => ({
    dt: h.dt,
    day: dayKey(h.dt, tz),
    temp: h.main.temp,
    feelsLike: h.main.feels_like,
    humidity: h.main.humidity,
    id: h.weather[0].id,
    icon: h.weather[0].icon,
    description: h.weather[0].description,
    pop: Math.round((h.pop ?? 0) * 100),
    wind: h.wind?.speed ?? 0,
    rain: h.rain?.["3h"] ?? 0,
  }));

  const byDay = new Map();
  for (const h of hourly) {
    if (!byDay.has(h.day)) byDay.set(h.day, []);
    byDay.get(h.day).push(h);
  }
  const today = dayKey(cur.dt, tz);
  const daily = [...byDay.entries()].map(([key, items]) => {
    const temps = items.map((i) => i.temp);
    if (key === today) temps.push(current.min, current.max, current.temp);
    // Represent the day by the slot nearest midday.
    const rep = items.reduce((best, i) =>
      Math.abs(localHour(i.dt, tz) - 13) < Math.abs(localHour(best.dt, tz) - 13) ? i : best
    );
    return {
      key,
      dt: items[0].dt,
      isToday: key === today,
      min: Math.min(...temps),
      max: Math.max(...temps),
      icon: rep.icon.replace("n", "d"),
      description: rep.description,
      pop: Math.max(...items.map((i) => i.pop)),
    };
  });

  return {
    location: {
      ...location,
      name: location.name || cur.name,
      country: location.country || cur.sys.country,
    },
    current,
    hourly,
    daily: daily.slice(0, 6),
    air: air?.list?.[0]
      ? { aqi: air.list[0].main.aqi, ...air.list[0].components }
      : null,
  };
}

export default function useWeather(location) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    const { lat, lon } = location;
    setLoading(true);
    setError(null);
    Promise.all([
      fetchCurrent(lat, lon),
      fetchForecast(lat, lon),
      fetchAirQuality(lat, lon).catch(() => null),
    ])
      .then(([cur, fc, air]) => {
        if (cancelled) return;
        setData(normalize(location, cur, fc, air));
        setUpdatedAt(Date.now());
      })
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.lat, location?.lon, nonce]);

  // Keep the data fresh while the tab stays open.
  useEffect(() => {
    const t = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(t);
  }, [refresh, location?.lat, location?.lon]);

  return { data, loading, error, updatedAt, refresh };
}
