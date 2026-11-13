"use client";

import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Caveat } from "next/font/google";
import SketchArrow from "@/components/sketch-arrow";

const marker = Caveat({ subsets: ["latin"], weight: ["700"] });

/* ---------------- Types ---------------- */

type StickerShape = "heart" | "smiley" | "bolt" | "daisy" | "star";
type StickerText = { kind: "burst" | "bubble"; text: string };
export type Sticker = StickerShape | StickerText;

type SocialKind = "linkedin" | "instagram" | "tiktok" | "x" | "youtube" | "dribbble";

export type StickerSlapFooterProps = {
  wordmark?: string;
  homeHref?: string;
  navLabel?: string;
  navHref?: string;
  paper?: string;
  panel?: string;
  ink?: string;
  cream?: string;
  accent?: string;
  fontSans?: string;
  jobsLabel?: string;
  jobs?: { title: string; href: string }[];
  officeLabel?: string;
  address?: string[];
  mapLabel?: string;
  mapHref?: string;
  contactLabel?: string;
  email?: string;
  copiedLabel?: string;
  chatHref?: string;
  chatLabel?: string;
  note?: string;
  socials?: { kind: SocialKind; href: string }[];
  stickers?: Sticker[];
  credits?: { role: string; name: string }[];
  height?: string;
  wordmarkMaxHeight?: string;
};

/* ---------------- Sticker art ---------------- */

const C = { orange: "#FF6B35", blue: "#3B82F6", pink: "#FF5CA8", yellow: "#FFD23F", ink: "#0A0A0A" };

function StickerArt({ s }: { s: Sticker }) {
  if (typeof s === "object") {
    if (s.kind === "burst") {
      const pts = Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r = i % 2 ? 34 : 48;
        return `${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`;
      }).join(" ");
      return (
        <>
          <polygon points={pts} fill={C.orange} />
          <text x="50" y="58" textAnchor="middle" fontSize="26" fontWeight="900" fill={C.ink} style={{ textTransform: "uppercase" }}>
            {s.text}
          </text>
        </>
      );
    }
    return (
      <>
        <path d="M14 18 H86 Q94 18 94 26 V62 Q94 70 86 70 H44 L26 88 L30 70 H14 Q6 70 6 62 V26 Q6 18 14 18 Z" fill={C.blue} />
        <text x="50" y="52" textAnchor="middle" fontSize="24" fontWeight="900" fill="#fff">
          {s.text}
        </text>
      </>
    );
  }
  switch (s) {
    case "heart":
      return <path d="M50 88 C20 66 6 48 6 32 A22 22 0 0 1 50 22 A22 22 0 0 1 94 32 C94 48 80 66 50 88 Z" fill={C.pink} />;
    case "smiley":
      return (
        <>
          <circle cx="50" cy="50" r="42" fill={C.yellow} />
          <ellipse cx="36" cy="40" rx="5" ry="8" fill={C.ink} />
          <ellipse cx="64" cy="40" rx="5" ry="8" fill={C.ink} />
          <path d="M28 58 Q50 80 72 58" stroke={C.ink} strokeWidth="6" fill="none" strokeLinecap="round" />
        </>
      );
    case "bolt":
      return <polygon points="60,4 18,56 46,56 36,96 82,40 54,40 66,4" fill={C.orange} />;
    case "daisy":
      return (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx="50" cy="24" rx="12" ry="22" fill={C.blue} transform={`rotate(${i * 45} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="15" fill={C.yellow} />
        </>
      );
    case "star":
    default: {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
        const r = i % 2 ? 20 : 46;
        return `${(50 + Math.cos(a) * r).toFixed(2)},${(52 + Math.sin(a) * r).toFixed(2)}`;
      }).join(" ");
      return <polygon points={pts} fill={C.yellow} strokeLinejoin="round" />;
    }
  }
}

/* Where each sticker lands on the wordmark (percent of the wordmark box) */
const SPOTS = [
  { x: 4, y: 8, r: -14 },
  { x: 20, y: 58, r: 10 },
  { x: 40, y: 2, r: -6 },
  { x: 56, y: 60, r: 12 },
  { x: 72, y: 6, r: -10 },
  { x: 86, y: 52, r: 8 },
];

let topZ = 50; // last-grabbed sticker sits on top

function DraggableSticker({ s, i }: { s: Sticker; i: number }) {
  const spot = SPOTS[i % SPOTS.length];
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [z, setZ] = useState(10 + i);
  const start = useRef({ px: 0, py: 0, x: 0, y: 0 });

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
    setDragging(true);
    topZ += 1;
    setZ(topZ);
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPos({ x: start.current.x + e.clientX - start.current.px, y: start.current.y + e.clientY - start.current.py });
  };
  const onUp = () => setDragging(false);

  return (
    <div
      role="img"
      aria-label={typeof s === "object" ? `${s.kind} sticker: ${s.text}` : `${s} sticker`}
      title="drag me · double-click to reset"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onDoubleClick={() => setPos({ x: 0, y: 0 })}
      className="ssf-sticker absolute select-none"
      style={{
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        width: "clamp(56px, 8vw, 120px)",
        zIndex: z,
        touchAction: "none",
        cursor: dragging ? "grabbing" : "grab",
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${spot.r + (dragging ? 4 : 0)}deg) scale(${dragging ? 1.12 : 1})`,
        transition: dragging ? "none" : "transform 450ms cubic-bezier(.34,1.56,.64,1)",
        animationDelay: `${0.9 + i * 0.12}s`,
      }}
    >
      <svg viewBox="-14 -14 128 128" className="w-full h-auto overflow-visible pointer-events-none">
        <g filter="url(#ssf-diecut)" fontFamily="ui-sans-serif, system-ui, sans-serif">
          <StickerArt s={s} />
        </g>
      </svg>
    </div>
  );
}

/* ---------------- Footer ---------------- */

export default function StickerSlapFooter({
  wordmark = "studio",
  homeHref = "#",
  navLabel = "top",
  navHref = "#",
  paper = "#F3EEE3",
  panel = "#151515",
  ink = "#151515",
  cream = "#F3EEE3",
  accent = "#FF6B35",
  fontSans = "ui-sans-serif, system-ui, sans-serif",
  jobsLabel = "jobs",
  jobs = [],
  officeLabel = "office",
  address = [],
  mapLabel = "Google Maps",
  mapHref,
  contactLabel = "contact",
  email,
  copiedLabel = "copied!",
  chatHref,
  chatLabel = "let's chat",
  note,
  socials = [],
  stickers = ["heart", "smiley", "bolt", "daisy", "star"],
  credits = [],
  height = "100svh",
  wordmarkMaxHeight = "45svh",
}: StickerSlapFooterProps) {
  const wordRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const label = "text-xs uppercase tracking-[0.2em] mb-4 opacity-50";
  const link = "ssf-link relative inline-block w-fit";

  return (
    <footer style={{ background: paper, color: ink, fontFamily: fontSans }} className="w-full p-3 md:p-4">
      {/* Die-cut white border + soft shadow for every sticker */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="ssf-diecut" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="6" result="grow" />
          <feFlood floodColor="#ffffff" />
          <feComposite in2="grow" operator="in" result="outline" />
          <feGaussianBlur in="grow" stdDeviation="3" result="blur" />
          <feOffset in="blur" dy="5" result="drop" />
          <feComponentTransfer in="drop" result="shadow">
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      <div
        className="relative w-full rounded-[28px] md:rounded-[40px] overflow-hidden flex flex-col px-6 md:px-12 pt-8 md:pt-12 pb-6"
        style={{ background: panel, color: cream, minHeight: height }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between text-sm">
          <a href={homeHref} className={`${marker.className} text-3xl leading-none`} style={{ color: accent }}>
            {wordmark}
          </a>
          <a href={navHref} className={`${link} uppercase tracking-[0.2em] text-xs`}>
                        {navLabel} <SketchArrow shape="dash" rotate={-90} color="currentColor" weight={2.6} className="inline-block w-4 h-4 ml-1 align-middle" />
          </a>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mt-14 md:mt-20">
          <div>
            <p className={label}>{jobsLabel}</p>
            <ul className="space-y-2 text-lg md:text-xl">
              {jobs.map((j) => (
                <li key={j.title}>
                  <a href={j.href} className={link}>
                    {j.title} <SketchArrow shape="dash" color={accent} weight={2.2} className="inline-block w-8 h-4 ml-1 align-middle" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={label}>{officeLabel}</p>
            <address className="not-italic text-lg md:text-xl leading-snug">
              {address.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
            {mapHref && (
              <a href={mapHref} target="_blank" rel="noreferrer" className={`${link} mt-3 text-sm opacity-70`}>
                                {mapLabel} <SketchArrow color="currentColor" weight={2.6} className="inline-block w-4 h-4 ml-1 align-middle" />
              </a>
            )}
          </div>

          <div>
            <p className={label}>{contactLabel}</p>
            {email && (
              <button
                type="button"
                onClick={copyEmail}
                className={`${link} text-lg md:text-xl text-left break-all`}
                aria-live="polite"
              >
                {copied ? <span style={{ color: accent }}>{copiedLabel}</span> : email}
              </button>
            )}
            {chatHref && (
              <a
                href={chatHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: accent, color: panel }}
              >
                        {chatLabel} <SketchArrow color="currentColor" weight={2.6} className="w-4 h-4" />
              </a>
            )}
            {note && <p className="mt-5 text-sm opacity-50 max-w-xs">{note}</p>}
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.kind}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition-colors"
                    style={{ borderColor: `${cream}40` }}
                  >
                    {s.kind}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wordmark + stickers */}
        <div ref={wordRef} className="relative mt-auto pt-12">
          <svg
            key={run}
            viewBox="0 0 1000 300"
            className={`w-full h-auto cursor-pointer ${inView ? "ssf-play" : ""}`}
            style={{ maxHeight: wordmarkMaxHeight }}
            onClick={() => setRun((r) => r + 1)}
            role="img"
            aria-label={wordmark}
          >
            <defs>
              <mask id="ssf-write">
                <rect className="ssf-wipe" x="0" y="0" width="1000" height="300" fill="#fff" />
              </mask>
            </defs>
            <text
              x="500"
              y="235"
              textAnchor="middle"
              textLength="960"
              lengthAdjust="spacingAndGlyphs"
              fontSize="290"
              className={marker.className}
              fill={cream}
              stroke={cream}
              strokeWidth="2"
              mask="url(#ssf-write)"
            >
              {wordmark}
            </text>
          </svg>

          {inView && (
            <div className="absolute inset-0">
              {stickers.map((s, i) => (
                <DraggableSticker key={i} s={s} i={i} />
              ))}
            </div>
          )}
        </div>

               {/* Designer credit */}
        <p className="relative mt-4 flex justify-center md:justify-start text-xs uppercase tracking-[0.2em] opacity-70">
          Designed by&nbsp;<span style={{ color: accent }}>Sampson Adjei</span>
        </p>
      </div>

      <style>{`
        .ssf-link::after{content:"";position:absolute;left:0;bottom:-2px;height:1px;width:100%;
          background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .35s ease}
        .ssf-link:hover::after{transform:scaleX(1);transform-origin:left}
        .ssf-wipe{transform:scaleX(0);transform-box:fill-box;transform-origin:left center}
        .ssf-play .ssf-wipe{animation:ssf-write 1.6s cubic-bezier(.65,0,.35,1) forwards}
        @keyframes ssf-write{to{transform:scaleX(1)}}
        .ssf-sticker{animation:ssf-slap .5s cubic-bezier(.34,1.56,.64,1) both}
        @keyframes ssf-slap{from{opacity:0;scale:1.8}to{opacity:1;scale:1}}
        @media (prefers-reduced-motion: reduce){
          .ssf-wipe{transform:none}
          .ssf-play .ssf-wipe,.ssf-sticker{animation:none}
        }
      `}</style>
    </footer>
  );
}