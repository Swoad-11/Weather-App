/**
 * OpenWeather gives timestamps in UTC seconds plus the city's UTC offset in
 * seconds. Shifting by the offset and formatting in UTC gives the city's
 * local wall-clock time, whatever the viewer's own timezone is.
 */
export const shifted = (dt, tz = 0) => new Date((dt + tz) * 1000);

export function fmt(dt, tz, options) {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(
    shifted(dt, tz)
  );
}

export const fmtTime = (dt, tz) => fmt(dt, tz, { hour: "numeric", minute: "2-digit" });
export const fmtHour = (dt, tz) => fmt(dt, tz, { hour: "numeric" });
export const fmtWeekday = (dt, tz) => fmt(dt, tz, { weekday: "short" });
export const fmtLongDate = (dt, tz) =>
  fmt(dt, tz, { weekday: "long", month: "long", day: "numeric" });
export const dayKey = (dt, tz) => shifted(dt, tz).toISOString().slice(0, 10);
export const localHour = (dt, tz) => shifted(dt, tz).getUTCHours();

export const nowSec = () => Math.floor(Date.now() / 1000);

export function duration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function timeAgo(ms) {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  return `${Math.round(m / 60)} h ago`;
}

const DIRS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
export const compassDir = (deg = 0) => DIRS[Math.round(deg / 22.5) % 16];

const BEAUFORT = [
  [0.5, "Calm"], [1.6, "Light air"], [3.4, "Light breeze"], [5.5, "Gentle breeze"],
  [8, "Moderate breeze"], [10.8, "Fresh breeze"], [13.9, "Strong breeze"],
  [17.2, "Near gale"], [20.8, "Gale"], [24.5, "Strong gale"], [28.5, "Storm"],
  [32.7, "Violent storm"], [Infinity, "Hurricane force"],
];
export const beaufort = (ms) => BEAUFORT.find(([max]) => ms < max)[1];

/** Dew point in °C (Magnus formula). */
export function dewPoint(t, rh) {
  const a = 17.62, b = 243.12;
  const g = Math.log(rh / 100) + (a * t) / (b + t);
  return (b * g) / (a - g);
}

/** Smooth colour scale for temperatures in °C: icy blue → teal → yellow → red. */
export function tempColor(c) {
  const stops = [
    [-10, [129, 140, 248]], [0, [96, 165, 250]], [10, [45, 212, 191]],
    [20, [250, 204, 21]], [28, [251, 146, 60]], [36, [239, 68, 68]],
  ];
  if (c <= stops[0][0]) return `rgb(${stops[0][1]})`;
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i];
    const [t0, c0] = stops[i - 1];
    if (c <= t1) {
      const f = (c - t0) / (t1 - t0);
      return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * f))})`;
    }
  }
  return `rgb(${stops.at(-1)[1]})`;
}

export const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
