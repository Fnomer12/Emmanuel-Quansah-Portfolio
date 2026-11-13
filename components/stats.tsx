"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";
import type { FeatureCollection } from "geojson";
import land110 from "world-atlas/land-110m.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ================= DATA ================= */

type StatVisual =
  | { kind: "trend"; values: number[] }
  | { kind: "uptime"; years: number[]; highlight: number[] }
  | { kind: "distribution"; bins: number[]; marker: number }
  | { kind: "map"; points: [number, number][] };

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  detail: string;
  context: string;
  visual: StatVisual;
}

const stats: Stat[] = [
  {
    label: "Nurses trained",
    value: 500,
    suffix: "+",
    detail: "Students & care staff",
    context: "Mentored across the UK and Ghana",
    // Cumulative total per year, 2012 → 2026. Edit to your real figures.
    visual: { kind: "trend", values: [0, 15, 35, 60, 85, 110, 140, 170, 205, 245, 290, 340, 395, 450, 500] },
  },
  {
    label: "Years in care",
    value: 14,
    suffix: "+",
    detail: "Nursing since 2012",
    context: "Ghana Adventist Health Service → TopCare",
    // One bar per year; dark bars = career milestones
    visual: {
      kind: "uptime",
      years: Array.from({ length: 15 }, (_, i) => 2012 + i),
      highlight: [2012, 2017, 2021, 2024],
    },
  },
  {
    label: "Trainer certifications",
    value: 4,
    detail: "'Train the Trainer' accredited",
    context: "Plus 17 clinical training courses",
    // Dark bars = 4 trainer certifications, grey = 17 clinical courses
    visual: {
      kind: "distribution",
      bins: [3, 5, 8, 10, 6, 5, 4.2, 3.6, 3, 2.5, 2, 1.6, 1.3, 1.1, 1, 0.9, 0.8, 0.8, 0.7, 0.7, 0.6],
      marker: 4,
    },
  },
  {
    label: "Countries",
    value: 2,
    detail: "UK & Ghana",
    context: "Accra & Kumasi → Isle of Man",
    // [longitude, latitude]
    visual: {
      kind: "map",
      points: [
        [-0.19, 5.6],   // Accra
        [-1.62, 6.69],  // Kumasi
        [-4.48, 54.15], // Douglas, Isle of Man
      ],
    },
  },
];

/* ================= VISUALS ================= */

function Trend({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 100, 36 - ((v - min) / span) * 32] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const [ex, ey] = pts[pts.length - 1];

  return (
    <div className="relative w-full h-16">
      <div className="vis-reveal absolute inset-0">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
          <path d={`${line} L100 40 L0 40 Z`} className="fill-black/[0.06] group-hover:fill-[#CCFF00]/50 transition-colors" />
          <path d={line} fill="none" stroke="#3a3a3a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <span
        className="vis-pop absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a3a3a] group-hover:bg-[#CCFF00] group-hover:ring-2 group-hover:ring-black transition-colors"
        style={{ left: `${ex}%`, top: `${(ey / 40) * 100}%` }}
      />
    </div>
  );
}

function Uptime({ years, highlight }: { years: number[]; highlight: number[] }) {
  return (
    <div className="w-full">
      <div className="flex items-end gap-[3px] h-12">
        {years.map((y) => {
          const ink = highlight.includes(y);
          return (
            <span
              key={y}
              title={String(y)}
              className={`vis-bar flex-1 origin-bottom rounded-[1px] transition-colors ${
                ink ? "bg-[#3a3a3a] group-hover:bg-[#CCFF00] group-hover:outline group-hover:outline-1 group-hover:outline-black" : "bg-black/15"
              }`}
              style={{ height: "100%" }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] font-bold text-black/40 mt-1">
        <span>{years[0]}</span>
        <span>{years[years.length - 1]}</span>
      </div>
    </div>
  );
}

function Distribution({ bins, marker }: { bins: number[]; marker: number }) {
  const peak = Math.max(...bins) || 1;
  return (
    <div className="flex items-end gap-[3px] h-16 w-full">
      {bins.map((b, i) => {
        const ink = i < marker;
        return (
          <span
            key={i}
            className={`vis-bar flex-1 origin-bottom transition-colors ${
              ink ? "bg-[#3a3a3a] group-hover:bg-[#CCFF00] group-hover:outline group-hover:outline-1 group-hover:outline-black" : "bg-black/15"
            }`}
            style={{ height: `${Math.max(6, (b / peak) * 100)}%` }}
          />
        );
      })}
    </div>
  );
}

/* --- Dotted world map --- */
const WORLD = { columns: 72, rows: 30, north: 80, south: -58, west: -170, east: 190 };

let landCache: boolean[] | null = null;
function getLand(): boolean[] {
  if (landCache) return landCache;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topo = land110 as any;
  const geo = feature(topo, topo.objects.land) as unknown as FeatureCollection;
  const out: boolean[] = [];
  for (let y = 0; y < WORLD.rows; y++) {
    const lat = WORLD.north - ((y + 0.5) / WORLD.rows) * (WORLD.north - WORLD.south);
    for (let x = 0; x < WORLD.columns; x++) {
      let lon = WORLD.west + ((x + 0.5) / WORLD.columns) * (WORLD.east - WORLD.west);
      if (lon > 180) lon -= 360;
      out.push(geoContains(geo, [lon, lat]));
    }
  }
  landCache = out;
  return out;
}

const cellOf = (lon: number, lat: number) => {
  const x = Math.floor(((((lon - WORLD.west) % 360) + 360) % 360) / (WORLD.east - WORLD.west) * WORLD.columns);
  const y = Math.floor(((WORLD.north - lat) / (WORLD.north - WORLD.south)) * WORLD.rows);
  return [Math.min(WORLD.columns - 1, Math.max(0, x)), Math.min(WORLD.rows - 1, Math.max(0, y))] as const;
};

// Snap to nearest land dot so coastal cities don't light a sea dot
function nearestLand(land: boolean[], lon: number, lat: number) {
  const [x, y] = cellOf(lon, lat);
  let best = y * WORLD.columns + x;
  let dist = Infinity;
  for (let dy = -2; dy <= 2; dy++)
    for (let dx = -2; dx <= 2; dx++) {
      const cx = x + dx, cy = y + dy;
      if (cx < 0 || cy < 0 || cx >= WORLD.columns || cy >= WORLD.rows || !land[cy * WORLD.columns + cx]) continue;
      const d = dx * dx + dy * dy;
      if (d < dist) { dist = d; best = cy * WORLD.columns + cx; }
    }
  return best;
}

function WorldMap({ points }: { points: [number, number][] }) {
  const land = useMemo(getLand, []);
  const lit = useMemo(() => new Set(points.map(([lon, lat]) => nearestLand(land, lon, lat))), [land, points]);

  return (
    <svg viewBox={`0 0 ${WORLD.columns} ${WORLD.rows}`} className="w-full h-auto">
      {land.map(
        (isLand, i) =>
          isLand &&
          !lit.has(i) && (
            <circle key={i} className="vis-land fill-black/25" cx={(i % WORLD.columns) + 0.5} cy={Math.floor(i / WORLD.columns) + 0.5} r={0.3} />
          )
      )}
      {[...lit].map((i) => (
        <circle
          key={i}
          className="vis-pop fill-[#3a3a3a] group-hover:fill-[#CCFF00] transition-colors"
          stroke="#0A0A0A"
          strokeWidth={0.15}
          cx={(i % WORLD.columns) + 0.5}
          cy={Math.floor(i / WORLD.columns) + 0.5}
          r={0.65}
        />
      ))}
    </svg>
  );
}

function Visual({ v }: { v: StatVisual }) {
  switch (v.kind) {
    case "trend": return <Trend values={v.values} />;
    case "uptime": return <Uptime years={v.years} highlight={v.highlight} />;
    case "distribution": return <Distribution bins={v.bins} marker={v.marker} />;
    case "map": return <WorldMap points={v.points} />;
  }
}

/* ================= MAIN ================= */

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(".stat-live").forEach((el) => (el.textContent = el.dataset.final ?? ""));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nums = gsap.utils.toArray<HTMLElement>(".stat-live");
        nums.forEach((el) => (el.textContent = "0"));

        // Hide visuals until in view
        gsap.set(".vis-reveal", { clipPath: "inset(0 100% 0 0)" });
        gsap.set(".vis-bar", { scaleY: 0 });
        gsap.set(".vis-land", { opacity: 0 });
        gsap.set(".vis-pop", { scale: 0, transformOrigin: "center" });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });

        tl.from(".stat-cell", { y: 30, opacity: 0, duration: 0.7, stagger: 0.09, ease: "power3.out" });

        nums.forEach((el, i) => {
          const c = { v: 0 };
          tl.to(
            c,
            {
              v: Number(el.dataset.value),
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => (el.textContent = Math.round(c.v).toString()),
              onComplete: () => (el.textContent = el.dataset.final ?? ""),
            },
            0.2 + i * 0.09
          );
        });

        // Visuals draw in after the numbers
        tl.to(".vis-reveal", { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power2.inOut" }, 1.1)
          .to(".vis-bar", { scaleY: 1, duration: 0.5, stagger: 0.02, ease: "power2.out" }, 1.1)
          .to(".vis-land", { opacity: 1, duration: 0.4, stagger: { each: 0.0015, from: "random" } }, 1.1)
          .to(".vis-pop", { scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(2.5)" }, 1.9);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-labelledby="stats-title" className="w-full bg-white text-black py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 md:mb-16 max-w-2xl mx-auto sm:mx-0 text-center sm:text-left">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50 mb-3">By the numbers</p>
          <h2 id="stats-title" className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]">
            A career built on care, teaching &amp; trust
          </h2>
          <p className="mt-4 text-base md:text-lg text-black/60">
            Over a decade of nursing, training and leadership across two countries.
          </p>
        </header>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-black/15">
          {stats.map((s, i) => {
            const final = s.value.toString();
            return (
              <div
                key={s.label}
                tabIndex={0}
                className={`stat-cell group relative flex flex-col gap-4 p-6 md:p-8 text-center sm:text-left outline-none border-black/15
                  ${i > 0 ? "border-t sm:border-t-0" : ""}
                  ${i % 2 === 1 ? "sm:border-l" : ""}
                  ${i >= 2 ? "sm:border-t lg:border-t-0" : ""}
                  ${i > 0 ? "lg:border-l" : ""}
                  hover:bg-[#FAFAF5] focus-visible:bg-[#FAFAF5] transition-colors`}
              >
                <dt className="text-xs font-black uppercase tracking-[0.15em] text-black/60">{s.label}</dt>

                <dd
                  className="flex items-baseline justify-center sm:justify-start font-black leading-none tracking-tighter text-[clamp(3rem,5.5vw,5rem)]"
                  style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
                >
                  <span className="sr-only">{final}{s.suffix}</span>
                  <span aria-hidden="true" className="relative inline-block tabular-nums">
                    <span className="invisible">{final}</span>
                    <span className="stat-live absolute inset-0" data-value={s.value} data-final={final}>{final}</span>
                  </span>
                  {s.suffix && (
                    <span aria-hidden="true" className="text-[#CCFF00] [-webkit-text-stroke:2px_#0A0A0A]">{s.suffix}</span>
                  )}
                </dd>

                <dd className="relative h-5 overflow-hidden text-sm">
                  <span className="absolute inset-0 text-black/60 transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0 group-focus-visible:-translate-y-full group-focus-visible:opacity-0">
                    {s.detail}
                  </span>
                  <span className="absolute inset-0 font-semibold translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {s.context}
                  </span>
                </dd>

                <dd aria-hidden="true" className="mt-auto pt-6 min-h-[96px] flex items-end">
                  <Visual v={s.visual} />
                </dd>

                <span className="absolute left-0 top-0 h-[3px] w-0 bg-[#CCFF00] transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}