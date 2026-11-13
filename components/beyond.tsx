"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const GROUND = "#FFFFFF"; // page background; fills the cut-out corner

/* ================= DOODLES ================= */

const ink = {
  fill: "none",
  stroke: "#0A0A0A",
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const FirstAidDoodle = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
    <rect {...ink} x="18" y="34" width="84" height="64" rx="12" fill="#FFFFFF" />
    <path {...ink} d="M44,34 V24 C44,20 47,18 50,18 H70 C73,18 76,20 76,24 V34" />
    <path {...ink} fill="#CCFF00" d="M53,48 H67 V59 H78 V73 H67 V84 H53 V73 H42 V59 H53 Z" />
    <path {...ink} strokeWidth={4} d="M104,22 L112,14 M108,34 L118,32 M96,12 L96,2" />
  </svg>
);

const FootballDoodle = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
    <circle {...ink} cx="60" cy="60" r="42" fill="#FFFFFF" />
    <path {...ink} fill="#0A0A0A" d="M60,42 L75,53 L69,71 L51,71 L45,53 Z" />
    <path {...ink} d="M60,42 V20 M75,53 L96,46 M69,71 L82,90 M51,71 L38,90 M45,53 L24,46" />
    <path {...ink} strokeWidth={4} d="M8,96 C16,92 20,100 28,96 M100,104 C106,100 110,106 116,102" />
  </svg>
);

const SproutDoodle = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
    <path stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" fill="none" d="M60,98 V56" />
    <path stroke="#FFFFFF" strokeWidth={5} strokeLinejoin="round" fill="#CCFF00" d="M60,62 C60,40 76,28 98,28 C98,50 84,62 60,62 Z" />
    <path stroke="#FFFFFF" strokeWidth={5} strokeLinejoin="round" fill="#CCFF00" d="M60,70 C60,52 46,42 26,42 C26,60 38,70 60,70 Z" />
    <path stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" fill="none" d="M18,100 C36,92 84,92 102,100" />
  </svg>
);

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H8M17 7V16" />
  </svg>
);

/* ================= CARD CONTENT ================= */

const pillars = [
  "Developing talent",
  "Counselling",
  "Giving support",
  "Planning their futures",
  "Accurate player records",
  "Giving hope to the hopeless",
];

type Card = {
  key: string;
  bg: string;
  dark?: boolean;
  label: string;
  sub: string;
  href: string;
  accent: string;
  arrowInk: string;
  body: React.ReactNode;
  doodle: React.ReactNode;
};

const titleSize = { fontSize: "clamp(1.7rem, 3.3vw, 3.4rem)" };

const cards: Card[] = [
  {
    key: "volunteer",
    bg: "#F4F4F0",
    label: "Volunteer service",
    sub: "2023 – Present · Isle of Man",
    href: "#contact",
    accent: "#0A0A0A",
    arrowInk: "#CCFF00",
    doodle: <FirstAidDoodle />,
    body: (
      <>
        <span className="self-start text-[11px] font-black uppercase tracking-[0.18em] border-2 border-black rounded-full px-3 py-1 mb-4 md:mb-6">
          01 · Volunteer service
        </span>
        <h3 className="font-black tracking-tight leading-[1.02]" style={titleSize}>
          St John Ambulance &amp; British Red Cross
        </h3>
        <ul className="mt-4 md:mt-6 space-y-2 md:space-y-3 text-sm md:text-lg text-black/75">
          <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-black shrink-0" />First aid response, training and public health education</li>
          <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-black shrink-0" />Community outreach supporting vulnerable individuals</li>
        </ul>
        <div className="mt-5 md:mt-8 inline-flex flex-col self-start rounded-2xl bg-white border border-black/10 px-4 py-3 md:px-5 md:py-4">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/50">Also volunteered</span>
          <span className="font-black text-sm md:text-base">Voluntary Nurse, Escuela Clinic, Ghana</span>
          <span className="text-xs md:text-sm text-black/60">2018 – 2020 · Community health &amp; immunisation</span>
        </div>
      </>
    ),
  },
  {
    key: "football",
    bg: "#CCFF00",
    label: "Coach Quansah",
    sub: "Football sponsorship",
    href: "#contact",
    accent: "#0A0A0A",
    arrowInk: "#CCFF00",
    doodle: <FootballDoodle />,
    body: (
      <>
        <span className="self-start text-[11px] font-black uppercase tracking-[0.18em] bg-black text-[#CCFF00] rounded-full px-3 py-1 mb-4 md:mb-6">
          02 · Coach Quansah
        </span>
        <h3 className="font-black tracking-tight leading-[1.02]" style={titleSize}>
          Opening doors through football
        </h3>
        <p className="mt-4 md:mt-5 text-sm md:text-lg text-black/80 max-w-xl leading-relaxed">
          I personally sponsor talented young footballers from under-supported backgrounds, giving them the support
          they don&apos;t get at home so their talent gets a fair chance.
        </p>
        <div className="mt-5 md:mt-7">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-2 md:mb-3">Now playing at</p>
          <div className="flex flex-wrap gap-2">
            {["Accra Lions", "MŠK Žilina Africa"].map((c) => (
              <span key={c} className="text-xs md:text-sm font-black bg-white border-2 border-black rounded-full px-3 py-1.5 md:px-4 md:py-2">
                ⚽ {c}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-5 md:mt-7 inline-flex flex-col self-start rounded-2xl bg-black text-white px-4 py-3 md:px-5 md:py-4">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#CCFF00]">Club development</span>
          <span className="font-black text-sm md:text-base">KAA Ashanti Icons FC · Kumasi</span>
          <span className="text-xs md:text-sm text-white/60">Player recruitment, development &amp; welfare</span>
        </div>
      </>
    ),
  },
  {
    key: "foundation",
    bg: "#0A0A0A",
    dark: true,
    label: "The Quansah Foundation",
    sub: "Coming soon",
    href: "#contact",
    accent: "#CCFF00",
    arrowInk: "#0A0A0A",
    doodle: <SproutDoodle />,
    body: (
      <>
        <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] border-2 border-white rounded-full px-3 py-1">
            03 · The Quansah Foundation
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] bg-[#CCFF00] text-black rounded-full px-3 py-1">
            Coming soon
          </span>
        </div>
        <h3 className="font-black tracking-tight leading-[1.02]" style={titleSize}>
          Giving hope to the <span className="text-[#CCFF00]">hopeless</span>
        </h3>
        <p className="mt-4 md:mt-5 text-sm md:text-lg text-white/70 max-w-xl leading-relaxed">
          A low-cost nonprofit to formalise what I already do as a coach: supporting talented kids with less support at
          home, through football.
        </p>
        <div className="mt-5 md:mt-7 grid grid-cols-2 gap-2 max-w-xl">
          {pillars.map((p, i) => (
            <div key={p} className="flex items-center gap-3 rounded-xl border border-white/15 px-3 py-2 md:px-4 md:py-2.5">
              <span className="text-[#CCFF00] font-black text-xs md:text-sm">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-bold text-xs md:text-sm">{p}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

/* ================= CUT-OUT CORNER BUTTON ================= */

function Visit({ c }: { c: Card }) {
  const R = 18;
  const corner = (
    <svg aria-hidden width={R} height={R} viewBox={`0 0 ${R} ${R}`} className="block">
      <path d={`M${R} 0 V${R} H0 A${R} ${R} 0 0 0 ${R} 0 Z`} fill={GROUND} />
    </svg>
  );
  return (
    <div className="absolute right-0 bottom-0 z-10">
      <div className="absolute right-0 bottom-full">{corner}</div>
      <div className="absolute right-full bottom-0">{corner}</div>
      <a
        href={c.href}
        aria-label={`${c.label}: get in touch`}
        className="group flex items-center gap-4 rounded-tl-[20px] py-3 pr-1 pl-5 text-[#111318] outline-none sm:gap-5 sm:py-4 sm:pl-7"
        style={{ background: GROUND }}
      >
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-black tracking-[-0.015em] sm:text-[18px]">{c.label}</span>
          <span className="text-[12px] text-[#3B3F48] underline-offset-4 group-hover:underline sm:text-[14px]">{c.sub}</span>
        </span>
        <span
          className="grid size-11 place-items-center rounded-full transition-transform duration-200 ease-out group-hover:rotate-45 group-active:scale-90 sm:size-[52px]"
          style={{ background: c.accent, color: c.arrowInk }}
        >
          <Arrow className="size-5 sm:size-6" />
        </span>
      </a>
    </div>
  );
}

/* ================= DECK MATH ================= */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const ENTER = 0.72;

function arrived(j: number, v: number, count: number) {
  if (j <= 0) return 1;
  const span = Math.max(1, count - 1);
  return easeOut(clamp01((v * span - (j - 1)) / ENTER));
}

/* ================= MAIN ================= */

export default function Beyond() {
  const root = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const count = cards.length;

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>(".deck-card");
      const dims = gsap.utils.toArray<HTMLElement>(".deck-dim");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const render = (v: number) => {
        els.forEach((el, i) => {
          const a = arrived(i, v, count);
          let above = 0;
          for (let j = i + 1; j < count; j++) above += arrived(j, v, count);
          above = Math.min(3, above);

          if (reduce) {
            el.style.transform = `translate3d(0, ${a >= 0.5 ? 0 : 110}svh, 0)`;
            return;
          }
          const y = (1 - a) * 108 - above * 5;
          const rx = -(1 - a) * 30 + above * 5;
          const s = 0.9 + 0.1 * a - above * 0.05;
          const blur = (1 - a) ** 2 * 12 + above * 1.1;
          el.style.transform = `translate3d(0, ${y}svh, 0) rotateX(${rx}deg) scale(${s})`;
          el.style.filter = `blur(${blur.toFixed(2)}px)`;
          if (dims[i]) dims[i].style.opacity = String(above * 0.15);
        });
      };

      render(0);

      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: deck.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
        onUpdate: () => render(proxy.p),
      });
    },
    { scope: root }
  );

  return (
    <section id="beyond" ref={root} className="w-full bg-white text-black pt-24 md:pt-32">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 mb-6 md:mb-10 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50 mb-3">Beyond nursing</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.02]">
          Care doesn&apos;t stop{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-0 bottom-1 h-4 md:h-6 bg-[#CCFF00]" />
            <span className="relative">after the shift</span>
          </span>
        </h2>
      </header>

      {/* Deck: one screen of scroll per card */}
      <div ref={deck} className="relative w-full" style={{ height: `${count * 100}svh` }} aria-label="Beyond nursing">
        <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden px-5 sm:px-10 lg:px-14 [perspective:1800px]">
          {cards.map((c, i) => (
            <article
              key={c.key}
              aria-label={c.label}
              className="deck-card col-start-1 row-start-1 mt-[4svh] w-full sm:w-[min(100%,calc(84svh*16/9),1280px)] origin-[50%_25%] will-change-[transform,filter]"
              style={{ zIndex: i + 1 }}
            >
              <div
                className="relative overflow-hidden rounded-[24px] shadow-[0_50px_90px_-35px_rgba(10,12,20,0.5)] h-[min(78svh,640px)] sm:h-auto sm:aspect-[16/9]"
                style={{ background: c.bg, color: c.dark ? "#FFFFFF" : "#0A0A0A" }}
              >
                <div className="absolute inset-0 flex gap-8 p-6 pb-24 sm:p-10 sm:pb-24 lg:p-14 lg:pb-24">
                  <div className="flex-1 flex flex-col min-w-0">{c.body}</div>
                  <div className="hidden md:flex w-[30%] items-center justify-center">
                    <div className="w-full max-w-[260px] aspect-square">{c.doodle}</div>
                  </div>
                </div>

                <Visit c={c} />

                <div aria-hidden className="deck-dim pointer-events-none absolute inset-0 bg-[#0A0C14]" style={{ opacity: 0 }} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}