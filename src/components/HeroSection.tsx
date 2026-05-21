"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IMAGE_QUALITY, IMAGE_SIZES } from "@/lib/imageConfig";
import styles from "./HeroSection.module.css";

export interface HeroStat {
  label: string;
  value: string;
  prefix?: string;
  display?: "numeric" | "phrase";
}

export interface HeroProps {
  brand: string;
  logoSrc: string | StaticImageData;
  logoAlt: string;
  discipline: string;
  /** Caption on the hero image; defaults to discipline when omitted. */
  imageCaption?: string;
  headline: string[];
  subline: string;
  ctaText: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  stats: HeroStat[];
  accentLineIndex?: number;
  /** When false, hero stays hidden until loader finishes. Defaults to true. */
  introReady?: boolean;
}

function HeadlineLine({
  line,
  accent,
}: {
  line: string;
  accent: boolean;
}) {
  const words = line.split(/\s+/).filter(Boolean);

  return (
    <span className={`${styles.headlineLine} ${accent ? styles.headlineAccent : ""}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className={styles.headlineWord} data-hero-intro="headline">
          {word}
        </span>
      ))}
    </span>
  );
}

export const HeroSection = forwardRef<HTMLElement, HeroProps>(function HeroSection(
  {
    brand,
    logoSrc,
    logoAlt,
    discipline,
    imageCaption,
    headline,
    subline,
    ctaText,
    ctaHref,
    imageSrc,
    imageAlt,
    stats,
    accentLineIndex = 1,
    introReady = true,
  },
  ref,
) {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const introPlayedRef = useRef(false);

  const setRefs = (node: HTMLElement | null) => {
    heroRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const ctaLabel = ctaText.replace(/\s*→\s*$/, "");
  const captionText = imageCaption ?? discipline;
  const pendingIntro = !introReady && !reducedMotion;

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root || reducedMotion || introReady) return;

    gsap.set(root.querySelector("[data-hero-intro='grid']"), { opacity: 0 });
    gsap.set(root.querySelector("[data-hero-intro='watermark']"), {
      autoAlpha: 0,
      y: 28,
    });
    gsap.set(root.querySelector("[data-hero-intro='logo']"), { autoAlpha: 0, y: -18 });
    gsap.set(root.querySelector("[data-hero-intro='rail']"), { autoAlpha: 0, y: 20 });
    gsap.set(root.querySelector("[data-hero-intro='eyebrow']"), { autoAlpha: 0, y: 22 });
    gsap.set(root.querySelectorAll("[data-hero-intro='headline']"), {
      autoAlpha: 0,
      y: 36,
    });
    gsap.set(root.querySelector("[data-hero-intro='cta']"), { autoAlpha: 0, y: 24 });
    gsap.set(root.querySelector("[data-hero-intro='visual']"), { autoAlpha: 0, y: 32 });
    gsap.set(root.querySelector("[data-hero-intro='image']"), {
      scale: 1.08,
      autoAlpha: 0.92,
    });
    gsap.set(root.querySelector("[data-hero-intro='caption']"), { autoAlpha: 0, y: 14 });
    gsap.set(root.querySelectorAll("[data-hero-intro='stat']"), { autoAlpha: 0, y: 20 });
  }, [introReady, reducedMotion]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || !introReady || introPlayedRef.current) return;

    introPlayedRef.current = true;

    if (reducedMotion) {
      gsap.set(root.querySelectorAll("[data-hero-intro]"), { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      const grid = root.querySelector("[data-hero-intro='grid']");
      const watermark = root.querySelector("[data-hero-intro='watermark']");
      const logo = root.querySelector("[data-hero-intro='logo']");
      const rail = root.querySelector("[data-hero-intro='rail']");
      const eyebrow = root.querySelector("[data-hero-intro='eyebrow']");
      const headlineWords = root.querySelectorAll("[data-hero-intro='headline']");
      const cta = root.querySelector("[data-hero-intro='cta']");
      const visual = root.querySelector("[data-hero-intro='visual']");
      const image = root.querySelector("[data-hero-intro='image']");
      const caption = root.querySelector("[data-hero-intro='caption']");
      const statItems = root.querySelectorAll("[data-hero-intro='stat']");

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.08,
      });

      tl.to(grid, { opacity: 1, duration: 1.1 }, 0);
      tl.to(watermark, { autoAlpha: 1, y: 0, duration: 1.05 }, 0.05);
      tl.to(logo, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.12);
      tl.to(rail, { autoAlpha: 1, y: 0, duration: 0.78 }, 0.2);
      tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.3);
      tl.to(
        headlineWords,
        { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.055 },
        0.38,
      );
      tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.78 }, 0.58);
      tl.to(visual, { autoAlpha: 1, y: 0, duration: 0.88 }, 0.52);
      tl.to(
        image,
        { scale: 1, autoAlpha: 1, duration: 1.65, ease: "power2.out" },
        0.62,
      );
      tl.to(caption, { autoAlpha: 1, y: 0, duration: 0.68 }, 0.78);
      tl.to(
        statItems,
        { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.09 },
        0.86,
      );
    }, root);

    return () => ctx.revert();
  }, [introReady, reducedMotion]);

  return (
    <section
      id="hero"
      ref={setRefs}
      className={styles.hero}
      data-intro-pending={pendingIntro || undefined}
      aria-label="Introduction"
    >
      <div className={styles.archGrid} aria-hidden="true" data-hero-intro="grid" />

      <span className={styles.watermark} aria-hidden="true" data-hero-intro="watermark">
        {stats[0]?.value ?? ""}
      </span>

      <div className={styles.heroTop} data-hero-intro="logo">
        <Link href="/" className={styles.heroLogoLink} aria-label={logoAlt}>
          <Image
            src={logoSrc}
            alt=""
            className={styles.heroLogo}
            priority
            sizes="200px"
          />
        </Link>
      </div>

      <div className={styles.shell}>
        <aside className={styles.rail} data-hero-intro="rail">
          <span className={styles.railBrand}>{brand}</span>
          <span className={styles.railLine} aria-hidden="true" />
          <span className={styles.railDiscipline}>{discipline}</span>
        </aside>

        <div className={styles.stage}>
          <div className={styles.copy}>
            <p className={styles.eyebrow} data-hero-intro="eyebrow">
              {discipline}
            </p>

            <h1 className={styles.headline}>
              {headline.map((line, lineIndex) => (
                <HeadlineLine
                  key={`${line}-${lineIndex}`}
                  line={line}
                  accent={lineIndex === accentLineIndex}
                />
              ))}
            </h1>

            <div className={styles.ctaBlock} data-hero-intro="cta">
              <Link href={ctaHref} className={styles.cta} aria-label={ctaText}>
                <span className={styles.ctaText}>{ctaLabel}</span>
                <span className={styles.ctaArrow} aria-hidden="true">
                  →
                </span>
              </Link>
              <p className={styles.subline}>{subline}</p>
            </div>
          </div>

          <div className={styles.visual} data-hero-intro="visual">
            <div className={styles.imageComposition}>
              <div className={styles.imagePlinth} aria-hidden="true" />
              <span className={styles.imageAccent} aria-hidden="true" />
              <figure className={styles.imageMat}>
                <div className={styles.imageSurface} data-hero-intro="image">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    priority
                    sizes={IMAGE_SIZES.heroMat}
                    quality={IMAGE_QUALITY.hero}
                    className={styles.image}
                  />
                </div>
                <figcaption className={styles.imageCaption} data-hero-intro="caption">
                  <span>{captionText}</span>
                  <span>01</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <ul className={styles.statsBand} aria-label="Studio credentials">
          {stats.map((stat) => (
            <li
              key={`${stat.value}-${stat.label}`}
              className={`${styles.stat} ${stat.display === "phrase" ? styles.statPhrase : ""}`}
              data-hero-intro="stat"
            >
              {stat.prefix ? <span className={styles.statPrefix}>{stat.prefix}</span> : null}
              <span
                className={
                  stat.display === "phrase" ? styles.statValuePhrase : styles.statValue
                }
              >
                {stat.value}
              </span>
              {stat.label ? (
                <span className={styles.statMeta}>
                  <span className={styles.statLabel}>{stat.label}</span>
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});
