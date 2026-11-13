"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// Phones: don't recalculate every pinned section when the address bar hides/shows
ScrollTrigger.config({ ignoreMobileResize: true });

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    /* ---- Always start at the top (the hero) ---- */
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    ScrollTrigger.clearScrollMemory("manual");

    // Drop a leftover #section from the address bar so a reload doesn't jump there
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);

    // Safari/iOS sometimes restore anyway, so reset just before leaving too
    const toTop = () => window.scrollTo(0, 0);
    window.addEventListener("beforeunload", toTop);

    /* ---- Smooth scrolling ---- */
    const lenis = new Lenis({
      lerp: 0.07,            // lower = smoother/slower glide (0.05–0.1)
      wheelMultiplier: 0.8,  // lower = each scroll moves less
      smoothWheel: true,
      anchors: true,         // navbar #links scroll smoothly
    });
    lenis.scrollTo(0, { immediate: true });

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("beforeunload", toTop);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}