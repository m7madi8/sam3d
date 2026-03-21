"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollNarrativeOptions = {
  container: HTMLElement;
  panels: HTMLElement[];
  enabled: boolean;
};

export function createScrollNarrative({
  container,
  panels,
  enabled,
}: ScrollNarrativeOptions) {
  if (!enabled || panels.length < 2) {
    return () => undefined;
  }

  const timeline = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1.1,
      anticipatePin: 1,
      end: () => `+=${container.offsetWidth * (panels.length - 1)}`,
    },
  });

  panels.forEach((panel) => {
    const revealItems = panel.querySelectorAll("[data-reveal]");
    if (!revealItems.length) return;

    gsap.fromTo(
      revealItems,
      { y: 42, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.11,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: panel,
          start: "left center",
          containerAnimation: timeline,
        },
      },
    );
  });

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}
