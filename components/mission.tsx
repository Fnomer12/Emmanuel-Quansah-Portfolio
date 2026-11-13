"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Phones get a page-turning book (loaded only in the browser)
const MissionBook = dynamic(() => import("./mission-book"), { ssr: false });

/* ================= CONTENT ================= */

type TextBlock = {
  eyebrow?: string;
  heading: string;
  body: string;
  values?: string[];
  signature?: boolean;
};

export type Page = {
  left: { image?: string; alt?: string; text?: TextBlock };
  right: { image?: string; alt?: string; text?: TextBlock };
};

export const pages: Page[] = [
  {
    left: { image: "/illustrations/mission.png", alt: "Emmanuel Quansah with his hand on his heart" },
    right: {
      text: {
        eyebrow: "Professional mission",
        heading: "Care led by the Head, Heart & Hand",
        body: "Three commitments that shape how I nurse, teach and lead.",
      },
    },
  },
  {
    left: {
      text: {
        
        heading: "Integrity, excellence & service",
        body: "As a committed and compassionate Registered Nurse and Clinical Trainer, I lead with integrity, excellence, and service, ensuring that all aspects of patient care and professional training are driven by ethical standards and dedication.",
        values: ["Integrity", "Excellence", "Service"],
      },
    },
    right: { image: "/illustrations/mission-2.png", alt: "Emmanuel training care staff at a bedside" },
  },
  {
    left: { image: "/illustrations/mission-3.png", alt: "Emmanuel holding an elderly patient's hand" },
    right: {
      text: {
       
        heading: "Wisdom, justice, fortitude & temperance",
        body: "Through wisdom, justice, fortitude, and temperance, I foster a collaborative environment that emphasizes holistic, person-centered care, leadership, and continuous improvement.",
        values: ["Wisdom", "Justice", "Fortitude", "Temperance"],
      },
    },
  },
  {
    left: {
      text: {
        
        heading: "Inspire others. Improve lives.",
        body: "I aim to inspire others while delivering impactful healthcare services and education that improve lives and outcomes.",
        values: ["Inspire", "Educate", "Improve outcomes"],
        signature: true,
      },
    },
    right: { image: "/illustrations/mission-4.png", alt: "Emmanuel celebrating with graduating student nurses" },
  },
];

/* ================= PANEL ================= */

function Panel({ image, alt, text }: Page["left"]) {
  if (image) {
    return (
      <div className="relative w-full h-full bg-[#FAFAF5]">
        <Image src={image} alt={alt ?? ""} fill sizes="(max-width:768px) 100vw, 50vw" className="object-contain p-6 md:p-12" />
      </div>
    );
  }
  if (!text) return <div className="w-full h-full bg-white" />;

  return (
    <div className="w-full h-full bg-white flex items-center">
      <div className="w-full max-w-xl mx-auto pl-6 pr-12 md:px-12">
               {text.eyebrow && (
          <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.25em] text-black/45 mb-3 md:mb-5">
            {text.eyebrow}
          </p>
        )}
        <h2
          className="font-black tracking-tight leading-[1.02] text-[clamp(1.35rem,3.6vw,3.6rem)]"
          style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
        >
          {text.heading}
        </h2>
        <p className="mt-3 md:mt-6 text-[13px] leading-snug md:text-lg md:leading-relaxed text-black/70">{text.body}</p>

        {text.values && (
          <div className="mt-3 md:mt-8 flex flex-wrap gap-1.5 md:gap-2">
            {text.values.map((v) => (
              <span key={v} className="text-[11px] md:text-sm font-black bg-[#CCFF00] border-2 border-black rounded-full px-3 py-1">
                {v}
              </span>
            ))}
          </div>
        )}

        {text.signature && (
          <div className="mt-4 md:mt-10 flex items-center gap-3">
            <span className="h-[2px] w-10 bg-black" />
            <div>
              <p className="font-black">Emmanuel Quansah</p>
              <p className="text-xs md:text-sm text-black/55">RN (NMC UK) · Team Lead &amp; Clinical Trainer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function Mission() {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const count = pages.length;

  useGSAP(
    () => {
      // Pin + split-scroll on tablet & desktop only (phones use the book)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${(count - 1) * window.innerHeight}`,
          pin: true,
          snap: { snapTo: 1 / (count - 1), duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut" },
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (count - 1));
            if (idx !== currentRef.current) {
              currentRef.current = idx;
              setCurrent(idx);
            }
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  // Left half: past pages slide up, future pages wait below. Right half: the opposite.
  const leftY = (i: number) => (i === current ? "0%" : i < current ? "-100%" : "100%");
  const rightY = (i: number) => (i === current ? "0%" : i < current ? "100%" : "-100%");

  const transition = "transform 1000ms cubic-bezier(0.77, 0, 0.175, 1)";

  return (
    <section ref={root} aria-label="Professional mission" className="relative w-full bg-white text-black md:h-[100svh] md:overflow-hidden">
      {/* Phones: flip-book */}
      <div className="md:hidden py-20">
        <MissionBook pages={pages} />
      </div>

      {/* Tablet & desktop: split-screen scroll */}
      <div className="hidden md:block">
        <div className="absolute inset-0 flex flex-col md:flex-row">
          {/* Left / top half */}
          <div className="relative h-1/2 md:h-full w-full md:w-1/2 overflow-hidden md:border-r-2 md:border-black border-b-2 md:border-b-0 border-black">
            {pages.map((p, i) => (
              <div
                key={`l-${i}`}
                className="absolute inset-0"
                style={{ transform: `translateY(${leftY(i)})`, transition }}
                aria-hidden={i !== current}
              >
                <Panel {...p.left} />
              </div>
            ))}
          </div>

          {/* Right / bottom half */}
          <div className="relative h-1/2 md:h-full w-full md:w-1/2 overflow-hidden">
            {pages.map((p, i) => (
              <div
                key={`r-${i}`}
                className="absolute inset-0"
                style={{ transform: `translateY(${rightY(i)})`, transition }}
                aria-hidden={i !== current}
              >
                <Panel {...p.right} />
              </div>
            ))}
          </div>
        </div>

        {/* Page indicator */}
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
          {pages.map((_, i) => (
            <span
              key={i}
              className={`block w-2 rounded-full border border-black transition-all duration-500 ${
                i === current ? "h-8 bg-[#CCFF00]" : "h-2 bg-white"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <div
          className="absolute left-4 md:left-6 bottom-4 md:bottom-6 z-10 text-xs font-black tracking-widest bg-white border-2 border-black rounded-full px-3 py-1"
        >
          {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}