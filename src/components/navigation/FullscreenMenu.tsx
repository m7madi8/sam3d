"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type Lenis from "lenis";
import styles from "./FullscreenMenu.module.css";

type MenuItem = {
  label: string;
  link: string;
  ariaLabel: string;
};

function isAppRoute(href: string) {
  return href.startsWith("/") && !href.startsWith("//") && !href.includes("#");
}

function RouteLink({
  href,
  className,
  ariaLabel,
  onClick,
  children,
}: {
  href: string;
  className: string;
  ariaLabel: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (isAppRoute(href)) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel} onClick={onClick} scroll>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </a>
  );
}

const WHATSAPP_NUMBER = "972569126200";

const OVERLAY_SOCIAL = [
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
] as const;

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
  /** Keep the language control visible on pages that have no #hero section. */
  pinLangToggle?: boolean;
  theme?: "light" | "dark";
  setTheme?: (t: "light" | "dark" | ((prev: "light" | "dark") => "light" | "dark")) => void;
};

export default function FullscreenMenu({
  brand = "SAMARAMMAR",
  items,
  logoSrc,
  logoAlt = "Brand logo",
  controlsVisible = true,
  showLangToggle = false,
  showThemeToggle = true,
  variant = "default",
  pinLangToggle = false,
  theme: themeProp,
  setTheme: setThemeProp,
}: FullscreenMenuProps) {
  const { lang, toggleLang, tr } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const [themeInternal, setThemeInternal] = useState<"light" | "dark">("dark");
  const theme = themeProp ?? themeInternal;
  const setTheme = setThemeProp ?? setThemeInternal;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
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
    const listItems = listItemRefs.current.filter(Boolean);
    const controls = controlsRef.current;
    const prefs = prefButtonRefs.current.filter(Boolean);
    const bottom = bottomBarRef.current;
    const social = socialRefs.current.filter(Boolean);

    if (overlay) gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none", visibility: "hidden" });
    gsap.set(
      [backdrop, decor, ...listItems, controls, ...prefs, bottom, ...social].filter(Boolean),
      { clearProps: "all" },
    );
    gsap.set(listItems, { y: 36, autoAlpha: 0 });
    if (backdrop) gsap.set(backdrop, { scale: 1.04, autoAlpha: 0 });
    if (decor) gsap.set(decor, { x: -24, autoAlpha: 0 });
    if (controls) gsap.set(controls, { y: 28, autoAlpha: 0 });
    gsap.set(prefs, { y: 22, autoAlpha: 0 });
    if (bottom) gsap.set(bottom, { y: 20, autoAlpha: 0 });
    gsap.set(social, { y: 14, autoAlpha: 0 });
  }, []);

  const playOpen = useCallback(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const decor = decorRef.current;
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
        [backdrop, decor, ...listItems, controls, ...prefs, bottom, ...social].filter(Boolean),
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
        0.2,
      );
    }

    if (controls) {
      tl.to(controls, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.44);
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
        0.5,
      );
    }

    if (bottom) {
      tl.to(bottom, { y: 0, autoAlpha: 1, duration: 0.48 }, 0.6);
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
        0.66,
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
        0.08,
      );
      if (decor) tl.to(decor, { x: -16, autoAlpha: 0, duration: 0.28 }, 0.18);
      if (backdrop) tl.to(backdrop, { scale: 1.03, autoAlpha: 0, duration: 0.32 }, 0.2);
      tl.to(overlay, { autoAlpha: 0, duration: 0.28 }, 0.24);

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
    if (!open) return;

    const html = document.documentElement;
    const { body } = document;
    const scrollY = Math.round(window.__lenis?.scroll ?? window.scrollY);

    window.__lenisStop?.();
    window.__lenis?.stop();

    const prev = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    html.setAttribute("data-menu-open", "");

    const overlay = overlayRef.current;
    const onScrollAttempt = (event: WheelEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || !overlay?.contains(target)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", onScrollAttempt, { passive: false });
    window.addEventListener("touchmove", onScrollAttempt, { passive: false });

    return () => {
      window.removeEventListener("wheel", onScrollAttempt);
      window.removeEventListener("touchmove", onScrollAttempt);
      html.style.overflow = prev.htmlOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      html.removeAttribute("data-menu-open");
      window.scrollTo(0, scrollY);
      window.__lenis?.scrollTo(scrollY, { immediate: true });
      window.__lenisStart?.();
      window.__lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  useEffect(() => {
    let lenisCleanup: (() => void) | undefined;
    let pollId = 0;
    let attachedLenis: Lenis | null = null;

    const update = () => {
      const scrollY = window.__lenis?.scroll ?? attachedLenis?.scroll ?? window.scrollY;
      setScrolled(scrollY > 8);
    };

    const bindLenis = (lenis: Lenis) => {
      attachedLenis = lenis;
      const onScroll = () => update();
      lenis.on("scroll", onScroll);
      update();
      return () => {
        lenis.off("scroll", onScroll);
        if (attachedLenis === lenis) attachedLenis = null;
      };
    };

    const tryBindLenis = () => {
      if (window.__lenis) {
        lenisCleanup?.();
        lenisCleanup = bindLenis(window.__lenis);
        return true;
      }
      return false;
    };

    if (!tryBindLenis()) {
      pollId = window.setInterval(() => {
        if (tryBindLenis()) window.clearInterval(pollId);
      }, 80);
    }

    const onNativeScroll = () => {
      if (!window.__lenis && !attachedLenis) update();
    };

    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.clearInterval(pollId);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", update);
      lenisCleanup?.();
    };
  }, []);

  useEffect(() => {
    if (variant !== "hero" || !showLangToggle) {
      setHeroInView(false);
      return;
    }

    if (pinLangToggle) {
      setHeroInView(true);
      return;
    }

    let observer: IntersectionObserver | undefined;
    let pollId = 0;

    const bindHero = () => {
      const hero = document.getElementById("hero");
      if (!hero) return false;

      observer?.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => setHeroInView(entry.isIntersecting),
        { threshold: 0.08 },
      );
      observer.observe(hero);
      return true;
    };

    if (!bindHero()) {
      pollId = window.setInterval(() => {
        if (bindHero()) window.clearInterval(pollId);
      }, 80);
    }

    return () => {
      window.clearInterval(pollId);
      observer?.disconnect();
    };
  }, [variant, showLangToggle, pinLangToggle]);

  const isHeroVariant = variant === "hero";

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      data-open={open || undefined}
      data-variant={isHeroVariant ? "hero" : undefined}
    >
      <header
        className={`${styles.header} ${isHeroVariant ? styles.headerHero : ""} ${scrolled ? styles.headerScrolled : ""} ${!controlsVisible ? styles.headerHidden : ""}`}
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
                  <RouteLink className={styles.headerNavLink} href={item.link} ariaLabel={item.ariaLabel}>
                    {item.label}
                  </RouteLink>
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
          data-hidden={!heroInView || undefined}
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

        <nav className={styles.overlayNav} aria-label={tr("Fullscreen menu", "قائمة كاملة الشاشة")}>
          {logoSrc ? (
            <Link href="/" className={styles.overlayBrand} onClick={closeMenu} aria-label={logoAlt}>
              <Image
                src={logoSrc}
                alt=""
                width={160}
                height={48}
                className={styles.overlayLogo}
                sizes="136px"
              />
            </Link>
          ) : null}

          <div className={styles.overlayNavMain}>
            <ul>
              {items.map((item, index) => (
                <li
                  key={`${item.label}-${index}`}
                  ref={(node) => {
                    if (!node) return;
                    listItemRefs.current[index] = node;
                  }}
                >
                  <RouteLink
                    className={styles.overlayLink}
                    href={item.link}
                    ariaLabel={item.ariaLabel}
                    onClick={closeMenu}
                  >
                    <span className={styles.overlayLinkIndex} aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.overlayLinkLabel}>{item.label}</span>
                    <span className={styles.overlayLinkArrow} aria-hidden>
                      →
                    </span>
                  </RouteLink>
                </li>
              ))}
            </ul>
          </div>

          {showThemeToggle ? (
            <div className={styles.overlayControls} ref={controlsRef} aria-label={tr("Preferences", "التفضيلات")}>
              <button
                ref={(node) => {
                  if (!node) return;
                  prefButtonRefs.current[0] = node;
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
            </div>
          ) : null}

          <div className={styles.overlayBottomBar} ref={bottomBarRef}>
            <div className={styles.overlaySocial} aria-label={tr("Social links", "روابط التواصل")}>
              {OVERLAY_SOCIAL.map((item, index) => (
                <a
                  key={item.href}
                  ref={(node) => {
                    if (!node) return;
                    socialRefs.current[index] = node;
                  }}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tr(item.labelEn, item.labelAr)}
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <p className={styles.overlayBottomNote}>SAMARAMMAR.COM</p>
          </div>
        </nav>
      </div>
    </div>
  );
}
