"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SketchPin from "@/components/sketch-pin";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Role {
  year: string;
  dates: string;
  title: string;
  org: string;
  location: string;
  current?: boolean;
  points: string[];
  tags: string[];
}

const roles: Role[] = [
  {
    year: "2012",
    dates: "01/2012 – 12/2021",
    title: "Registered Nurse / Senior Nursing Officer",
    org: "Ghana Adventist Health Service",
    location: "Ghana",
    points: [
      "Nearly ten years of frontline nursing, progressing to Senior Nursing Officer",
      "Delivered and led patient-centred clinical care within multidisciplinary teams",
    ],
    tags: ["Clinical care", "Leadership", "Ghana"],
  },
  {
    year: "2018",
    dates: "10/2018 – 12/2020",
    title: "Voluntary Nurse",
    org: "Escuela Clinic",
    location: "Ghana",
    points: [
      "Primary healthcare: wound dressing, chronic disease management, maternal & child health",
      "Health screenings and education sessions for underserved communities",
      "Supported immunisation programmes and community outreach",
      "Worked with multidisciplinary teams on health promotion and disease prevention",
    ],
    tags: ["Community health", "Volunteer"],
  },
  {
    year: "2021",
    dates: "01/2021 – 12/2023",
    title: "Nurse Educator (Voluntary)",
    org: "SDA Nursing and Midwifery Training School",
    location: "Kumasi, Ghana",
    points: [
      "Taught and mentored student nurses at the school where I trained",
      "Brought the Head, Heart & Hand approach into nursing education",
    ],
    tags: ["Teaching", "Mentorship"],
  },
  {
    year: "2022",
    dates: "01/2022 – 06/2024",
    title: "Senior Health Care Assistant (Pre-Registered Nurse)",
    org: "Adorn Domiciliary Care, Salisbury Street Care Home",
    location: "Isle of Man",
    points: [
      "Senior care role while completing UK nursing registration",
      "Person-centred care for residents and clients at home",
    ],
    tags: ["Elderly care", "Domiciliary"],
  },
  {
    year: "2023",
    dates: "01/2023 – Present",
    title: "Voluntary Service",
    org: "St John Ambulance & British Red Cross",
    location: "Isle of Man",
    current: true,
    points: [
      "First aid response, training and public health education",
      "Community outreach supporting vulnerable individuals",
    ],
    tags: ["First aid", "Volunteer", "Outreach"],
  },
  {
    year: "2024",
    dates: "08/2024 – Present",
    title: "Team Lead, Clinical Trainer",
    org: "TopCare Nursing Agency",
    location: "Douglas, Isle of Man",
    current: true,
    points: [
      "Lead, supervise and train healthcare staff, including clinical and safety interventions",
      "Deliver mandatory training: infection control, safeguarding, medication, moving & handling",
      "Oversee and coordinate client care to ensure a high-quality, compliant service",
      "Conduct audits, monitor staff performance and promote CPD",
      "Maintain communication with clients, families and healthcare partners",
    ],
    tags: ["Team Lead", "Clinical training", "NMC UK"],
  },
  {
    year: "2024",
    dates: "10/2024 – 01/2025",
    title: "Learning Disabilities Unit",
    org: "Greenacres, ManxCare Agency Contract",
    location: "Isle of Man",
    points: [
      "Specialist care for individuals with learning disabilities",
      "Helped create and implement personalised care plans",
      "Supported residents emotionally and psychologically",
    ],
    tags: ["Learning disabilities", "Care planning"],
  },
];

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Lime progress line fills as you scroll
      gsap.fromTo(
        ".tl-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track.current,
            start: "top 40%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((item) => {
        // Dot turns lime when the line reaches it
        ScrollTrigger.create({
          trigger: item,
          start: "top 45%",
          toggleClass: { targets: item, className: "is-active" },
        });

        // Card slides in
        gsap.from(item.querySelector(".tl-card"), {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 80%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="experience" ref={root} className="w-full bg-white text-black font-sans md:px-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto pt-24 pb-10 px-4 md:px-8 lg:px-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50 mb-3">Experience</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] max-w-4xl">
          From Ghana to the{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-0 bottom-1 h-4 md:h-6 bg-[#CCFF00] -z-0" />
            <span className="relative">Isle of Man</span>
          </span>
        </h2>
        <p className="mt-4 text-black/60 text-base md:text-lg max-w-xl">
          Fourteen years of nursing, teaching and leading care teams. Here&apos;s the journey.
        </p>
      </div>

      {/* Timeline */}
      <div ref={track} className="relative max-w-7xl mx-auto pb-24">
        {roles.map((r, i) => (
          <div key={i} className="tl-item group flex justify-start pt-10 md:pt-32 md:gap-10">
            {/* Sticky year */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 w-10 absolute left-3 rounded-full bg-white flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 border border-neutral-300 transition-all duration-500 group-[.is-active]:bg-[#CCFF00] group-[.is-active]:border-black group-[.is-active]:scale-125" />
              </div>
              <h3
                className="hidden md:block md:pl-20 text-6xl font-black tracking-tighter text-neutral-300 transition-colors duration-500 group-[.is-active]:text-black"
                style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
              >
                {r.year}
              </h3>
            </div>

            {/* Card */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3
                className="md:hidden block text-3xl mb-4 font-black text-neutral-300 group-[.is-active]:text-black transition-colors"
                style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
              >
                {r.year}
              </h3>

              <div className="tl-card bg-[#FAFAF5] border border-black/10 rounded-[2rem] p-6 md:p-8 transition-shadow duration-500 group-[.is-active]:shadow-[6px_6px_0_#0A0A0A] group-[.is-active]:border-black">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black text-white">{r.dates}</span>
                  {r.current && (
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#CCFF00] border border-black">● Current</span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-black/60">
                    <SketchPin /> {r.location}
                  </span>
                </div>

                <h4 className="text-xl md:text-3xl font-black tracking-tight leading-tight">{r.title}</h4>
                <p className="text-sm md:text-base font-semibold text-black/60 mt-1 mb-5">{r.org}</p>

                <ul className="space-y-2 mb-6">
                  {r.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm md:text-base text-black/75 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {r.tags.map((t) => (
                    <span key={t} className="text-[11px] font-bold px-3 py-1 rounded-full border border-black/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Line */}
        <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-neutral-200 [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_95%,transparent_100%)]">
          <div className="tl-progress absolute inset-0 origin-top bg-gradient-to-b from-black via-black to-[#CCFF00] rounded-full" />
        </div>
      </div>
    </section>
  );
}