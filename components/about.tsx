"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const title = "Care that starts with the Head, Heart & Hand";
const highlightedText = "Head, Heart & Hand";

const paragraphs = [
  "I'm Emmanuel Quansah, a Registered Nurse (NMC UK) and Team Lead & Clinical Trainer at TopCare, Isle of Man.",
  "Guided by the 3H approach (knowledge, compassion and practical skill), I've gone from nursing in Ghana to training care teams in the UK.",
  "I lead with integrity and service, championing dignity and fair care for everyone.",
];

// Spinning lime doodle (replaces the external icon)
const SparkDoodle = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="50" cy="50" r="14" fill="#CCFF00" stroke="#0A0A0A" strokeWidth="5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <line
        key={deg}
        x1="50" y1="22" x2="50" y2="8"
        stroke="#0A0A0A" strokeWidth="6"
        transform={`rotate(${deg} 50 50)`}
      />
    ))}
  </svg>
);

export default function About() {
  const root = useRef<HTMLElement>(null);
  const titleParts = title.split(new RegExp(`(${highlightedText})`, "gi"));

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      tl.from(".about-title", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" })
        .fromTo(
          ".about-circle",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
          "-=0.3"
        )
        .from(".about-para", { y: 24, opacity: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }, "-=0.8")
        .from(".about-image", { x: 60, opacity: 0, rotate: 4, duration: 1, ease: "power3.out" }, 0.2)
        .from(".about-icon", { scale: 0, duration: 0.6, ease: "back.out(2)" }, "-=0.4");
    },
    { scope: root }
  );

  return (
    <section
      id="about"
      ref={root}
      className="w-full bg-white text-black py-20 md:py-32 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Text */}
        <div className="flex flex-col gap-6 text-left">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50">About me</p>

          <h2 className="about-title text-[1.85rem] sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            {titleParts.map((part, i) =>
              part.toLowerCase() === highlightedText.toLowerCase() ? (
                <span key={i} className="relative inline-block whitespace-nowrap px-1">
                  <svg
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 w-[112%] h-[170%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    viewBox="0 0 200 60"
                    preserveAspectRatio="none"
                  >
                    <path
                      className="about-circle"
                      d="M12,32 C18,6 182,4 190,28 C196,52 30,58 14,38 C8,30 20,18 40,14"
                      pathLength={1}
                      strokeDasharray="1"
                      stroke="#CCFF00"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="relative">{part}</span>
                </span>
              ) : (
                part
              )
            )}
          </h2>

          <div className="flex flex-col gap-4 text-base md:text-lg text-black/70 leading-relaxed">
            {paragraphs.map((text, i) => (
              <p key={i} className="about-para">{text}</p>
            ))}
          </div>
        </div>

        {/* Illustration */}
        <div className="relative flex justify-center items-center">
          <div className="about-icon absolute top-0 right-2 md:right-8 w-14 h-14 md:w-16 md:h-16 z-10">
            <div className="w-full h-full animate-[spin_8s_linear_infinite]">
              <SparkDoodle />
            </div>
          </div>

          <div className="about-image relative w-full max-w-md aspect-square">
            <Image
              src="/illustrations/emmanuel.png"
              alt="Illustration of Emmanuel Quansah in lime green scrubs with a stethoscope"
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-contain"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}