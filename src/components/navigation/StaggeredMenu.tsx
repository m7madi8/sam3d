"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./StaggeredMenu.module.css";

type MenuItem = {
  label: string;
  ariaLabel: string;
  link: string;
};

type StaggeredMenuProps = {
  items: MenuItem[];
  position?: "left" | "right";
  menuButtonLabel?: string;
};

export default function StaggeredMenu({
  items,
  position = "right",
  menuButtonLabel = "Menu",
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const topLineRef = useRef<HTMLSpanElement>(null);
  const bottomLineRef = useRef<HTMLSpanElement>(null);
  const busyRef = useRef(false);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preLayers = preLayersRef.current
        ? Array.from(preLayersRef.current.querySelectorAll(`.${styles.prelayer}`))
        : [];
      if (!panel) return;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(topLineRef.current, { y: -4, rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(bottomLineRef.current, { y: 4, rotate: 0, transformOrigin: "50% 50%" });
    }, wrapperRef);

    return () => ctx.revert();
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;

    const panel = panelRef.current;
    const preLayers = preLayersRef.current
      ? Array.from(preLayersRef.current.querySelectorAll(`.${styles.prelayer}`))
      : [];
    if (!panel) {
      busyRef.current = false;
      return;
    }

    closeTweenRef.current?.kill();
    openTlRef.current?.kill();

    const labels = Array.from(
      panel.querySelectorAll<HTMLElement>(`.${styles.panelItemLabel}`),
    );
    if (labels.length) {
      gsap.set(labels, { yPercent: 130, rotate: 9 });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        busyRef.current = false;
      },
    });

    preLayers.forEach((layer, i) => {
      tl.to(
        layer,
        { xPercent: 0, duration: 0.48, ease: "power4.out" },
        i * 0.06,
      );
    });

    const panelStart = preLayers.length ? (preLayers.length - 1) * 0.06 + 0.08 : 0;
    tl.to(
      panel,
      {
        xPercent: 0,
        duration: 0.62,
        ease: "power4.out",
      },
      panelStart,
    );

    if (labels.length) {
      tl.to(
        labels,
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.08,
        },
        panelStart + 0.14,
      );
    }

    tl.to(topLineRef.current, { y: 0, rotate: 45, duration: 0.35, ease: "power3.out" }, 0);
    tl.to(
      bottomLineRef.current,
      { y: 0, rotate: -45, duration: 0.35, ease: "power3.out" },
      0,
    );

    openTlRef.current = tl;
  }, []);

  const playClose = useCallback(() => {
    const panel = panelRef.current;
    const preLayers = preLayersRef.current
      ? Array.from(preLayersRef.current.querySelectorAll(`.${styles.prelayer}`))
      : [];
    if (!panel) return;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current = gsap.to([panel, ...preLayers], {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      onComplete: () => {
        const labels = Array.from(
          panel.querySelectorAll<HTMLElement>(`.${styles.panelItemLabel}`),
        );
        if (labels.length) {
          gsap.set(labels, { yPercent: 130, rotate: 9 });
        }
        busyRef.current = false;
      },
    });

    gsap.to(topLineRef.current, { y: -4, rotate: 0, duration: 0.26, ease: "power2.out" });
    gsap.to(bottomLineRef.current, { y: 4, rotate: 0, duration: 0.26, ease: "power2.out" });
  }, [position]);

  const toggleMenu = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (next) {
      playOpen();
    } else {
      playClose();
    }
  }, [open, playClose, playOpen]);

  const handleItemClick = useCallback(() => {
    setOpen(false);
    playClose();
  }, [playClose]);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      data-position={position}
      data-open={open || undefined}
    >
      <header className={styles.header} aria-label="Mobile navigation">
        <button
          ref={toggleBtnRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="mobile-staggered-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          <span className={styles.toggleText}>{open ? "Close" : menuButtonLabel}</span>
          <span className={styles.icon} aria-hidden="true">
            <span ref={topLineRef} className={`${styles.iconLine} ${styles.iconLineTop}`} />
            <span ref={bottomLineRef} className={`${styles.iconLine} ${styles.iconLineBottom}`} />
          </span>
        </button>
      </header>

      <div ref={preLayersRef} className={styles.prelayers} aria-hidden="true">
        <div className={styles.prelayer} />
        <div className={styles.prelayer} />
      </div>

      <aside
        id="mobile-staggered-menu"
        ref={panelRef}
        className={styles.panel}
        aria-hidden={!open}
      >
        <ul className={styles.panelList}>
          {items.map((item, index) => (
            <li className={styles.panelItemWrap} key={`${item.label}-${index}`}>
              <a
                className={styles.panelItem}
                href={item.link}
                aria-label={item.ariaLabel}
                onClick={handleItemClick}
              >
                <span className={styles.itemNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.panelItemLabel}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

