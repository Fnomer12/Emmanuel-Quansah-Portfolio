"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ================= DATA (from CV) ================= */

const education = [
  {
    award: "BSc Nursing",
    school: "Valley View University",
    place: "Accra, Ghana",
    year: "2017",
  },
  {
    award: "Diploma in Registered General Nursing",
    school: "SDA Nursing and Midwifery Training School",
    place: "Kumasi, Ghana",
    year: "",
  },
];

// Set to true to show your NMC PIN (it is on the public NMC register)
const SHOW_NMC_PIN = false;

const licences = [
  {
    title: "Registered Nurse",
    body: "Nursing & Midwifery Council (NMC)",
    region: "United Kingdom",
    detail: SHOW_NMC_PIN ? "PIN 25A1044O" : "Active registration",
    icon: "uk",
  },
  {
    title: "Registered Nursing Licence",
    body: "Nursing & Midwifery Council of Ghana",
    region: "Ghana",
    detail: "Licensed",
    icon: "gh",
  },
  {
    title: "Driving Licence",
    body: "Ghanaian Licence + International Driving Permit",
    region: "International",
    detail: "Valid",
    icon: "car",
  },
] as const;

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
const languages = [
  { name: "English", level: "C1", label: "Advanced" },
  { name: "French", level: "A2", label: "Elementary" },
];

/* ================= SMALL PARTS ================= */

function Seal() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Scalloped edge */}
      <path
        d={Array.from({ length: 24 })
          .map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const r = i % 2 === 0 ? 46 : 40;
            return `${i === 0 ? "M" : "L"}${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`;
          })
          .join(" ") + " Z"}
        fill="#CCFF00"
        stroke="#0A0A0A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeDasharray="4 4" />
      {/* Graduation cap */}
      <path d="M50,36 L72,46 L50,56 L28,46 Z" fill="#0A0A0A" />
      <path d="M38,51 L38,60 C44,65 56,65 62,60 L62,51" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" />
      <path d="M72,46 L72,58" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function LicenceIcon({ kind }: { kind: (typeof licences)[number]["icon"] }) {
  const img = {
    uk: { src: "/illustrations/flag-uk.png", alt: "United Kingdom flag" },
    gh: { src: "/illustrations/flag-gh.png", alt: "Ghana flag" },
    car: { src: "/illustrations/car.png", alt: "Driving licence" },
  }[kind];

  return (
    <span className="relative block w-full h-full">
      <Image src={img.src} alt={img.alt} fill sizes="48px" className="object-cover" />
    </span>
  );
}

/* ================= MAIN ================= */

export default function Education() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Certificates: stacked → fanned out (scrubbed with scroll)
      gsap.fromTo(
        ".cert-0",
        { rotate: -2, x: 0, y: 30 },
        {
          rotate: -5,
          x: -10,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: ".cert-stack", start: "top 85%", end: "center 45%", scrub: 1 },
        }
      );
      gsap.fromTo(
        ".cert-1",
        { rotate: 2, x: 0, y: -170 },
        {
          rotate: 4,
          x: 18,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: ".cert-stack", start: "top 85%", end: "center 45%", scrub: 1 },
        }
      );
      gsap.from(".cert-seal", {
        scale: 0,
        rotate: -180,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".cert-stack", start: "top 60%" },
      });

      // Licence cards + stamp
      gsap.utils.toArray<HTMLElement>(".lic-card").forEach((card) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%" } });
        tl.from(card, { x: 60, opacity: 0, duration: 0.7, ease: "power3.out" }).fromTo(
          card.querySelector(".lic-stamp"),
          { scale: 2.6, opacity: 0, rotate: -30 },
          { scale: 1, opacity: 1, rotate: -12, duration: 0.35, ease: "power4.in" },
          "-=0.1"
        );
      });

      // Language segments fill
      gsap.from(".lang-seg-on", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.35,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ".lang-wrap", start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="education" ref={root} className="w-full bg-white text-black py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="mb-14 md:mb-20 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50 mb-3">Education &amp; Licences</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.02]">
            Trained in Ghana.{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-0 bottom-1 h-4 md:h-6 bg-[#CCFF00]" />
              <span className="relative">Registered in the UK.</span>
            </span>
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* ===== Education certificates ===== */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8">Education</h3>
            <div className="cert-stack flex flex-col gap-8">
              {education.map((e, i) => (
                <div
                  key={e.school}
                  className={`cert-${i} relative bg-[#FAFAF5] border-2 border-black rounded-[1.5rem] p-6 md:p-9 shadow-[6px_6px_0_#0A0A0A]`}
                >
                  {/* Inner certificate border */}
                  <div className="absolute inset-3 rounded-[1rem] border border-dashed border-black/25 pointer-events-none" />

                  <div className="relative flex gap-4 sm:gap-5 items-start">
                    <div className="cert-seal w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0">
                      <Seal />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
                        {e.year ? `Awarded ${e.year}` : "Awarded"}
                      </p>
                      <h4 className="mt-2 text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight">{e.award}</h4>
                      <p className="mt-3 font-bold">{e.school}</p>
                      <p className="text-sm text-black/55">{e.place}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Licences + languages ===== */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8">Licences held</h3>
            <div className="flex flex-col gap-5">
              {licences.map((l) => (
                <div
                  key={l.title}
                  className="lic-card relative flex items-stretch bg-white border-2 border-black rounded-[1.25rem] overflow-hidden"
                >
                  {/* ID stripe */}
                  <div className="w-3 md:w-4 bg-[#CCFF00] border-r-2 border-black" />
                  <div className="flex-1 flex items-center gap-4 p-5">
                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center overflow-hidden ${l.icon === "car" ? "bg-[#F4F4F0] border-2 border-black" : ""}`}>
                      <LicenceIcon kind={l.icon} />
                    </div>
                    <div className="flex-1 min-w-0 pr-14 sm:pr-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">{l.region}</p>
                      <p className="text-lg md:text-xl font-black leading-tight">{l.title}</p>
                      <p className="text-sm text-black/60 truncate">{l.body}</p>
                    </div>
                    <span className="hidden sm:inline text-[11px] font-bold text-black/50 whitespace-nowrap">{l.detail}</span>
                  </div>

                  {/* Stamp */}
                  <div className="lic-stamp pointer-events-none absolute right-4 top-3 border-[3px] border-black rounded-md px-2 py-0.5 text-[10px] font-black tracking-[0.2em] bg-[#CCFF00]">
                    VERIFIED
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="lang-wrap mt-14">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Languages</h3>
              <div className="flex flex-col gap-6">
                {languages.map((lang) => {
                  const reached = CEFR.indexOf(lang.level);
                  return (
                    <div key={lang.name}>
                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-lg font-black">{lang.name}</p>
                        <p className="text-sm font-bold text-black/60">
                          {lang.level} · {lang.label}
                        </p>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5">
                        {CEFR.map((lvl, i) => (
                          <div key={lvl}>
                            <div className="h-3 rounded-full bg-black/10 overflow-hidden border border-black/10">
                              {i <= reached && <div className="lang-seg-on h-full w-full bg-black" />}
                            </div>
                            <p className={`mt-1 text-[9px] font-black text-center ${i === reached ? "text-black" : "text-black/30"}`}>
                              {lvl}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}