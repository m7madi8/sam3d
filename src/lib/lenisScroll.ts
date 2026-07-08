"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
    __lenisStop?: () => void;
    __lenisStart?: () => void;
    __lenisScrollProxyBound?: boolean;
  }
}

const LENIS_OPTIONS = {
  duration: 1.5,
  easing: (t: number) => 1 - Math.pow(1 - t, 4),
  lerp: 0.075,
  smoothWheel: true,
  touchMultiplier: 1.1,
} as const;

export function bindLenisScrollTrigger(lenis: Lenis) {
  if (window.__lenisScrollProxyBound) return;

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

  ScrollTrigger.addEventListener("refresh", () => lenis.resize());

  window.__lenisScrollProxyBound = true;
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export function getOrCreateLenis(): { lenis: Lenis; ownsLenis: boolean } {
  if (window.__lenis) {
    bindLenisScrollTrigger(window.__lenis);
    return { lenis: window.__lenis, ownsLenis: false };
  }

  const lenis = new Lenis(LENIS_OPTIONS);
  bindLenisScrollTrigger(lenis);

  window.__lenis = lenis;
  window.__lenisStop = () => lenis.stop?.();
  window.__lenisStart = () => lenis.start?.();

  return { lenis, ownsLenis: true };
}

export function destroyOwnedLenis(lenis: Lenis, ownsLenis: boolean) {
  if (!ownsLenis) return;

  if (window.__lenis === lenis) {
    delete window.__lenis;
    delete window.__lenisStop;
    delete window.__lenisStart;
    delete window.__lenisScrollProxyBound;
  }

  lenis.destroy();
  ScrollTrigger.clearScrollMemory();
}
