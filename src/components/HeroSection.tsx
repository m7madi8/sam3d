"use client";

import Image from "next/image";
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/components/site/LanguageProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IMAGE_QUALITY, IMAGE_SIZES } from "@/lib/imageConfig";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface HeroProps {
  discipline: string;
  imageSrc: string;
  imageAlt: string;
  /** When false, hero stays hidden until loader finishes. Defaults to true. */
  introReady?: boolean;
}

function primeScrollTargets(root: HTMLElement) {
  const zoom = root.querySelector<HTMLElement>("[data-hero-scroll='zoom']");
  const motto = root.querySelector<HTMLElement>("[data-hero-scroll='motto']");
  const hint = root.querySelector<HTMLElement>("[data-hero-scroll='hint']");
  const words = root.querySelectorAll<HTMLElement>("[data-hero-scroll='word']");

  if (!zoom || !motto || !hint) return null;

  gsap.set(zoom, { scale: 1, force3D: true });
  gsap.set(motto, {
    scale: 1,
    z: 0,
    y: 0,
    rotationX: 0,
    autoAlpha: 1,
    transformPerspective: 1400,
    transformOrigin: "50% 50%",
    force3D: true,
  });
  gsap.set(words, { z: 0, rotationY: 0, y: 0, force3D: true });
  gsap.set(hint, { autoAlpha: 1, y: 0 });

  return { zoom, motto, hint, words };
}

export const HeroSection = forwardRef<HTMLElement, HeroProps>(function HeroSection(
  { discipline, imageSrc, imageAlt, introReady = true },
  ref,
) {
  const { tr } = useLanguage();
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const introPlayedRef = useRef(false);
  const [scrollReady, setScrollReady] = useState(false);
  const mottoWords = discipline.split(/\s+/).filter(Boolean);

  const setRefs = (node: HTMLElement | null) => {
    heroRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const pendingIntro = !introReady && !reducedMotion;

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root || reducedMotion || introReady) return;

    gsap.set(root.querySelector("[data-hero-intro='bg']"), { autoAlpha: 0 });
    gsap.set(root.querySelector("[data-hero-intro='zoom']"), { scale: 1.06 });
    gsap.set(root.querySelector("[data-hero-scroll='motto']"), { autoAlpha: 0, y: 28 });
    gsap.set(root.querySelector("[data-hero-intro='hint']"), { autoAlpha: 0, y: 12 });
  }, [introReady, reducedMotion]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || !introReady || introPlayedRef.current) return;

    introPlayedRef.current = true;

    if (reducedMotion) {
      gsap.set(root.querySelectorAll("[data-hero-intro]"), { clearProps: "all" });
      primeScrollTargets(root);
      const id = requestAnimationFrame(() => setScrollReady(true));
      return () => cancelAnimationFrame(id);
    }

    const ctx = gsap.context(() => {
      const bg = root.querySelector("[data-hero-intro='bg']");
      const zoom = root.querySelector("[data-hero-intro='zoom']");
      const motto = root.querySelector("[data-hero-scroll='motto']");
      const hint = root.querySelector("[data-hero-intro='hint']");

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.08,
        onComplete: () => {
          primeScrollTargets(root);
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            setScrollReady(true);
          });
        },
      });

      tl.to(bg, { autoAlpha: 1, duration: 1.2 }, 0);
      tl.to(zoom, { scale: 1, duration: 1.8, ease: "power2.out" }, 0);
      tl.to(motto, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.35);
      tl.to(hint, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.72);
    }, root);

    return () => ctx.revert();
  }, [introReady, reducedMotion]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || !scrollReady || reducedMotion) return;

    const targets = primeScrollTargets(root);
    if (!targets) return;

    const { zoom, motto, hint, words } = targets;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const scrollSpan = viewportHeight * (isMobile ? 1.28 : 1.1);
    const zoomScale = isMobile ? 1.22 : 1.34;
    const mottoEnd = {
      scale: isMobile ? 5.45 : 7.15,
      z: isMobile ? 620 : 980,
      y: isMobile ? "-4vh" : "-6vh",
      rotationX: isMobile ? -22 : -28,
      autoAlpha: 0,
      transformPerspective: 1400,
      force3D: true,
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none", overwrite: "auto" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${scrollSpan}`,
          pin: true,
          pinSpacing: true,
          pinReparent: isMobile,
          scrub: isMobile ? 0.9 : 1.05,
          anticipatePin: isMobile ? 0 : 0.35,
          refreshPriority: 20,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(hint, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 12, duration: 0.08 }, 0);
      tl.fromTo(
        motto,
        {
          scale: 1,
          z: 0,
          y: 0,
          rotationX: 0,
          autoAlpha: 1,
          transformPerspective: 1400,
          force3D: true,
        },
        { ...mottoEnd, duration: 1, ease: "power1.inOut" },
        0,
      );

      if (words.length) {
        tl.fromTo(
          words,
          { z: 0, rotationY: 0, force3D: true },
          {
            z: (index) => (index - (words.length - 1) / 2) * (isMobile ? 44 : 66),
            rotationY: (index) => (index - (words.length - 1) / 2) * (isMobile ? 4 : 6),
            duration: 1,
            force3D: true,
          },
          0,
        );
      }

      tl.fromTo(zoom, { scale: 1 }, { scale: zoomScale, duration: 1, ease: "power1.inOut" }, 0);
    }, root);

    return () => {
      ctx.revert();
    };
  }, [scrollReady, reducedMotion]);

  return (
    <section
      id="hero"
      ref={setRefs}
      className={styles.hero}
      data-intro-pending={pendingIntro || undefined}
      aria-label="Introduction"
    >
      <div className={styles.shell}>
        <div className={styles.bg} data-hero-intro="bg" aria-hidden="true">
          <div className={styles.bgZoom} data-hero-intro="zoom" data-hero-scroll="zoom">
            <Image
              src={imageSrc}
              alt=""
              fill
              priority
              sizes={IMAGE_SIZES.fullViewport}
              quality={IMAGE_QUALITY.hero}
              className={styles.bgImage}
            />
          </div>
        </div>

        <h1 className={styles.motto} data-hero-scroll="motto" data-title={discipline}>
          {mottoWords.map((word, index) => (
            <span key={`${word}-${index}`} className={styles.mottoWord} data-hero-scroll="word">
              {word}
            </span>
          ))}
        </h1>
        <span className={styles.srOnly}>{imageAlt}</span>
      </div>

      <div className={styles.scrollHint} data-hero-intro="hint" data-hero-scroll="hint" aria-hidden="true">
        <span className={styles.scrollHintText}>{tr("Scroll", "مرّر")}</span>
        <span className={styles.scrollHintLine} />
      </div>
    </section>
  );
});
