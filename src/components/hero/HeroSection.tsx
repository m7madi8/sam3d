"use client";

import Image from "next/image";
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IMAGE_QUALITY, IMAGE_SIZES } from "@/lib/imageConfig";
import styles from "./HeroSection.module.css";

const WHATSAPP_NUMBER = "972569126200";

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com",
    labelEn: "Instagram",
    labelAr: "إنستغرام",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.75" />
        <circle cx="17.2" cy="6.8" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://facebook.com",
    labelEn: "Facebook",
    labelAr: "فيسبوك",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M18 2h-2.8A4.2 4.2 0 0 0 11 6.2V9H8v4h3v8h4v-8h3.1l.9-4H15V7.1c0-.6.5-1.1 1.1-1.1H18V2Z" />
      </svg>
    ),
  },
  {
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    labelEn: "WhatsApp",
    labelAr: "واتساب",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      </svg>
    ),
  },
] as const;

export interface HeroProps {
  discipline: string;
  imageSrc: string;
  imageAlt: string;
  /** When false, hero stays hidden until loader finishes. Defaults to true. */
  introReady?: boolean;
}

function splitDiscipline(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return { lead: text, accent: "" };
  const accent = words.pop() ?? "";
  return { lead: words.join(" "), accent };
}

export const HeroSection = forwardRef<HTMLElement, HeroProps>(function HeroSection(
  { discipline, imageSrc, imageAlt, introReady = true },
  ref,
) {
  const { tr, lang } = useLanguage();
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const introPlayedRef = useRef(false);
  const { lead, accent } = useMemo(() => splitDiscipline(discipline), [discipline]);

  const setRefs = (node: HTMLElement | null) => {
    heroRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const pendingIntro = !introReady && !reducedMotion;

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root || reducedMotion || introReady) return;

    gsap.set(root.querySelector("[data-hero-intro='bg']"), { autoAlpha: 0, scale: 1.035 });
    gsap.set(root.querySelector("[data-hero-intro='overlay']"), { autoAlpha: 0 });
    gsap.set(root.querySelector("[data-hero-intro='index']"), { autoAlpha: 0, y: 16 });
    gsap.set(root.querySelector("[data-hero-intro='kicker']"), { autoAlpha: 0, y: 14 });
    gsap.set(root.querySelectorAll("[data-hero-intro='line']"), { autoAlpha: 0, y: 22 });
    gsap.set(root.querySelector("[data-hero-intro='hint']"), { autoAlpha: 0, y: 10 });
    gsap.set(root.querySelector("[data-hero-intro='aside']"), { autoAlpha: 0, y: 10 });
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
      const bg = root.querySelector("[data-hero-intro='bg']");
      const overlay = root.querySelector("[data-hero-intro='overlay']");
      const index = root.querySelector("[data-hero-intro='index']");
      const kicker = root.querySelector("[data-hero-intro='kicker']");
      const lines = root.querySelectorAll("[data-hero-intro='line']");
      const hint = root.querySelector("[data-hero-intro='hint']");
      const aside = root.querySelector("[data-hero-intro='aside']");

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.05,
      });

      tl.to(bg, { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out" }, 0);
      tl.to(overlay, { autoAlpha: 1, duration: 1.2, ease: "power2.out" }, 0.18);
      tl.to(index, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.32);
      tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.42);
      tl.to(lines, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power3.out" }, 0.5);
      tl.to(hint, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.82);
      tl.to(aside, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" }, 0.82);
    }, root);

    return () => ctx.revert();
  }, [introReady, reducedMotion]);

  return (
    <section
      id="hero"
      ref={setRefs}
      className={styles.hero}
      data-intro-pending={pendingIntro || undefined}
      data-lang={lang}
      aria-label="Introduction"
    >
      <div className={styles.shell}>
        <div className={styles.bg} data-hero-intro="bg" aria-hidden="true">
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

        <div className={styles.overlay} data-hero-intro="overlay" aria-hidden="true" />

        <span className={styles.index} data-hero-intro="index" aria-hidden="true">
          01
        </span>

        <div className={styles.content}>
          <div className={styles.copy}>
            <p className={styles.kicker} data-hero-intro="kicker">
              {tr("Interior Architecture", "عمارة داخلية")}
            </p>
            <h1 className={styles.headline}>
              <span className={styles.headlineLine} data-hero-intro="line">
                {lead}
              </span>
              {accent ? (
                <span className={styles.headlineLine} data-hero-intro="line">
                  {accent}
                </span>
              ) : null}
            </h1>
          </div>
        </div>

        <span className={styles.srOnly}>{imageAlt}</span>
      </div>

      <div className={styles.scrollHint} data-hero-intro="hint" aria-hidden="true">
        <span className={styles.heroMicroText}>{tr("Scroll", "مرّر")}</span>
        <span className={styles.scrollHintLine} />
      </div>

      <aside className={styles.heroAside} data-hero-intro="aside">
        <nav className={styles.heroSocial} aria-label={tr("Social links", "روابط التواصل")}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.heroSocialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tr(link.labelEn, link.labelAr)}
            >
              {link.icon}
            </a>
          ))}
        </nav>
      </aside>
    </section>
  );
});
