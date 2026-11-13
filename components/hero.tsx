"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SketchArrow from "@/components/sketch-arrow";

gsap.registerPlugin(useGSAP);

// --- Brand colours ---
const LIME = "#CCFF00";
const INK = "#0A0A0A";

// 3D extruded text shadow
const extrude = (color: string, depth = 14) =>
  Array.from({ length: depth }, (_, i) => `${i + 1}px ${i + 1}px 0 ${color}`).join(", ");

// --- Hand-drawn accents ---
const ArrowLimeLeft = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g stroke={INK} strokeWidth="10">
      <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
      <path d="M80,55 L95,70 L85,85" />
    </g>
    <g stroke={LIME} strokeWidth="6">
      <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
      <path d="M80,55 L95,70 L85,85" />
    </g>
  </svg>
);

const ArrowLimeRight = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g stroke={INK} strokeWidth="10">
      <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
      <path d="M65,75 L50,80 L55,65" />
    </g>
    <g stroke={LIME} strokeWidth="6">
      <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
      <path d="M65,75 L50,80 L55,65" />
    </g>
  </svg>
);

const ArrowInk = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-black stroke-current overflow-visible" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
);

const CircularBadge = () => (
  <a
    href="#contact"
    className="relative w-28 h-28 md:w-36 md:h-36 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-xl rotate-12 hover:scale-105 transition-transform cursor-pointer border-[3px] border-black"
  >
    <div className="absolute inset-1 animate-[spin_10s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path id="eqBadgePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
        <text className="text-[10.5px] font-black tracking-[0.16em] uppercase" fill="black">
          <textPath
  href="#eqBadgePath"
  startOffset="0"
  textLength="222"
  lengthAdjust="spacing"
>
  LET&apos;S WORK TOGETHER •
</textPath>
        </text>
      </svg>
    </div>
    <svg viewBox="0 0 100 100" className="w-10 h-10 text-black stroke-current overflow-visible" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20,80 Q 40,50 30,30 T 80,20" />
      <path d="M60,10 L80,20 L70,40" />
    </svg>
  </a>
);

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Intro: words rise in one after another
      gsap.from(".hero-word", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.15,
      });

      // Accents pop in
      gsap.from(".hero-pop", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.1,
        delay: 0.6,
      });

      // Floating cards (replaces the motion.div animation)
      gsap.to(".float-a", { y: -15, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".float-b", { y: -20, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 });
    },
    { scope: root }
  );

  const nav = ["About", "Experience", "Training", "Contact"];

  return (
    <div
      ref={root}
      className="min-h-[100svh] bg-white text-black flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black relative overflow-hidden w-full"
    >
      

            {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10 md:py-8 max-w-[1440px] mx-auto w-full">
        <a href="#" className="flex items-center gap-1">
          <div className="bg-black text-white font-black tracking-tight text-xs md:text-sm px-3 py-1.5 rounded-2xl rounded-bl-sm relative">
            EMMANUEL
            <div className="absolute -bottom-1.5 left-0 w-3 h-3 bg-black" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
          </div>
          <div className="bg-[#CCFF00] text-black font-black text-xs md:text-sm px-3 py-1.5 rounded-full border-[1.5px] border-black">
            QUANSAH
          </div>
        </a>

        <div className="hidden md:flex items-center space-x-2">
          {nav.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-1.5 rounded-full border border-black/20 text-xs font-semibold hover:bg-black hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="/EQ_CV.pdf"
          download
          aria-label="Download CV"
          className="px-6 py-2 rounded-full border border-black text-xs md:text-sm font-semibold hover:bg-black hover:text-white transition-colors"
        >
          <span className="hidden sm:inline">Download </span>CV
        </a>
      </nav>

      {/* Mobile nav: swipeable chips */}
      <div className="md:hidden relative z-20 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {nav.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="shrink-0 px-4 py-1.5 rounded-full border border-black/20 text-xs font-semibold active:bg-black active:text-white"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Hero */}
      <main className="flex-1 relative z-10 pt-6 pb-24 md:pt-12 md:pb-48 px-4 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto">
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center z-10 mt-4 mb-16">
          <div className="w-full flex flex-col items-center relative z-10 space-y-2 md:space-y-4">
            {/* HEAD */}
            <div className="w-full flex justify-start pl-[6%] md:pl-[25%] relative z-30 overflow-hidden">
              <h1
                className="hero-word text-[clamp(3.25rem,16vw,160px)] md:text-[clamp(4.5rem,12vw,160px)] font-black leading-[0.85] tracking-tighter text-[#CCFF00] uppercase"
                style={{ fontFamily: '"Arial Black", Impact, sans-serif', textShadow: extrude(INK) }}
              >
                #HEAD
              </h1>
            </div>

            {/* HEART */}
            <div className="w-full flex justify-center relative z-20 overflow-hidden">
              <h1
                className="hero-word text-[clamp(3.75rem,20vw,220px)] md:text-[clamp(5rem,15vw,220px)] font-black leading-[0.85] tracking-tighter text-black uppercase"
                style={{ fontFamily: '"Arial Black", Impact, sans-serif', textShadow: extrude(LIME) }}
              >
                HEART
              </h1>
            </div>

            {/* HAND */}
            <div className="w-full flex justify-start pl-[14%] md:pl-[30%] relative z-10 overflow-hidden">
              <h1
                className="hero-word text-[clamp(3.25rem,16vw,160px)] md:text-[clamp(4.5rem,12vw,160px)] font-black leading-[0.85] tracking-tighter text-black uppercase"
                style={{ fontFamily: '"Arial Black", Impact, sans-serif', textShadow: extrude(LIME) }}
              >
                HAND
              </h1>
            </div>
          </div>

          {/* Overlays: a row under the words on mobile, floating on desktop */}
          <div className="relative mt-12 flex justify-center gap-4 w-full pointer-events-none md:mt-0 md:block md:absolute md:inset-0 md:h-full">
            {/* Card 1: bottom left (photo) */}
            <div className="float-a relative md:absolute md:bottom-[10%] md:left-[20%] z-30 pointer-events-auto">
              <div className="w-[38vw] max-w-40 md:w-52 md:max-w-none aspect-[3/3.5] bg-white/60 backdrop-blur-md border border-black/10 rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-5 flex flex-col items-center justify-center rotate-[-12deg] shadow-2xl hover:rotate-0 transition-transform duration-500">
                <div className="relative w-14 h-14 md:w-24 md:h-24 bg-[#CCFF00] rounded-full mb-2 md:mb-4 border-[3px] border-black overflow-hidden">
                  <Image src="/emmanuel.jpg" alt="Emmanuel Quansah" fill sizes="96px" className="object-cover" />
                </div>
                <div className="text-center mt-2">
                  <p className="font-bold text-sm md:text-lg">Emmanuel Quansah</p>
                  <p className="text-[10px] md:text-xs text-black/60 mt-1">RN · NMC UK</p>
                </div>
              </div>
            </div>

            {/* Card 2: top right (stat) */}
            <div className="float-b relative mt-8 md:mt-0 md:absolute md:top-[15%] md:right-[22%] z-30 pointer-events-auto">
              <div className="w-[38vw] max-w-40 md:w-52 md:max-w-none aspect-[3/3.5] bg-white/60 backdrop-blur-md border border-black/10 rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-5 flex flex-col items-center justify-center rotate-[12deg] shadow-2xl hover:rotate-0 transition-transform duration-500">
                <div className="relative mb-2 md:mb-4">
                  <div className="relative w-14 h-14 md:w-24 md:h-24 bg-white rounded-full border-[3px] border-black overflow-hidden">
                    <Image
                      src="/illustrations/nurses.png"
                      alt="Illustration of Emmanuel celebrating with student nurses"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  {/* 500+ badge */}
                  <div className="absolute -bottom-2 -right-3 bg-black text-[#CCFF00] font-black text-xs md:text-sm px-2.5 py-1 rounded-full border-2 border-white shadow-md rotate-[-8deg]">
                    500+
                  </div>
                </div>
                <div className="text-center mt-2">
                  <p className="font-bold text-sm md:text-lg">Nurses trained</p>
                  <p className="text-[10px] md:text-xs text-black/60 mt-1">UK &amp; Ghana</p>
                </div>
              </div>
            </div>

            <div className="hero-pop hidden md:block absolute bottom-[0%] left-[0%] md:left-[10%] w-24 h-24 md:w-32 md:h-32 z-20">
              <ArrowLimeLeft />
            </div>

            <div className="hero-pop hidden md:block absolute top-[5%] right-[0%] md:right-[10%] w-24 h-24 md:w-32 md:h-32 z-20">
              <ArrowLimeRight />
            </div>

            <div className="hero-pop absolute -bottom-20 right-0 md:bottom-[-10%] md:right-[15%] z-40 pointer-events-auto">
              <CircularBadge />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom: Head / Heart / Hand */}
      <section
       
        className="bg-[#F4F4F0] rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-6 py-12 md:px-10 md:py-16 relative z-20 border-t border-black/10 mt-auto w-full"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* HEAD */}
          <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-black/5">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black">
              HEAD<br />KNOWLEDGE
            </h3>
            <p className="text-[10px] md:text-xs text-black/60 font-bold mb-auto">
              Clinical training &amp; mentorship
            </p>
            <div className="relative w-full flex justify-center mt-6">
              <div className="flex items-center bg-black rounded-2xl p-2 pr-16 text-white shadow-lg relative z-10">
                <div className="w-8 h-8 bg-[#CCFF00] text-black rounded-full mr-3 flex items-center justify-center font-black text-[10px] flex-shrink-0">
                  TC
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold leading-none">TopCare</p>
                  <p className="text-[8px] text-white/70 leading-none mt-1">Team Lead, Clinical Trainer</p>
                </div>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#CCFF00] text-black font-black text-[10px] px-3 py-2 rounded-xl z-20 shadow-md border border-black">
                               2024 <SketchArrow shape="dash" weight={2.6} className="inline-block w-4 h-3 ml-0.5 align-middle" />
              </div>
            </div>
            <div className="hidden md:block absolute -right-12 bottom-8 w-16 h-16 z-30">
              <ArrowInk />
            </div>
          </div>

          {/* HEART */}
          <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-black/5">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black">
              HEART<br />COMPASSION
            </h3>
            <p className="text-[10px] md:text-xs text-black/60 font-bold mb-auto">
              Holistic, person-centred care
            </p>
            <div className="relative w-full flex justify-center mt-6">
              <div className="flex items-center bg-black rounded-full p-1.5 text-white shadow-lg">
                <div className="bg-white/15 font-bold text-sm px-4 py-2 rounded-full mr-2">14+</div>
                <div className="font-bold text-xs px-4">Years in care</div>
              </div>
              <div className="absolute -bottom-6 right-1/3 bg-[#CCFF00] rounded-full p-2.5 shadow-lg rotate-12 z-20 border border-black">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-black stroke-current" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>
            <div className="hidden md:block absolute -right-12 bottom-8 w-16 h-16 z-30">
              <ArrowInk />
            </div>
          </div>

          {/* HAND */}
          <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-black/5">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black">
              HAND<br />PRACTICAL SKILL
            </h3>
            <p className="text-[10px] md:text-xs text-black/60 font-bold mb-auto">
              Certified &lsquo;Train the Trainer&rsquo;
            </p>
            <div className="flex flex-col items-center bg-[#CCFF00] rounded-[2rem] px-6 py-4 text-black shadow-lg mt-6 relative w-full max-w-[200px] border border-black">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1">Registered Nurse</p>
              <p className="text-xl font-black">NMC UK</p>
              <div className="absolute -bottom-2 left-8 w-5 h-5 bg-[#CCFF00] rotate-45 border-r border-b border-black" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}