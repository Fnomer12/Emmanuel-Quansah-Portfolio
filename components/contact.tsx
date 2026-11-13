"use client";

import { useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SketchArrow from "@/components/sketch-arrow";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ================= EDIT YOUR DETAILS HERE ================= */

const CONTACT = {
  email: "emmanuel@topcaregroup.im",
  phone: "+44 7624 377104",
  whatsapp: "447624377104", // digits only, for the wa.me link
  location: "Douglas, Isle of Man",
  cv: "/EQ_CV.pdf",
};

const TOPICS = ["Clinical training", "Mentoring", "Speaking", "Something else"];

/* ================= SMALL ICONS ================= */

const Icon = {
  mail: (
    <path d="M4 6h16v12H4z M4 7l8 6 8-6" strokeLinejoin="round" />
  ),
  phone: (
    <path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.1 6.1l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" strokeLinejoin="round" />
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  file: (
    <path d="M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6" strokeLinejoin="round" />
  ),
};

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-12 h-12 shrink-0 rounded-full bg-[#CCFF00] flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round">
        {children}
      </svg>
    </span>
  );
}

/* ================= LEFT: CONTACT INFO ================= */

function ContactInfo() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  const rows = [
    {
      icon: Icon.mail,
      label: "Email",
      action: (
        <button type="button" onClick={copy} className="text-left hover:underline underline-offset-4 decoration-[#CCFF00] decoration-2 break-all">
          {copied ? "Copied to clipboard ✓" : CONTACT.email}
        </button>
      ),
    },
    {
      icon: Icon.phone,
      label: "Phone / WhatsApp",
      action: (
        <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="hover:underline underline-offset-4 decoration-[#CCFF00] decoration-2">
          {CONTACT.phone}
        </a>
      ),
    },
    {
      icon: Icon.pin,
      label: "Based in",
      action: <span>{CONTACT.location}</span>,
    },
    {
      icon: Icon.file,
      label: "Curriculum vitae",
      action: (
        <a href={CONTACT.cv} target="_blank" rel="noreferrer" className="hover:underline underline-offset-4 decoration-[#CCFF00] decoration-2">
                    Download CV <SketchArrow shape="dash" rotate={90} color="currentColor" weight={2.6} className="inline-block w-5 h-5 align-middle" />
        </a>
      ),
    },
  ];

  return (
    <div>
      <p className="c-reveal inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-black/50">
        <svg viewBox="0 0 24 24" width={16} height={16} fill="none" strokeLinecap="round" aria-hidden="true">
          <circle cx="12.4" cy="11.6" r="8.6" fill="#CCFF00" />
          <circle cx="10" cy="13" r="0.7" fill="#0A0A0A" opacity="0.3" />
          <circle cx="13.5" cy="15" r="0.6" fill="#0A0A0A" opacity="0.3" />
          <circle cx="15" cy="11" r="0.5" fill="#0A0A0A" opacity="0.3" />
          <circle cx="12" cy="12" r="9" stroke="#0A0A0A" strokeWidth="1.2" />
          <path d="M4.6 9.5 A8.6 8.6 0 0 0 14.8 20.6" stroke="#0A0A0A" strokeWidth="2.6" />
          <path d="M13.8 5.4 A6.8 6.8 0 0 1 18.2 9.2" stroke="#FFFFFF" strokeWidth="1.4" />
        </svg>
        Open to opportunities
      </p>

      <h2 className="c-reveal mt-5 text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95]">
        Let&apos;s work{" "}
        <span className="relative inline-block">
          <span className="relative z-10">together</span>
          <span className="absolute left-0 right-0 bottom-1 md:bottom-2 h-3 md:h-5 bg-[#CCFF00] -z-0" />
        </span>
        .
      </h2>

      <p className="c-reveal mt-6 text-lg text-black/60 max-w-md leading-relaxed">
        Training a care team, mentoring student nurses or looking for a speaker? Send a message and I&apos;ll get back to
        you within two working days.
      </p>

      <ul className="mt-10 space-y-6">
        {rows.map((r) => (
          <li key={r.label} className="c-reveal flex items-center gap-4">
            <IconBubble>{r.icon}</IconBubble>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">{r.label}</p>
              <div className="text-lg font-medium">{r.action}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= RIGHT: CONTACT FORM ================= */

function ContactForm() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "");
    const from = String(f.get("email") ?? "");
    const message = String(f.get("message") ?? "");
    const subject = `${topic} enquiry from ${name}`;
    const body = `${message}\n\n— ${name}\n${from}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "w-full bg-transparent border-b-2 border-black/15 py-3 text-lg outline-none transition-colors placeholder:text-black/30 focus:border-black";

  return (
    <form onSubmit={submit} className="c-reveal relative rounded-[2rem] bg-[#F4F4F0] p-6 md:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-black/40 mb-3">I&apos;m interested in</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium border-2 transition-colors ${
              topic === t ? "bg-black text-[#CCFF00] border-black" : "border-black/15 hover:border-black"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <input name="name" required placeholder="Your name" className={field} autoComplete="name" />
        <input name="email" type="email" required placeholder="Your email" className={field} autoComplete="email" />
        <textarea name="message" required rows={4} placeholder="Tell me a little about it…" className={`${field} resize-none`} />
      </div>

      <button
        type="submit"
        className="group mt-10 w-full inline-flex items-center justify-between rounded-full bg-black text-white pl-7 pr-2 py-2 text-lg font-semibold transition-transform hover:-translate-y-0.5"
      >
        {sent ? "Opening your email app…" : "Send message"}
        <span className="w-11 h-11 rounded-full bg-[#CCFF00] text-black flex items-center justify-center transition-transform group-hover:rotate-[-45deg]">
                  <SketchArrow shape="dash" weight={2.4} className="w-7 h-7" />
        </span>
      </button>

      <p className="mt-4 text-xs text-black/40 text-center">
        This opens your email app with the message ready to send.
      </p>
    </form>
  );
}

/* ================= SECTION ================= */

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".c-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="contact" ref={root} className="w-full bg-white text-black py-24 md:py-32">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-6 mx-auto">
        <div className="grid grid-cols-12 items-center gap-y-12 md:gap-0">
          <div className="col-span-12 md:col-span-6">
            <ContactInfo />
          </div>
          <div className="hidden md:block col-span-1" />
          <div className="col-span-12 md:col-span-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}