"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./FullscreenMenu.module.css";

type MenuItem = {
  label: string;
  link: string;
  ariaLabel: string;
};

type FullscreenMenuProps = {
  brand?: string;
  items: MenuItem[];
  logoSrc?: string;
  logoAlt?: string;
  controlsVisible?: boolean;
  showThemeToggle?: boolean;
  theme?: "light" | "dark";
  setTheme?: (t: "light" | "dark" | ((prev: "light" | "dark") => "light" | "dark")) => void;
};

export default function FullscreenMenu({
  brand = "SAMARAMMAR",
  items,
  logoSrc,
  logoAlt = "Brand logo",
  controlsVisible = true,
  showThemeToggle = true,
  theme: themeProp,
  setTheme: setThemeProp,
}: FullscreenMenuProps) {
  const [open, setOpen] = useState(false);
  const [themeInternal, setThemeInternal] = useState<"light" | "dark">("dark");
  const theme = themeProp ?? themeInternal;
  const setTheme = setThemeProp ?? setThemeInternal;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!overlayRef.current) return;
      gsap.set(linksRef.current, { y: 22, autoAlpha: 0 });
      gsap.set(closeButtonRef.current, { y: -14, autoAlpha: 0 });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const links = linksRef.current.filter(Boolean);
    const closeBtn = closeButtonRef.current;
    if (!overlay) return;

    if (open) {
      gsap.set(overlay, { clearProps: "all" });
      gsap.set(links, { y: 22, autoAlpha: 0 });
      if (closeBtn) gsap.set(closeBtn, { y: -14, autoAlpha: 0 });
      if (closeBtn) gsap.to(closeBtn, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out", delay: 0.2 });
      gsap.to(links, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.28 });
      return;
    }

    gsap.set(overlay, { clearProps: "all" });
    gsap.set(links, { y: 22, autoAlpha: 0 });
    if (closeBtn) gsap.set(closeBtn, { y: -14, autoAlpha: 0 });
  }, [open]);

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

  return (
    <div ref={wrapperRef} className={styles.wrapper} data-open={open || undefined}>
      <header
        className={`${styles.header} ${!controlsVisible ? styles.headerHidden : ""}`}
        aria-label="Main navigation"
      >
        <span className={styles.brand}>{brand}</span>
        <div className={styles.headerControls}>
          {showThemeToggle && (
            <button
              type="button"
              className={styles.themeButton}
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className={styles.themeButtonIcon} aria-hidden="true">
                {theme === "dark" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </span>
              <span>{theme === "dark" ? "Light" : "Night"}</span>
            </button>
          )}
          <button
            type="button"
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-expanded={open}
            aria-controls="fullscreen-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className={styles.menuButtonText}>{open ? "Close" : "Menu"}</span>
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

      <div id="fullscreen-menu" className={styles.overlay} ref={overlayRef} aria-hidden={!open}>
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          aria-label="Close menu"
          onClick={closeMenu}
        >
          <span className={styles.closeButtonIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </span>
          <span className={styles.closeButtonText}>Close</span>
        </button>
        {logoSrc ? (
          <div className={styles.overlayBrand}>
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
        <nav className={styles.overlayNav} aria-label="Fullscreen menu">
          <div className={styles.overlayNavMain}>
            <ul>
              {items.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <a
                    ref={(node) => {
                      if (!node) return;
                      linksRef.current[index] = node;
                    }}
                    href={item.link}
                    aria-label={item.ariaLabel}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.overlayBottomBar}>
            <div className={styles.overlaySocial} aria-label="Social links">
              <a href="https://wa.me/17600000000" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
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

