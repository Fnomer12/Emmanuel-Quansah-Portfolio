"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HeartScene = dynamic(() => import("./heart-scene"), {
  ssr: false,
  loading: () => null,
});

const stages = [
  {
    word: "HEAD",
    title: "Knowledge",
    text: "Evidence-based clinical training, from infection control to medication safety, that gives every carer the 'why' behind the care.",
  },
  {
    word: "HEART",
    title: "Compassion",
    text: "Care that sees the whole person, meeting their physical, emotional, psychological and spiritual needs with dignity.",
  },
  {
    word: "HAND",
    title: "Practical skill",
    text: "Hands-on, certified 'Train the Trainer' teaching in moving & handling, first aid, CPI and medication administration.",
  },
];

export default function Centrepiece() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const stageRef = useRef(0);
  const [stage, setStage] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ".cp-pin",
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const next = Math.min(2, Math.floor(self.progress * 3));
          if (next !== stageRef.current) {
            stageRef.current = next;
            setStage(next);
          }
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="w-full bg-white text-black">
      <div className="cp-pin relative h-[100svh] w-full overflow-hidden">
        {/* Full-screen 3D layer: no edges to cut the model */}
              <div className="absolute inset-0 pointer-events-none">
          <HeartScene progress={progress} stage={stage} />
        </div>

        {/* Phones: one clean white fade, full width, so the text stays readable */}
        <div className="md:hidden absolute inset-x-0 bottom-0 h-[55%] z-[5] pointer-events-none bg-gradient-to-t from-white from-60% via-white/90 to-transparent" />

        {/* Text on top */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex items-end md:items-center pb-10 md:pb-0">
          <div className="w-full md:w-1/2">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50 mb-4">
              My philosophy · the 3H concept
            </p>

            <div className="relative h-[210px] md:h-[300px]">
              {stages.map((s, i) => (
                <div
                  key={s.word}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    i === stage ? "opacity-100 translate-y-0" : i < stage ? "opacity-0 -translate-y-8" : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2
                    className="font-black leading-[0.85] tracking-tighter"
                    style={{
                      fontFamily: '"Arial Black", Impact, sans-serif',
                      fontSize: "clamp(3rem, 9vw, 8rem)",
                      color: i === 1 ? "#0A0A0A" : "#CCFF00",
                      WebkitTextStroke: i === 1 ? undefined : "2px #0A0A0A",
                    }}
                  >
                    {s.word}
                  </h2>
                  <p className="mt-4 text-lg md:text-2xl font-black">{s.title}</p>
                  <p className="mt-2 text-sm md:text-lg text-black/65 max-w-md leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              {stages.map((s, i) => (
                <div key={s.word} className="flex-1 max-w-[90px]">
                  <div className={`h-1.5 rounded-full transition-colors duration-500 ${i <= stage ? "bg-black" : "bg-black/10"}`} />
                  <p className={`mt-2 text-[10px] font-black tracking-widest transition-colors ${i === stage ? "text-black" : "text-black/30"}`}>
                    {s.word}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}