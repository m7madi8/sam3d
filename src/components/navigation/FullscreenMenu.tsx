"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLanguage } from "@/components/site/LanguageProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./FullscreenMenu.module.css";

type MenuItem = {
  label: string;
  link: string;
  ariaLabel: string;
};

type FullscreenMenuProps = {
  brand?: string;
  items: MenuItem[];
  logoSrc?: string | StaticImageData;
  logoAlt?: string;
  controlsVisible?: boolean;
  showLangToggle?: boolean;
  showThemeToggle?: boolean;
  /** Full-width transparent header with logo and inline nav — for hero pages. */
  variant?: "default" | "hero";
  theme?: "light" | "dark";
  setTheme?: (t: "light" | "dark" | ((prev: "light" | "dark") => "light" | "dark")) => void;
};

export default function FullscreenMenu({
  brand = "SAMARAMMAR",
  items,
  logoSrc,
  logoAlt = "Brand logo",
  controlsVisible = true,
  showLangToggle = true,
  showThemeToggle = true,
  variant = "default",
  theme: themeProp,
  setTheme: setThemeProp,
}: FullscreenMenuProps) {
  const { lang, toggleLang, tr } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [themeInternal, setThemeInternal] = useState<"light" | "dark">("dark");
  const theme = themeProp ?? themeInternal;
  const setTheme = setThemeProp ?? setThemeInternal;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const listItemRefs = useRef<HTMLLIElement[]>([]);
  const controlsRef = useRef<HTMLDivElement>(null);
  const prefButtonRefs = useRef<HTMLButtonElement[]>([]);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const socialRefs = useRef<HTMLAnchorElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);

  const setClosedState = useCallback(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const decor = decorRef.current;
    const brandEl = brandRef.current;
    const label = labelRef.current;
    const listItems = listItemRefs.current.filter(Boolean);
    const controls = controlsRef.current;
    const prefs = prefButtonRefs.current.filter(Boolean);
    const bottom = bottomBarRef.current;
    const social = socialRefs.current.filter(Boolean);

    if (overlay) gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none", visibility: "hidden" });
    gsap.set(
      [backdrop, decor, brandEl, label, ...listItems, controls, ...prefs, bottom, ...social].filter(Boolean),
      { clearProps: "all" },
    );
    gsap.set(listItems, { y: 36, autoAlpha: 0 });
    if (backdrop) gsap.set(backdrop, { scale: 1.04, autoAlpha: 0 });
    if (decor) gsap.set(decor, { x: -24, autoAlpha: 0 });
    if (brandEl) gsap.set(brandEl, { y: -16, autoAlpha: 0 });
    if (label) gsap.set(label, { y: 18, autoAlpha: 0 });
    if (controls) gsap.set(controls, { y: 28, autoAlpha: 0 });
    gsap.set(prefs, { y: 22, autoAlpha: 0 });
    if (bottom) gsap.set(bottom, { y: 20, autoAlpha: 0 });
    gsap.set(social, { y: 14, autoAlpha: 0 });
  }, []);

  const playOpen = useCallback(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const decor = decorRef.current;
    const brandEl = brandRef.current;
    const label = labelRef.current;
    const listItems = listItemRefs.current.filter(Boolean);
    const controls = controlsRef.current;
    const prefs = prefButtonRefs.current.filter(Boolean);
    const bottom = bottomBarRef.current;
    const social = socialRefs.current.filter(Boolean);

    if (!overlay) return;

    timelineRef.current?.kill();

    if (reducedMotion) {
      gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto", visibility: "visible" });
      gsap.set(
        [backdrop, decor, brandEl, label, ...listItems, controls, ...prefs, bottom, ...social].filter(Boolean),
        { autoAlpha: 1, y: 0, x: 0, scale: 1 },
      );
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    gsap.set(overlay, { visibility: "visible", pointerEvents: "auto" });
    gsap.set(listItems, { y: 36, autoAlpha: 0 });
    if (backdrop) gsap.set(backdrop, { scale: 1.04, autoAlpha: 0 });
    if (decor) gsap.set(decor, { x: -24, autoAlpha: 0 });
    if (brandEl) gsap.set(brandEl, { y: -16, autoAlpha: 0 });
    if (label) gsap.set(label, { y: 18, autoAlpha: 0 });
    if (controls) gsap.set(controls, { y: 28, autoAlpha: 0 });
    gsap.set(prefs, { y: 22, autoAlpha: 0 });
    if (bottom) gsap.set(bottom, { y: 20, autoAlpha: 0 });
    gsap.set(social, { y: 14, autoAlpha: 0 });

    tl.to(overlay, { autoAlpha: 1, duration: 0.35 }, 0);

    if (backdrop) {
      tl.to(backdrop, { autoAlpha: 1, scale: 1, duration: 0.65, ease: "power2.out" }, 0);
    }

    if (decor) {
      tl.to(decor, { x: 0, autoAlpha: 1, duration: 0.7 }, 0.08);
    }

    if (brandEl) {
      tl.to(brandEl, { y: 0, autoAlpha: 1, duration: 0.55 }, 0.14);
    }

    if (label) {
      tl.to(label, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.22);
    }

    if (listItems.length) {
      tl.to(
        listItems,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.62,
          stagger: { each: 0.07, from: "start" },
          ease: "power3.out",
        },
        0.28,
      );
    }

    if (controls) {
      tl.to(controls, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.52);
    }

    if (prefs.length) {
      tl.to(
        prefs,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.48,
          stagger: 0.09,
        },
        0.58,
      );
    }

    if (bottom) {
      tl.to(bottom, { y: 0, autoAlpha: 1, duration: 0.48 }, 0.68);
    }

    if (social.length) {
      tl.to(
        social,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.42,
          stagger: 0.06,
        },
        0.74,
      );
    }

    timelineRef.current = tl;
    isAnimatingRef.current = true;
  }, [reducedMotion]);

  const playClose = useCallback(
    (onDone: () => void) => {
      const overlay = overlayRef.current;
      const backdrop = backdropRef.current;
      const decor = decorRef.current;
      const brandEl = brandRef.current;
      const label = labelRef.current;
      const listItems = listItemRefs.current.filter(Boolean);
      const controls = controlsRef.current;
      const prefs = prefButtonRefs.current.filter(Boolean);
      const bottom = bottomBarRef.current;
      const social = socialRefs.current.filter(Boolean);

      timelineRef.current?.kill();

      if (!overlay || reducedMotion) {
        setClosedState();
        onDone();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.in" },
        onComplete: () => {
          setClosedState();
          isAnimatingRef.current = false;
          onDone();
        },
      });

      tl.to(social, { y: 10, autoAlpha: 0, duration: 0.2, stagger: 0.03 }, 0);
      if (bottom) tl.to(bottom, { y: 14, autoAlpha: 0, duration: 0.22 }, 0.04);
      tl.to(prefs, { y: 16, autoAlpha: 0, duration: 0.22, stagger: 0.04 }, 0.06);
      if (controls) tl.to(controls, { y: 18, autoAlpha: 0, duration: 0.24 }, 0.1);
      tl.to(
        listItems,
        {
          y: 28,
          autoAlpha: 0,
          duration: 0.28,
          stagger: { each: 0.04, from: "end" },
        },
        0.12,
      );
      if (label) tl.to(label, { y: 12, autoAlpha: 0, duration: 0.22 }, 0.22);
      if (brandEl) tl.to(brandEl, { y: -10, autoAlpha: 0, duration: 0.22 }, 0.24);
      if (decor) tl.to(decor, { x: -16, autoAlpha: 0, duration: 0.28 }, 0.28);
      if (backdrop) tl.to(backdrop, { scale: 1.03, autoAlpha: 0, duration: 0.32 }, 0.3);
      tl.to(overlay, { autoAlpha: 0, duration: 0.28 }, 0.34);

      timelineRef.current = tl;
      isAnimatingRef.current = true;
    },
    [reducedMotion, setClosedState],
  );

  const closeMenu = useCallback(() => {
    if (isAnimatingRef.current || !open) return;
    playClose(() => setOpen(false));
  }, [open, playClose]);

  const toggleMenu = useCallback(() => {
    if (open) {
      if (isAnimatingRef.current) return;
      playClose(() => setOpen(false));
    } else {
      if (isAnimatingRef.current) return;
      setOpen(true);
    }
  }, [open, playClose]);

  useLayoutEffect(() => {
    setClosedState();
    return () => {
      timelineRef.current?.kill();
    };
  }, [setClosedState]);

  useEffect(() => {
    if (open) playOpen();
  }, [open, playOpen]);

  useEffect(() => {
    if (themeProp !== undefined) return;
    const storageKey = "sam3d-theme";
    const storedTheme = window.localStorage.getItem(storageKey);
    const resolved: "light" | "dark" =
      storedTheme === "dark" || storedTheme === "light" ? storedTheme : "dark";
    const id = requestAnimationFrame(() => setThemeInternal(resolved));
    return () => cancelAnimationFrame(id);
  }, [themeProp]);

  useEffect(() => {
    const storageKey = "sam3d-theme";
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  const isHeroVariant = variant === "hero";

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      data-open={open || undefined}
      data-variant={isHeroVariant ? "hero" : undefined}
    >
      <header
        className={`${styles.header} ${isHeroVariant ? styles.headerHero : ""} ${!controlsVisible ? styles.headerHidden : ""}`}
        aria-label={tr("Main navigation", "التنقل الرئيسي")}
      >
        <div className={styles.headerStart}>
          {isHeroVariant && logoSrc ? (
            <Link href="/" className={styles.headerLogoLink} aria-label={logoAlt}>
              <Image
                src={logoSrc}
                alt=""
                width={160}
                height={48}
                className={styles.headerLogo}
                priority
                sizes="160px"
              />
            </Link>
          ) : (
            <span className={styles.brand}>{brand}</span>
          )}
        </div>

        {isHeroVariant ? (
          <nav className={styles.headerNav} aria-label={tr("Primary", "الرئيسية")}>
            <ul className={styles.headerNavList}>
              {items.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <a className={styles.headerNavLink} href={item.link} aria-label={item.ariaLabel}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className={styles.headerControls} suppressHydrationWarning>
          {isHeroVariant && showThemeToggle ? (
            <button
              type="button"
              className={styles.headerPrefButton}
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              aria-label={
                theme === "dark"
                  ? tr("Switch to light mode", "التبديل للوضع الفاتح")
                  : tr("Switch to dark mode", "التبديل للوضع الداكن")
              }
              suppressHydrationWarning
            >
              {theme === "dark" ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          ) : null}

          <button
            type="button"
            className={`${styles.menuButton} ${isHeroVariant ? styles.menuButtonHero : ""}`}
            onClick={toggleMenu}
            aria-expanded={open}
            aria-controls="fullscreen-menu"
            aria-label={open ? tr("Close menu", "إغلاق القائمة") : tr("Open menu", "فتح القائمة")}
            suppressHydrationWarning
          >
            <span className={styles.menuButtonText}>{open ? tr("Close", "إغلاق") : tr("Menu", "القائمة")}</span>
            <span className={styles.menuButtonIcon} aria-hidden="true">
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7h-8M17 7v8" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </header>

      {isHeroVariant && showLangToggle && controlsVisible ? (
        <button
          type="button"
          className={styles.heroLangFloat}
          onClick={toggleLang}
          aria-label={tr("Toggle language", "تبديل اللغة")}
          suppressHydrationWarning
        >
          <span className={styles.heroLangTrack} aria-hidden="true">
            <span
              className={`${styles.heroLangOption} ${lang === "en" ? styles.heroLangOptionActive : ""}`}
            >
              EN
            </span>
            <span
              className={`${styles.heroLangOption} ${lang === "ar" ? styles.heroLangOptionActive : ""}`}
            >
              AR
            </span>
          </span>
          <span className={styles.heroLangIndicator} aria-hidden="true" data-lang={lang} />
        </button>
      ) : null}

      <div id="fullscreen-menu" className={styles.overlay} ref={overlayRef} aria-hidden={!open}>
        <div className={styles.overlayBackdrop} ref={backdropRef} aria-hidden="true" />
        <div className={styles.overlayGrain} aria-hidden="true" />

        <div className={styles.overlayDecor} ref={decorRef} aria-hidden="true">
          <span className={styles.overlayWatermark}>{tr("Menu", "قائمة")}</span>
          <span className={styles.overlayDecorLine} />
        </div>

        {logoSrc ? (
          <div className={styles.overlayBrand} ref={brandRef}>
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={120}
              height={48}
              className={styles.overlayLogo}
              quality={100}
            />
          </div>
        ) : null}

        <nav className={styles.overlayNav} aria-label={tr("Fullscreen menu", "قائمة كاملة الشاشة")}>
          <div className={styles.overlayNavMain}>
            <p className={styles.overlayMenuLabel} ref={labelRef}>
              {tr("Navigation", "تنقّل")}
            </p>
            <ul>
              {items.map((item, index) => (
                <li
                  key={`${item.label}-${index}`}
                  ref={(node) => {
                    if (!node) return;
                    listItemRefs.current[index] = node;
                  }}
                >
                  <a className={styles.overlayLink} href={item.link} aria-label={item.ariaLabel} onClick={closeMenu}>
                    <span className={styles.overlayLinkIndex} aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.overlayLinkBody}>
                      <span className={styles.overlayLinkLabel}>{item.label}</span>
                      <span className={styles.overlayLinkRule} aria-hidden />
                    </span>
                    <span className={styles.overlayLinkArrow} aria-hidden>
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {(showLangToggle || showThemeToggle) && (
            <div className={styles.overlayControls} ref={controlsRef} aria-label={tr("Preferences", "التفضيلات")}>
              {showLangToggle ? (
                <button
                  ref={(node) => {
                    if (!node) return;
                    prefButtonRefs.current[0] = node;
                  }}
                  type="button"
                  className={styles.overlayPrefButton}
                  onClick={toggleLang}
                  aria-label={tr("Toggle language", "تبديل اللغة")}
                  suppressHydrationWarning
                >
                  <span className={styles.overlayPrefIcon} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 5h12M9 3v2M8 13h4M7 10l2 6 2-6M18 10h.01M14 21c4.418 0 8-3.582 8-8s-3.582-8-8-8" />
                    </svg>
                  </span>
                  <span className={styles.overlayPrefLabel}>{tr("Language", "اللغة")}</span>
                  <span className={styles.langCodes}>
                    <span className={`${styles.langCode} ${lang === "en" ? styles.langCodeActive : ""}`}>EN</span>
                    <span className={styles.langDivider}>/</span>
                    <span className={`${styles.langCode} ${lang === "ar" ? styles.langCodeActive : ""}`}>AR</span>
                  </span>
                </button>
              ) : null}
              {showThemeToggle ? (
                <button
                  ref={(node) => {
                    if (!node) return;
                    prefButtonRefs.current[1] = node;
                  }}
                  type="button"
                  className={styles.overlayPrefButton}
                  onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                  aria-label={
                    theme === "dark"
                      ? tr("Switch to light mode", "التبديل للوضع الفاتح")
                      : tr("Switch to dark mode", "التبديل للوضع الداكن")
                  }
                  suppressHydrationWarning
                >
                  <span className={styles.overlayPrefIcon} aria-hidden="true">
                    {theme === "dark" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    )}
                  </span>
                  <span className={styles.overlayPrefLabel}>{tr("Appearance", "المظهر")}</span>
                  <span className={styles.overlayPrefValue}>
                    {theme === "dark" ? tr("Light", "فاتح") : tr("Night", "ليلي")}
                  </span>
                </button>
              ) : null}
            </div>
          )}

          <div className={styles.overlayBottomBar} ref={bottomBarRef}>
            <div className={styles.overlaySocial} aria-label={tr("Social links", "روابط التواصل")}>
              <a
                ref={(node) => {
                  if (!node) return;
                  socialRefs.current[0] = node;
                }}
                href="https://wa.me/17600000000"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <a
                ref={(node) => {
                  if (!node) return;
                  socialRefs.current[1] = node;
                }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                ref={(node) => {
                  if (!node) return;
                  socialRefs.current[2] = node;
                }}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </div>
            <p className={styles.overlayBottomNote}>SAMARAMMAR.COM</p>
          </div>
        </nav>
      </div>
    </div>
  );
}
