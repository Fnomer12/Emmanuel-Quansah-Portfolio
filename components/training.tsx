"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ================= DATA (from CV) ================= */

type IconName = "shield" | "pill" | "hands" | "cross";

const trainerCerts: { code: string; title: string; sub: string; text: string; icon: IconName }[] = [
  {
    code: "01",
    title: "CPI Safety Intervention",
    sub: "Train the Trainer",
    text: "Certified to teach de-escalation and crisis prevention to care teams.",
    icon: "shield",
  },
  {
    code: "02",
    title: "Medication Administration",
    sub: "Train the Trainer",
    text: "Teaching safe, compliant medicine administration and record keeping.",
    icon: "pill",
  },
  {
    code: "03",
    title: "Moving & Handling",
    sub: "Train the Trainer",
    text: "Hands-on training in safely moving and handling people.",
    icon: "hands",
  },
  {
    code: "04",
    title: "First Aid Trainer",
    sub: "St John Ambulance / British Red Cross recognised",
    text: "Delivering first aid training and emergency response skills.",
    icon: "cross",
  },
];

const clinical = [
  "Urethral Catheterisation & Catheter Care",
  "IV Catheterisation & IV Therapy",
  "Venipuncture",
  "Sepsis Awareness",
  "Advanced Medication Awareness",
  "BLS / CPR & Emergency First Aid",
  "Safeguarding Adults & Children",
  "Infection Prevention & Control",
  "Dementia & Learning Disability Care",
  "Food Hygiene & Nutrition",
  "Conflict & Complaint Management",
  "Leadership & Team Building",
  "Equality, Diversity & Inclusion",
  "Mental Health Awareness",
  "Professional Boundaries & Lone Working",
  "Information Handling & GDPR",
  "Health & Safety and Risk Management",
];

const rowA = clinical.slice(0, 9);
const rowB = clinical.slice(9);

/* ================= ICONS (hand-drawn style) ================= */

function Icon({ name }: { name: IconName }) {
  const s = {
    fill: "none",
    stroke: "#0A0A0A",
    strokeWidth: 5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "shield":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path {...s} fill="#CCFF00" d="M50,10 C62,18 75,20 85,20 C85,55 72,78 50,90 C28,78 15,55 15,20 C25,20 38,18 50,10 Z" />
          <path {...s} d="M34,50 L46,62 L67,37" />
        </svg>
      );
    case "pill":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g transform="rotate(-35 50 50)">
            <rect {...s} x="15" y="36" width="70" height="28" rx="14" fill="#FFFFFF" />
            <path {...s} fill="#CCFF00" d="M50,36 H29 A14,14 0 0 0 29,64 H50 Z" />
          </g>
          <path {...s} strokeWidth={4} d="M78,18 L84,12 M84,26 L92,24 M70,12 L70,4" />
        </svg>
      );
    case "hands":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path {...s} fill="#CCFF00" d="M50,70 C24,54 20,38 32,29 C41,23 48,28 50,34 C52,28 59,23 68,29 C80,38 76,54 50,70 Z" />
          <path {...s} d="M10,72 C22,70 30,80 50,84 C70,80 78,70 90,72" />
          <path {...s} d="M10,72 L10,90 M90,72 L90,90" />
        </svg>
      );
    case "cross":
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle {...s} cx="50" cy="50" r="38" fill="#FFFFFF" />
          <path {...s} fill="#CCFF00" d="M42,24 H58 V42 H76 V58 H58 V76 H42 V58 H24 V42 H42 Z" />
        </svg>
      );
  }
}

/* ================= TILT CARD ================= */

function TiltCard({ cert }: { cert: (typeof trainerCerts)[number] }) {
  const card = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = card.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return; // skip on touch

    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ry((x - 0.5) * 18);
      rx((0.5 - y) * 18);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });

  const num = String(Number(cert.code)); // "01" → "1"

  return (
    <div className="train-card [perspective:1000px]">
      <div
        ref={card}
        className="group relative h-full min-h-[320px] rounded-[2rem] bg-white border-2 border-black p-7 flex flex-col
                   shadow-[6px_6px_0_#0A0A0A] hover:shadow-[12px_12px_0_#0A0A0A] transition-shadow duration-300
                   [transform-style:preserve-3d] will-change-transform"
      >
        {/* Jersey number, cropped by the card */}
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] overflow-hidden">
          <span
            aria-hidden="true"
            className="absolute -right-4 -bottom-16 leading-none select-none text-[#EFEFE8] group-hover:text-[#CCFF00] transition-colors duration-500"
            style={{
              fontFamily: 'Impact, "Haettenschweiler", "Arial Narrow Bold", sans-serif',
              fontStyle: "italic",
              fontSize: "clamp(15rem, 22vw, 20rem)",
              letterSpacing: "-0.04em",
            }}
          >
            {num}
          </span>
        </div>

        {/* Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(204,255,0,0.35), transparent 55%)",
          }}
        />

        {/* Lifted content */}
        <div className="relative flex items-start justify-center sm:justify-between [transform:translateZ(50px)]">
          <div className="w-16 h-16 md:w-20 md:h-20">
            <Icon name={cert.icon} />
          </div>
        </div>

        <div className="relative mt-auto pt-8 text-center sm:text-left [transform:translateZ(35px)]">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.15em] bg-[#CCFF00] border border-black px-2.5 py-1 rounded-full mb-3">
            {cert.sub}
          </span>
          <h3 className="text-xl md:text-2xl font-black leading-tight tracking-tight">{cert.title}</h3>
          <p className="mt-2 text-sm text-black/60 leading-relaxed max-w-xs mx-auto sm:mx-0">{cert.text}</p>
        </div>
      </div>
    </div>
  );
}

/* ================= TICKER ROW ================= */

function TickerRow({ items, dark }: { items: string[]; dark?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`flex w-max ${dark ? "ticker-b" : "ticker-a"}`}
    >
      {doubled.map((t, i) => (
        <span
          key={i}
          className={`flex items-center gap-6 px-6 py-4 text-lg md:text-2xl font-black uppercase tracking-tight whitespace-nowrap ${
            dark ? "text-white" : "text-black"
          }`}
          style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
        >
          {t}
          <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#CCFF00] border-2 border-black" />
        </span>
      ))}
    </div>
  );
}

/* ================= MAIN ================= */

export default function Training() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Cards flip up into place
      gsap.from(".train-card", {
        y: 80,
        rotationX: -25,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        transformOrigin: "50% 100%",
        scrollTrigger: { trigger: ".train-grid", start: "top 80%" },
      });

      gsap.from(".train-wide", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".train-wide", start: "top 85%" },
      });

      // Infinite tickers
      const a = gsap.to(".ticker-a", { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
      const b = gsap.fromTo(".ticker-b", { xPercent: -50 }, { xPercent: 0, duration: 45, ease: "none", repeat: -1 });

      // Speed up while scrolling, then ease back
      ScrollTrigger.create({
        trigger: ".ticker-wrap",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5);
          gsap.to([a, b], { timeScale: boost, duration: 0.2, overwrite: true });
          gsap.to([a, b], { timeScale: 1, duration: 1, delay: 0.25, overwrite: false });
        },
      });
    },
    { scope: root }
  );

  return (
    <section id="training" ref={root} className="w-full bg-white text-black pt-24 md:pt-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50 mb-3">Training &amp; Certifications</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.02] max-w-3xl">
              Qualified to{" "}
              <span className="relative inline-block">
                <span className="absolute inset-x-0 bottom-1 h-4 md:h-6 bg-[#CCFF00]" />
                <span className="relative">train the trainers</span>
              </span>
            </h2>
          </div>
          <p className="text-black/60 text-base md:text-lg max-w-sm">
            Accredited to deliver and assess the training that keeps care teams safe, skilled and confident.
          </p>
        </header>

        {/* Trainer cards */}
        <div className="train-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trainerCerts.map((c) => (
            <TiltCard key={c.code} cert={c} />
          ))}
        </div>

        {/* Assessor banner */}
        <div className="train-wide mt-8 md:mt-10 rounded-[2rem] bg-black text-white p-7 md:p-10 flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-[#CCFF00]" />
          <div className="relative w-16 h-16 shrink-0 rounded-full bg-[#CCFF00] border-2 border-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="9" r="6" />
              <path d="M8.5 14 L7 22 L12 19 L17 22 L15.5 14" />
            </svg>
          </div>
          <div className="relative flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#CCFF00] mb-2">Accredited assessor</p>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              Level 3 Certificate in Assessing Vocational Achievement (CAVA)
            </h3>
          </div>
          <span className="relative self-start md:self-center text-xs font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-full border-2 border-black">
            TQUK Accredited
          </span>
        </div>
      </div>

      {/* Clinical trainings ticker */}
      <div className="ticker-wrap mt-20 md:mt-28">
        <div className="max-w-7xl mx-auto px-6 mb-6 flex items-baseline justify-between">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50">Clinical training</p>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50">{clinical.length} courses</p>
        </div>

        <div className="relative -rotate-2 scale-105">
          <div className="border-y-2 border-black bg-[#CCFF00] overflow-hidden">
            <TickerRow items={rowA} />
          </div>
          <div className="border-b-2 border-black bg-black overflow-hidden">
            <TickerRow items={rowB} dark />
          </div>
        </div>
      </div>

      <div className="h-24 md:h-32" />
    </section>
  );
}