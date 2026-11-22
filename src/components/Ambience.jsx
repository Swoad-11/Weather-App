/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";

const rand = (min, max) => min + Math.random() * (max - min);

/** Cross-fading background photo with a readability overlay. */
export function Background({ image, isDay }) {
  const [layers, setLayers] = useState(image ? [image] : []);

  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.onload = () => setLayers((l) => (l.at(-1) === image ? l : [...l.slice(-1), image]));
    img.src = image;
  }, [image]);

  return (
    <div className="fixed inset-0 -z-10 bg-slate-900" aria-hidden="true">
      {layers.map((src) => (
        <div
          key={src}
          className="animate-fade-in absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          isDay ? "bg-gradient-to-b from-slate-900/30 via-slate-900/35 to-slate-900/75" : "bg-gradient-to-b from-indigo-950/60 via-slate-950/60 to-slate-950/85"
        }`}
      />
    </div>
  );
}

/** Animated weather particles layered over the background. */
export function WeatherFX({ type }) {
  const drops = useMemo(() => {
    const n = type === "rain" || type === "thunder" ? 90 : type === "drizzle" ? 45 : 0;
    return Array.from({ length: n }, () => ({
      left: rand(-5, 105),
      delay: rand(-2, 0),
      dur: rand(0.5, 0.9) * (type === "drizzle" ? 1.6 : 1),
      h: rand(40, 90) * (type === "drizzle" ? 0.5 : 1),
      o: rand(0.25, 0.6),
    }));
  }, [type]);

  const flakes = useMemo(
    () =>
      type !== "snow"
        ? []
        : Array.from({ length: 70 }, () => ({
            left: rand(0, 100),
            delay: rand(-12, 0),
            dur: rand(7, 14),
            size: rand(3, 7),
            drift: rand(-60, 60),
          })),
    [type]
  );

  const stars = useMemo(
    () =>
      type !== "stars"
        ? []
        : Array.from({ length: 60 }, () => ({
            left: rand(0, 100),
            top: rand(0, 60),
            size: rand(1, 2.5),
            delay: rand(0, 4),
          })),
    [type]
  );

  return (
    <div className="fx pointer-events-none fixed inset-0 -z-[5] overflow-hidden" aria-hidden="true">
      {drops.map((d, i) => (
        <span
          key={i}
          className="drop"
          style={{ left: `${d.left}%`, height: d.h, opacity: d.o, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }}
        />
      ))}
      {flakes.map((f, i) => (
        <span
          key={i}
          className="flake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
            "--drift": `${f.drift}px`,
          }}
        />
      ))}
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
      {type === "thunder" && <div className="lightning" />}
      {type === "sun" && <div className="sun-glow" />}
      {(type === "clouds" || type === "fog") && (
        <>
          <div className={`cloud-blob ${type === "fog" ? "fog" : ""}`} style={{ top: "8%", animationDuration: "70s" }} />
          <div className={`cloud-blob ${type === "fog" ? "fog" : ""}`} style={{ top: "38%", animationDuration: "95s", animationDelay: "-40s" }} />
          {type === "fog" && <div className="cloud-blob fog" style={{ top: "65%", animationDuration: "80s", animationDelay: "-20s" }} />}
        </>
      )}
    </div>
  );
}
