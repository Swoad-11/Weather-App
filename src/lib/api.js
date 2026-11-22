const KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = "https://api.openweathermap.org";

async function get(path, params) {
  const url = new URL(path, BASE);
  Object.entries({ ...params, appid: KEY }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  );
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(
      res.status === 404
        ? "We couldn't find that location."
        : res.status === 401
        ? "The weather API key is invalid or not yet active."
        : `Weather service error (${res.status}).`
    );
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const fetchCurrent = (lat, lon) =>
  get("/data/2.5/weather", { lat, lon, units: "metric" });

export const fetchForecast = (lat, lon) =>
  get("/data/2.5/forecast", { lat, lon, units: "metric" });

export const fetchAirQuality = (lat, lon) =>
  get("/data/2.5/air_pollution", { lat, lon });

export const searchCities = (q, limit = 6) =>
  get("/geo/1.0/direct", { q, limit });

export const reverseGeocode = (lat, lon) =>
  get("/geo/1.0/reverse", { lat, lon, limit: 1 });

export const iconUrl = (code, size = 4) =>
  `https://openweathermap.org/img/wn/${code}@${size}x.png`;

/** OpenWeather's night icons are dark grey; lift them so they read on dark glass. */
export const iconClass = (code = "") => (code.endsWith("n") ? "brightness-[2.2] contrast-75" : "");

/** Turn a geocoding result into the location shape the app uses. */
export const toLocation = (g) => ({
  lat: g.lat,
  lon: g.lon,
  name: g.local_names?.en || g.name,
  state: g.state || "",
  country: g.country || "",
});

export const locationId = (loc) =>
  `${Number(loc.lat).toFixed(2)},${Number(loc.lon).toFixed(2)}`;
