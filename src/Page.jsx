import { useEffect, useState } from "react";
import { useLocation, useSettings, useWeatherData } from "./context";
import { getCondition } from "./lib/conditions";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import { DailyForecast, HourlyForecast } from "./components/Forecast";
import { Background, WeatherFX } from "./components/Ambience";
import { ErrorState, Skeleton } from "./components/States";

function Dashboard() {
  const { data, loading } = useWeatherData();
  const [selectedDay, setSelectedDay] = useState(data.daily[0]?.key);

  // Reset the selected day when switching city (or when the date rolls over).
  const firstDay = data.daily[0]?.key;
  useEffect(() => {
    setSelectedDay(firstDay);
  }, [data.location.lat, data.location.lon, firstDay]);

  return (
    <div
      key={`${data.location.lat},${data.location.lon}`}
      className={`animate-rise grid grid-cols-1 gap-4 transition-opacity lg:grid-cols-3 ${loading ? "opacity-70" : ""}`}
    >
      <Hero />
      <DailyForecast selected={selectedDay} onSelect={setSelectedDay} />
      <HourlyForecast selected={selectedDay} onSelect={setSelectedDay} />
      <Highlights />
    </div>
  );
}

export default function Page() {
  const { data, loading, error, refresh } = useWeatherData();
  const { location, locating } = useLocation();
  const { t } = useSettings();
  const cond = data ? getCondition(data.current.id, data.current.isDay) : null;

  useEffect(() => {
    if (data) document.title = `${t(data.current.temp)}° ${data.location.name} · Weather`;
  }, [data, t]);

  return (
    <div className="relative min-h-screen text-white">
      <Background image={cond?.bg} isDay={data?.current.isDay ?? true} />
      {cond && <WeatherFX type={cond.fx} />}

      {loading && data && <div className="loading-bar fixed inset-x-0 top-0 z-50 h-0.5" />}

      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {data ? (
          <Dashboard />
        ) : error ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : (
          <Skeleton message={locating || !location ? "Finding your location…" : "Loading the forecast…"} />
        )}
      </main>
      <footer className="pb-8 text-center text-xs text-white/45">
        Data from OpenWeather · Press <kbd className="rounded border border-white/25 px-1">/</kbd> to search
      </footer>
    </div>
  );
}
