"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: import("lenis").default;
    __lenisStop?: () => void;
    __lenisStart?: () => void;
  }
}

export function useLenisScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled || window.__lenis) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        lerp: 0.075,
        smoothWheel: true,
        touchMultiplier: 1.1,
      });

      ScrollTrigger.scrollerProxy(window, {
        scrollTop(value?: number) {
          if (typeof value === "number") {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: "fixed",
      });

      window.__lenis = lenis;
      window.__lenisStop = () => lenis.stop?.();
      window.__lenisStart = () => lenis.start?.();

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

      cleanup = () => {
        window.removeEventListener("resize", handleResize);
        window.cancelAnimationFrame(rafId);
        lenis.destroy();
        ScrollTrigger.clearScrollMemory();
        delete window.__lenis;
        delete window.__lenisStop;
        delete window.__lenisStart;
      };
    };

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => void boot(), { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(() => void boot(), 80);
    }

    return () => {
      cancelled = true;
      cleanup?.();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);
}
