/* eslint-disable react/prop-types */
import { useFavorites, useSettings, useToast, useWeatherData } from "../context";
import { useTick } from "../hooks";
import { iconClass, iconUrl } from "../lib/api";
import { beaufort, capitalize, fmtLongDate, fmtTime, nowSec, timeAgo } from "../lib/format";
import { HeartIcon, PinIcon, RefreshIcon, ShareIcon } from "./Icons";

function summary(cur, next, s) {
  const parts = [];
  const diff = Math.round(cur.feelsLike - cur.temp);
  if (Math.abs(diff) >= 2) {
    parts.push(`Feels ${diff > 0 ? "warmer" : "cooler"} than it is, around ${s.t(cur.feelsLike)}°.`);
  }
  parts.push(`${beaufort(cur.windSpeed)} from the ${compass(cur.windDeg)}.`);
  const rainy = next.find((h) => h.pop >= 40);
  if (rainy) parts.push(`${rainy.pop}% chance of rain in the next few hours.`);
  else parts.push("No rain expected in the next 12 hours.");
  return parts.join(" ");
}
const compass = (deg) => ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"][Math.round(deg / 45) % 8];

const IconBtn = ({ label, onClick, children, active }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:scale-105 hover:bg-white/20 active:scale-95 ${
      active ? "bg-white/20" : "bg-white/10"
    }`}
  >
    {children}
  </button>
);

export default function Hero() {
  useTick(15000);
  const { data, refresh, loading, updatedAt } = useWeatherData();
  const { isFavorite, toggleFavorite } = useFavorites();
  const s = useSettings();
  const toast = useToast();
  const { current: c, location: loc, hourly } = data;
  const fav = isFavorite(loc);

  async function share() {
    const text = `${loc.name}: ${s.t(c.temp)}${s.tempUnit}, ${c.description}. High ${s.t(c.max)}° / low ${s.t(c.min)}°.`;
    try {
      if (navigator.share) await navigator.share({ title: `Weather in ${loc.name}`, text });
      else {
        await navigator.clipboard.writeText(text);
        toast("Weather summary copied to clipboard");
      }
    } catch {
      /* share sheet dismissed */
    }
  }

  return (
    <section className="glass-card relative overflow-hidden p-6 sm:p-8 lg:col-span-2">
      <div className="flex flex-wrap-reverse items-start justify-between gap-3">
        <div className="min-w-[13rem] flex-1">
          <div className="flex items-center gap-2">
            <PinIcon size={18} className="shrink-0" />
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{loc.name}</h1>
            {loc.country && (
              <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-xs font-semibold">{loc.country}</span>
            )}
          </div>
          <p className="mt-1 text-sm text-white/70">
            {fmtLongDate(nowSec(), c.tz)} · <span className="tabular-nums">{fmtTime(nowSec(), c.tz)}</span> local time
            {loc.isCurrent && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs text-emerald-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> You are here
              </span>
            )}
          </p>
        </div>
        <div className="ml-auto flex shrink-0 gap-2">
          <IconBtn
            label={fav ? "Remove from favourites" : "Add to favourites"}
            active={fav}
            onClick={() => {
              const added = toggleFavorite(loc);
              toast(added ? `${loc.name} added to favourites` : `${loc.name} removed from favourites`);
            }}
          >
            <HeartIcon size={18} filled={fav} className={`transition ${fav ? "animate-heart text-rose-400" : ""}`} />
          </IconBtn>
          <IconBtn label="Share" onClick={share}>
            <ShareIcon size={17} />
          </IconBtn>
          <IconBtn label="Refresh" onClick={refresh}>
            <RefreshIcon size={17} className={loading ? "animate-spin" : ""} />
          </IconBtn>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6">
        <img
          src={iconUrl(c.icon)}
          alt={c.description}
          className={`animate-float ${iconClass(c.icon)} -my-6 -ml-4 h-36 w-36 drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:h-44 sm:w-44`}
        />
        <div>
          <div className="flex items-start">
            <span className="text-8xl font-extralight leading-none tracking-tighter tabular-nums sm:text-9xl">
              {s.t(c.temp)}
            </span>
            <span className="mt-3 text-3xl font-light text-white/80">{s.tempUnit}</span>
          </div>
          <p className="mt-2 text-xl font-medium">{capitalize(c.description)}</p>
          <p className="mt-1 text-sm text-white/75">
            H: {s.t(c.max)}° · L: {s.t(c.min)}° · Feels like {s.t(c.feelsLike)}°
          </p>
        </div>
      </div>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/85 sm:text-[15px]">
        {summary(c, hourly.slice(0, 4), s)}
      </p>
      {updatedAt && <p className="mt-3 text-xs text-white/50">Updated {timeAgo(updatedAt)}</p>}
    </section>
  );
}
