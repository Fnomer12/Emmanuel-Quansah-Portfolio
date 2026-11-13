"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode, type Ref } from "react";
import Image from "next/image";
import SketchArrow from "@/components/sketch-arrow";
import HTMLFlipBookRaw from "react-pageflip";
import type { Page } from "./mission";

/* react-pageflip's own types ask for every setting, so we loosen them here */
type FlipApi = { pageFlip: () => { flipNext: () => void; flipPrev: () => void } };
const HTMLFlipBook = HTMLFlipBookRaw as unknown as ComponentType<
  Record<string, unknown> & { children: ReactNode; ref?: Ref<FlipApi> }
>;

const BLACK_FONT = '"Arial Black", Impact, sans-serif';

export default function MissionBook({ pages }: { pages: Page[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const book = useRef<FlipApi>(null);
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);

  // Size the book to the phone screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setWidth(Math.min(Math.floor(el.clientWidth), 420));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = Math.round(width * 1.55);
  const total = pages.length + 2; // cover + pages + back cover

  return (
    <div className="px-6">
      <div ref={wrap} className="w-full max-w-[420px] mx-auto">
        {width > 0 && (
          <HTMLFlipBook
            key={width}
            ref={book}
            width={width}
            height={height}
            size="fixed"
            showCover
            usePortrait
            drawShadow
            maxShadowOpacity={0.5}
            flippingTime={800}
            mobileScrollSupport
            onFlip={(e: { data: number }) => setPage(e.data)}
            className="mx-auto"
            style={{}}
          >
            {/* Front cover */}
            <div className="bg-black text-white overflow-hidden">
              <div className="relative h-full flex flex-col justify-between items-center text-center p-7 border-l-8 border-[#CCFF00]">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#CCFF00]">Professional mission</p>
                <div>
                  <h2 className="text-5xl leading-[0.9] tracking-tight" style={{ fontFamily: BLACK_FONT }}>
                    <span className="text-[#CCFF00]">Head.</span>
                    <br />
                    Heart.
                    <br />
                    <span className="text-[#CCFF00]">Hand.</span>
                  </h2>
                  <p className="mt-6 text-sm text-white/60 max-w-[16rem] mx-auto">
                    The commitments that shape how I nurse, teach and lead.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <p className="font-black">
                    Emmanuel Quansah
                    <span className="block text-xs font-semibold text-white/50">RN · NMC UK</span>
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black bg-[#CCFF00] text-black rounded-full px-3 py-1.5">
                    Swipe <SketchArrow shape="dash" weight={2.6} className="w-5 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* One page per mission spread: picture on top, words below */}
            {pages.map((p, i) => {
              const pic = p.left.image ? p.left : p.right;
              const text = p.left.text ?? p.right.text;
              return (
                <div key={i} className="bg-white text-black overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Picture */}
                    <div className="relative h-[42%] shrink-0 bg-[#FAFAF5] border-b-2 border-black">
                      {pic.image && (
                        <Image src={pic.image} alt={pic.alt ?? ""} fill sizes="420px" className="object-contain p-3" />
                      )}
                    </div>

                    {/* Words: centred top-to-bottom, aligned left */}
                    {text && (
                      <div className="flex-1 flex flex-col justify-center px-6 py-4">
                        {text.eyebrow && (
                          <p className="text-xs font-black uppercase tracking-[0.25em] text-black">{text.eyebrow}</p>
                        )}
                        <h3 className="mt-2 text-[1.45rem] leading-[1.05] tracking-tight" style={{ fontFamily: BLACK_FONT }}>
                          {text.heading}
                        </h3>
                        <p className="mt-3 text-[14px] leading-snug text-black/85">{text.body}</p>

                        {text.values && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {text.values.map((v) => (
                              <span key={v} className="text-xs font-black bg-[#CCFF00] border-2 border-black rounded-full px-3 py-1">
                                {v}
                              </span>
                            ))}
                          </div>
                        )}

                        {text.signature && (
                          <div className="mt-5 flex items-center gap-3">
                            <span className="h-[2px] w-8 bg-black" />
                            <div>
                              <p className="font-black text-sm">Emmanuel Quansah</p>
                              <p className="text-xs text-black/70">RN (NMC UK) · Team Lead &amp; Clinical Trainer</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Back cover */}
            <div className="bg-[#CCFF00] text-black overflow-hidden">
              <div className="h-full flex flex-col justify-center items-center text-center p-8">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-black/60">Share the mission?</p>
                <h3 className="mt-4 text-4xl font-black tracking-tight leading-[0.95]">Let&apos;s work together.</h3>
                <a
                  href="#contact"
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-black text-white pl-5 pr-1.5 py-1.5 font-semibold"
                >
                  Get in touch
                  <span className="w-9 h-9 rounded-full bg-[#CCFF00] text-black flex items-center justify-center">
                    <SketchArrow shape="dash" weight={2.4} className="w-6 h-6" />
                  </span>
                </a>
              </div>
            </div>
          </HTMLFlipBook>
        )}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => book.current?.pageFlip().flipPrev()}
          disabled={page === 0}
          className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center font-black disabled:opacity-25"
        >
          <SketchArrow shape="dash" flip color="currentColor" weight={2.4} className="w-6 h-6" />
        </button>
        <span className="text-xs font-black tracking-[0.2em] min-w-[64px] text-center">
          {String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => book.current?.pageFlip().flipNext()}
          disabled={page >= total - 1}
          className="w-11 h-11 rounded-full bg-black text-[#CCFF00] flex items-center justify-center font-black disabled:opacity-25"
        >
          <SketchArrow shape="dash" color="currentColor" weight={2.4} className="w-6 h-6" />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-black/40">Swipe or tap the arrows to turn the page</p>
    </div>
  );
}