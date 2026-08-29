"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./ScrollProgress.module.css";

function getScrollMetrics(lenis?: Lenis | null) {
  if (lenis) {
    const limit = lenis.limit ?? 0;
    const progress = limit > 0 ? lenis.scroll / limit : 0;
    return { progress: Math.min(1, Math.max(0, progress)), scrollable: limit > 8 };
  }

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  return { progress: Math.min(1, Math.max(0, progress)), scrollable: max > 8 };
}

export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  const applyProgress = useCallback(
    (value: number) => {
      const progress = Math.min(1, Math.max(0, value));
      progressRef.current = progress;

      const fill = fillRef.current;
      if (!fill) return;

      const height = `${progress * 100}%`;

      if (reducedMotion) {
        fill.style.height = height;
        return;
      }

      gsap.to(fill, {
        height,
        duration: 0.12,
        ease: "power2.out",
        overwrite: true,
      });
    },
    [reducedMotion],
  );

  useEffect(() => {
    let lenisCleanup: (() => void) | undefined;
    let pollId = 0;
    let attachedLenis: Lenis | null = null;

    const update = () => {
      const { progress, scrollable } = getScrollMetrics(window.__lenis ?? attachedLenis);
      applyProgress(progress);
      setVisible(scrollable);
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
  }, [applyProgress]);

  return (
    <div
      className={styles.root}
      data-visible={visible || undefined}
      role="progressbar"
      aria-hidden={!visible}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progressRef.current * 100)}
    >
      <div className={styles.track}>
        <div ref={fillRef} className={styles.fill} />
      </div>
    </div>
  );
}
