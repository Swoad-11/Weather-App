/* eslint-disable react/prop-types */
import { useSettings, useWeatherData } from "../context";
import { useTick } from "../hooks";
import { AQI } from "../lib/conditions";
import { beaufort, compassDir, dewPoint, duration, fmtTime, nowSec } from "../lib/format";
import { CloudIcon, DropIcon, EyeIcon, GaugeIcon, LeafIcon, SunIcon, ThermoIcon, WindIcon } from "./Icons";

function Card({ icon: Icon, title, children, className = "" }) {
  return (
    <section className={`glass-card flex flex-col p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.16] ${className}`}>
      <h3 className="card-title">
        <Icon size={15} /> {title}
      </h3>
      <div className="mt-3 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

function WindCard({ c }) {
  const s = useSettings();
  return (
    <Card icon={WindIcon} title="Wind">
      <p className="text-4xl font-semibold tabular-nums">
        {s.speed(c.windSpeed)} <span className="text-base font-normal text-white/70">{s.speedUnit}</span>
      </p>
      <p className="text-sm text-white/80">{beaufort(c.windSpeed)}</p>
      <div className="mt-auto flex items-center gap-3 pt-3">
        <svg viewBox="0 0 120 120" className="h-20 w-20 shrink-0">
          <circle cx="60" cy="60" r="52" fill="rgba(0,0,0,.18)" stroke="rgba(255,255,255,.25)" />
          {Array.from({ length: 36 }, (_, i) => (
            <line
              key={i}
              x1="60" y1="10" x2="60" y2={i % 9 === 0 ? 17 : 13}
              stroke="white" strokeOpacity={i % 9 === 0 ? 0.8 : 0.3}
              transform={`rotate(${i * 10} 60 60)`}
            />
          ))}
          {[["N", 60, 29], ["E", 92, 64], ["S", 60, 97], ["W", 28, 64]].map(([l, x, y]) => (
            <text key={l} x={x} y={y} textAnchor="middle" className="fill-white/70 text-[10px] font-bold">{l}</text>
          ))}
          <g transform={`rotate(${c.windDeg + 180} 60 60)`} className="transition-transform duration-700">
            <path d="M60 22 L67 40 L60 36 L53 40 Z" fill="white" />
            <line x1="60" y1="36" x2="60" y2="94" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="60" cy="96" r="3" fill="none" stroke="white" strokeWidth="2" />
          </g>
        </svg>
        <div className="min-w-0 text-sm text-white/65">
          <p>
            From <span className="font-semibold text-white">{compassDir(c.windDeg)}</span> · {c.windDeg}°
          </p>
          {c.windGust != null && (
            <p className="mt-1">
              Gusts <span className="font-semibold text-white">{s.speed(c.windGust)}</span> {s.speedUnit}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function SunCard({ c }) {
  useTick(60000);
  const now = nowSec();
  const len = c.sunset - c.sunrise;
  const f = Math.min(Math.max((now - c.sunrise) / len, 0), 1);
  const a = Math.PI * (1 - f);
  const x = 100 + 85 * Math.cos(a);
  const y = 95 - 85 * Math.sin(a);
  const up = now >= c.sunrise && now <= c.sunset;
  const status = up
    ? `${duration(c.sunset - now)} of daylight left`
    : now < c.sunrise
    ? `Sunrise in ${duration(c.sunrise - now)}`
    : "The sun has set";

  return (
    <Card icon={SunIcon} title="Sunrise & sunset">
      <svg viewBox="0 0 200 110" className="w-full">
        <defs>
          <linearGradient id="sunGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="1" stopColor="#fb923c" />
          </linearGradient>
        </defs>
        <line x1="5" y1="95" x2="195" y2="95" stroke="white" strokeOpacity=".3" />
        <path d="M15 95 A85 85 0 0 1 185 95" fill="none" stroke="white" strokeOpacity=".3" strokeDasharray="3 5" strokeWidth="2" />
        {f > 0 && (
          <path d={`M15 95 A85 85 0 0 1 ${x} ${y}`} fill="none" stroke="url(#sunGrad)" strokeWidth="3" strokeLinecap="round" />
        )}
        <circle cx={x} cy={y} r="11" fill="#fde047" opacity={up ? 0.3 : 0} className="animate-pulse" />
        <circle cx={x} cy={y} r="6.5" fill={up ? "#fde047" : "#cbd5e1"} />
      </svg>
      <div className="mt-2 flex justify-between text-sm">
        <div>
          <p className="text-white/60">Sunrise</p>
          <p className="text-lg font-semibold">{fmtTime(c.sunrise, c.tz)}</p>
        </div>
        <div className="text-right">
          <p className="text-white/60">Sunset</p>
          <p className="text-lg font-semibold">{fmtTime(c.sunset, c.tz)}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-white/65">
        {status} · {duration(len)} total
      </p>
    </Card>
  );
}

function AirCard({ air }) {
  if (!air) {
    return (
      <Card icon={LeafIcon} title="Air quality">
        <p className="text-sm text-white/60">Air quality data isn&apos;t available for this place.</p>
      </Card>
    );
  }
  const info = AQI[air.aqi];
  const items = [
    ["PM2.5", air.pm2_5],
    ["PM10", air.pm10],
    ["O₃", air.o3],
    ["NO₂", air.no2],
  ];
  return (
    <Card icon={LeafIcon} title="Air quality">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-semibold" style={{ color: info.color }}>{air.aqi}</span>
        <span className="text-lg font-medium">{info.label}</span>
      </div>
      <div className="mt-3 flex gap-1" aria-label={`AQI ${air.aqi} of 5`}>
        {AQI.slice(1).map((q, i) => (
          <span
            key={q.label}
            className="h-2 flex-1 rounded-full transition"
            style={{ background: q.color, opacity: i + 1 === air.aqi ? 1 : 0.25 }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-white/70">{info.tip}</p>
      <dl className="mt-auto grid grid-cols-4 gap-1 pt-3 text-center">
        {items.map(([k, v]) => (
          <div key={k} className="rounded-lg bg-black/20 px-1 py-1.5">
            <dt className="text-[10px] font-semibold text-white/55">{k}</dt>
            <dd className="text-sm font-semibold tabular-nums">{Math.round(v)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-1 text-right text-[10px] text-white/40">µg/m³</p>
    </Card>
  );
}

function HumidityCard({ c }) {
  const s = useSettings();
  const dp = dewPoint(c.temp, c.humidity);
  const feel = dp < 10 ? "Dry and crisp" : dp < 16 ? "Comfortable" : dp < 21 ? "A bit sticky" : "Humid and muggy";
  return (
    <Card icon={DropIcon} title="Humidity">
      <div className="flex flex-1 items-end gap-4">
        <div className="flex-1">
          <p className="text-4xl font-semibold tabular-nums">{c.humidity}%</p>
          <p className="mt-1 text-sm text-white/80">{feel}</p>
          <p className="text-sm text-white/60">Dew point {s.t(dp)}°</p>
        </div>
        <div className="relative h-24 w-7 overflow-hidden rounded-full bg-black/25">
          <div
            className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-sky-500 to-cyan-200 transition-all duration-700"
            style={{ height: `${c.humidity}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

function Tile({ icon, title, value, note }) {
  return (
    <Card icon={icon} title={title}>
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-auto pt-2 text-sm text-white/65">{note}</p>
    </Card>
  );
}

export default function Highlights() {
  const { data } = useWeatherData();
  const s = useSettings();
  const c = data.current;
  const diff = c.feelsLike - c.temp;

  return (
    <>
      <h2 className="mt-2 px-1 text-lg font-semibold lg:col-span-3">Today&apos;s highlights</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4">
        <WindCard c={c} />
        <SunCard c={c} />
        <AirCard air={data.air} />
        <HumidityCard c={c} />
        <Tile
          icon={ThermoIcon}
          title="Feels like"
          value={`${s.t(c.feelsLike)}°`}
          note={
            Math.abs(diff) < 1.5
              ? "Similar to the actual temperature."
              : diff > 0
              ? "Humidity is making it feel warmer."
              : "Wind is making it feel cooler."
          }
        />
        <Tile
          icon={GaugeIcon}
          title="Pressure"
          value={<>{c.pressure} <span className="text-base font-normal text-white/70">hPa</span></>}
          note={c.pressure < 1005 ? "Low pressure: unsettled weather." : c.pressure > 1022 ? "High pressure: settled, clear skies." : "Normal pressure."}
        />
        <Tile
          icon={EyeIcon}
          title="Visibility"
          value={s.distance(c.visibility)}
          note={c.visibility >= 10000 ? "Perfectly clear view." : c.visibility >= 4000 ? "Slight haze." : "Poor visibility. Take care on the road."}
        />
        <Tile
          icon={CloudIcon}
          title="Cloud cover"
          value={`${c.clouds}%`}
          note={c.clouds < 20 ? "Mostly clear skies." : c.clouds < 60 ? "Partly cloudy." : "Mostly overcast."}
        />
      </div>
    </>
  );
}
