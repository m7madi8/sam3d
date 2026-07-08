"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { destroyOwnedLenis, getOrCreateLenis } from "@/lib/lenisScroll";

export function useLenisScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const { lenis, ownsLenis } = getOrCreateLenis();

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(rafId);
      destroyOwnedLenis(lenis, ownsLenis);
    };
  }, []);
}
