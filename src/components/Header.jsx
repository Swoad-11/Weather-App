/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useFavorites, useLocation, useSettings } from "../context";
import { useClickOutside } from "../hooks";
import { fetchCurrent, iconClass, iconUrl, locationId } from "../lib/api";
import Search from "./Search";
import { HeartIcon, LocateIcon, XIcon } from "./Icons";

function UnitToggle() {
  const { unit, setUnit } = useSettings();
  return (
    <div className="glass flex rounded-2xl p-1 text-sm font-semibold" role="group" aria-label="Temperature unit">
      {[
        ["metric", "°C"],
        ["imperial", "°F"],
      ].map(([value, label]) => (
        <button
          key={value}
          onClick={() => setUnit(value)}
          aria-pressed={unit === value}
          className={`rounded-xl px-3 py-1.5 transition ${
            unit === value ? "bg-white text-slate-900 shadow" : "text-white/75 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function FavoriteRow({ fav, onPick, onRemove, active }) {
  const { t } = useSettings();
  const [w, setW] = useState(null);
  useEffect(() => {
    let c = false;
    fetchCurrent(fav.lat, fav.lon).then((d) => !c && setW(d)).catch(() => {});
    return () => {
      c = true;
    };
  }, [fav.lat, fav.lon]);

  return (
    <li
      className={`group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/10 ${
        active ? "bg-white/10" : ""
      }`}
    >
      <button onClick={onPick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        {w ? (
          <img src={iconUrl(w.weather[0].icon, 2)} alt="" className={`h-10 w-10 shrink-0 ${iconClass(w.weather[0].icon)}`} />
        ) : (
          <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{fav.name}</span>
          <span className="block truncate text-xs capitalize text-white/55">
            {w ? w.weather[0].description : fav.country}
          </span>
        </span>
        <span className="text-lg font-semibold tabular-nums">{w ? `${t(w.main.temp)}°` : "–"}</span>
      </button>
      <button
        onClick={onRemove}
        className="rounded-full p-1.5 text-white/50 opacity-0 transition hover:bg-white/15 hover:text-white focus:opacity-100 group-hover:opacity-100"
        aria-label={`Remove ${fav.name} from favourites`}
      >
        <XIcon size={14} />
      </button>
    </li>
  );
}

function FavoritesMenu() {
  const { favorites, removeFavorite } = useFavorites();
  const { location, setLocation } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass relative flex h-11 items-center gap-2 rounded-2xl px-3.5 transition hover:bg-white/20"
        aria-expanded={open}
        aria-label="Favourite locations"
      >
        <HeartIcon size={18} filled={favorites.length > 0} className={favorites.length ? "text-rose-400" : ""} />
        <span className="hidden text-sm font-medium md:inline">Favourites</span>
        {favorites.length > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold">
            {favorites.length}
          </span>
        )}
      </button>
      {open && (
        <div className="panel animate-pop absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl p-2">
          <h3 className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-white/50">
            Favourite locations
          </h3>
          {favorites.length === 0 ? (
            <div className="px-2 pb-3 text-sm text-white/65">
              Nothing saved yet. Tap the <HeartIcon size={13} className="inline -mt-0.5" /> on a city to keep it here
              with its live temperature.
            </div>
          ) : (
            <ul className="max-h-80 space-y-0.5 overflow-y-auto">
              {favorites.map((f) => (
                <FavoriteRow
                  key={f.id}
                  fav={f}
                  active={location && locationId(location) === f.id}
                  onPick={() => {
                    setLocation(f);
                    setOpen(false);
                  }}
                  onRemove={() => removeFavorite(f.id)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { locate, locating } = useLocation();
  return (
    <header className="sticky top-0 z-40 mb-4 border-b border-white/10 bg-slate-900/30 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 sm:flex-nowrap sm:px-6">
        <a href="./" className="mr-auto shrink-0 sm:mr-2" aria-label="Weather home">
          <img className="h-8 sm:h-9" src={logo} alt="Weather App" />
        </a>
        <div className="order-last w-full sm:order-none sm:max-w-md sm:flex-1">
          <Search />
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            onClick={locate}
            disabled={locating}
            className="glass grid h-11 w-11 place-items-center rounded-2xl transition hover:bg-white/20 disabled:opacity-60"
            title="Use my location"
            aria-label="Use my location"
          >
            <LocateIcon size={18} className={locating ? "animate-spin" : ""} />
          </button>
          <UnitToggle />
          <FavoritesMenu />
        </div>
      </div>
    </header>
  );
}
