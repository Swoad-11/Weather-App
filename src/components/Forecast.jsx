/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import { useSettings, useWeatherData } from "../context";
import { iconClass, iconUrl } from "../lib/api";
import { fmtHour, fmtWeekday, tempColor } from "../lib/format";
import { CalendarIcon, ClockIcon, DropIcon } from "./Icons";

/* ------------------------------------------------------------ daily list */

export function DailyForecast({ selected, onSelect }) {
  const { data } = useWeatherData();
  const s = useSettings();
  const { daily, current, } = data;
  const wMin = Math.min(...daily.map((d) => d.min));
  const wMax = Math.max(...daily.map((d) => d.max));
  const span = wMax - wMin || 1;

  return (
    <section className="glass-card p-5 sm:p-6">
      <h2 className="card-title">
        <CalendarIcon size={15} /> {daily.length}-day forecast
      </h2>
      <ul className="mt-3 divide-y divide-white/10">
        {daily.map((d) => {
          const left = ((d.min - wMin) / span) * 100;
          const width = Math.max(((d.max - d.min) / span) * 100, 4);
          const isSel = selected === d.key;
          return (
            <li key={d.key}>
              <button
                onClick={() => onSelect(d.key)}
                aria-pressed={isSel}
                className={`-mx-2 grid w-[calc(100%+1rem)] grid-cols-[3.2rem_2.5rem_2.6rem_1fr] items-center gap-2 rounded-xl px-2 py-2 text-left transition hover:bg-white/10 ${
                  isSel ? "bg-white/15 ring-1 ring-white/25" : ""
                }`}
              >
                <span className="font-semibold">{d.isToday ? "Today" : fmtWeekday(d.dt, current.tz)}</span>
                <img src={iconUrl(d.icon, 2)} alt={d.description} title={d.description} className="h-10 w-10" />
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${d.pop >= 20 ? "text-sky-300" : "text-transparent"}`}>
                  <DropIcon size={11} />
                  {d.pop}%
                </span>
                <span className="flex items-center gap-2 text-sm tabular-nums">
                  <span className="w-8 text-right text-white/60">{s.t(d.min)}°</span>
                  <span className="relative h-1.5 flex-1 rounded-full bg-black/25">
                    <span
                      className="absolute inset-y-0 rounded-full"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${tempColor(d.min)}, ${tempColor(d.max)})`,
                      }}
                    />
                    {d.isToday && (
                      <span
                        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-900/60 bg-white"
                        style={{ left: `${((current.temp - wMin) / span) * 100}%` }}
                        title="Now"
                      />
                    )}
                  </span>
                  <span className="w-8 font-semibold">{s.t(d.max)}°</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------------------------------------------------- hourly chart */

const COL = 68;
const CH = 120; // chart height
const TOP = 30; // space for value labels

function smoothPath(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${
      p2[1] - (p3[1] - p1[1]) / 6
    } ${p2[0]},${p2[1]}`;
  }
  return d;
}

const METRICS = {
  temp: { label: "Temperature" },
  pop: { label: "Rain chance" },
  wind: { label: "Wind" },
};

export function HourlyForecast({ selected, onSelect }) {
  const { data } = useWeatherData();
  const s = useSettings();
  const [metric, setMetric] = useState("temp");
  const [hover, setHover] = useState(null);
  const scroller = useRef(null);
  const { hourly, current } = data;
  const tz = current.tz;
  const width = hourly.length * COL;

  const values = useMemo(
    () =>
      hourly.map((h) => (metric === "temp" ? s.t(h.temp) : metric === "pop" ? h.pop : s.speed(h.wind))),
    [hourly, metric, s]
  );
  const min = metric === "pop" ? 0 : Math.min(...values);
  const max = metric === "pop" ? 100 : Math.max(...values);
  const y = (v) => TOP + (1 - (v - min) / (max - min || 1)) * (CH - TOP - 10);
  const pts = values.map((v, i) => [i * COL + COL / 2, y(v)]);
  const line = smoothPath(pts);
  const area = `${line} L${pts.at(-1)[0]},${CH} L${pts[0][0]},${CH} Z`;
  const unit = metric === "temp" ? "°" : metric === "pop" ? "%" : "";

  // Scroll the selected day into view.
  useEffect(() => {
    const idx = hourly.findIndex((h) => h.day === selected);
    if (idx >= 0 && scroller.current) {
      scroller.current.scrollTo({ left: Math.max(idx * COL - 8, 0), behavior: "smooth" });
    }
  }, [selected, hourly]);

  const nudge = (dir) => scroller.current?.scrollBy({ left: dir * COL * 4, behavior: "smooth" });

  return (
    <section className="glass-card p-5 sm:p-6 lg:col-span-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="card-title">
          <ClockIcon size={15} /> Hourly forecast <span className="font-normal normal-case tracking-normal text-white/45">· every 3 hours</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-black/20 p-1 text-xs font-semibold" role="tablist">
            {Object.entries(METRICS).map(([k, m]) => (
              <button
                key={k}
                role="tab"
                aria-selected={metric === k}
                onClick={() => setMetric(k)}
                className={`rounded-lg px-3 py-1.5 transition ${metric === k ? "bg-white text-slate-900" : "text-white/70 hover:text-white"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="hidden gap-1 sm:flex">
            {[-1, 1].map((d) => (
              <button
                key={d}
                onClick={() => nudge(d)}
                aria-label={d < 0 ? "Scroll back" : "Scroll forward"}
                className="grid h-8 w-8 place-items-center rounded-lg bg-black/20 transition hover:bg-white/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d={d < 0 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={scroller} className="no-scrollbar -mx-5 mt-4 overflow-x-auto px-5 sm:-mx-6 sm:px-6" onMouseLeave={() => setHover(null)}>
        <div className="relative" style={{ width }}>
          {/* day bands + click targets */}
          <div className="absolute inset-0 flex">
            {hourly.map((h, i) => (
              <button
                key={h.dt}
                onMouseEnter={() => setHover(i)}
                onClick={() => onSelect(h.day)}
                aria-label={`${fmtWeekday(h.dt, tz)} ${fmtHour(h.dt, tz)}: ${s.t(h.temp)}°, ${h.description}`}
                className={`h-full shrink-0 transition ${h.day === selected ? "bg-white/[0.07]" : ""} ${
                  hover === i ? "!bg-white/15" : ""
                } ${i > 0 && hourly[i - 1].day !== h.day ? "border-l border-dashed border-white/25" : ""}`}
                style={{ width: COL }}
              />
            ))}
          </div>

          <svg width={width} height={CH} className="pointer-events-none relative block overflow-visible">
            <defs>
              <linearGradient id="lineGrad" x1="0" x2={width} gradientUnits="userSpaceOnUse">
                {hourly.map((h, i) => (
                  <stop
                    key={h.dt}
                    offset={(i + 0.5) / hourly.length}
                    stopColor={metric === "temp" ? tempColor(h.temp) : metric === "wind" ? "#a5f3fc" : "#7dd3fc"}
                  />
                ))}
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="white" stopOpacity="0.28" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>

            {metric === "pop" ? (
              values.map((v, i) => (
                <rect
                  key={i}
                  x={i * COL + COL / 2 - 12}
                  y={y(v)}
                  width={24}
                  height={Math.max(CH - y(v), 2)}
                  rx={6}
                  fill="#7dd3fc"
                  fillOpacity={0.25 + (v / 100) * 0.65}
                />
              ))
            ) : (
              <>
                <path d={area} fill="url(#areaGrad)" />
                <path d={line} fill="none" stroke="url(#lineGrad)" strokeWidth={3} strokeLinecap="round" />
                {pts.map(([x, py], i) => (
                  <circle key={i} cx={x} cy={py} r={hover === i ? 5 : 3} fill="white" className="transition-all" />
                ))}
              </>
            )}
            {pts.map(([x], i) => (
              <text
                key={i}
                x={x}
                y={y(values[i]) - 10}
                textAnchor="middle"
                className={`fill-white text-[13px] font-semibold tabular-nums ${hover === i ? "" : "opacity-90"}`}
              >
                {values[i]}
                {unit}
              </text>
            ))}
          </svg>

          <div className="pointer-events-none relative flex">
            {hourly.map((h, i) => {
              const newDay = i === 0 || hourly[i - 1].day !== h.day;
              return (
                <div key={h.dt} className="flex shrink-0 flex-col items-center pb-1 pt-1" style={{ width: COL }}>
                  <img src={iconUrl(h.icon, 2)} alt="" className={`h-11 w-11 ${iconClass(h.icon)}`} />
                  <span className="text-xs font-medium text-white/80">{i === 0 ? "Now" : fmtHour(h.dt, tz)}</span>
                  <span className={`mt-0.5 text-[11px] font-semibold uppercase tracking-wide ${newDay ? "text-white/70" : "text-transparent"}`}>
                    {newDay ? fmtWeekday(h.dt, tz) : "·"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
