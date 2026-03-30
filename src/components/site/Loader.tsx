"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Loader.module.css";
import brandLogo from "../../../white-logo.png";

const LOADER_DURATION_MS = 2200;
const COUNT_UP_MS = 1200;
const FADE_OUT_MS = 450;

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const countUp = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.floor((elapsed / COUNT_UP_MS) * 100));
      setProgress(p);
      if (p >= 100) clearInterval(countUp);
    }, 32);

    const startFade = setTimeout(() => setFading(true), LOADER_DURATION_MS);
    const unmount = setTimeout(
      () => setMounted(false),
      LOADER_DURATION_MS + FADE_OUT_MS
    );

    return () => {
      clearInterval(countUp);
      clearTimeout(startFade);
      clearTimeout(unmount);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.overlay} data-fading={fading || undefined}>
      <div className={styles.content}>
        <span className={styles.topRule} aria-hidden="true" />
        <div className={styles.logoWrap}>
          <Image
            src={brandLogo}
            alt="Samar Ammar logo"
            className={styles.logo}
            priority
          />
        </div>
        <span className={styles.percent}>{progress}%</span>
        <span className={styles.subLabel}>Samar Ammar Studio</span>
      </div>
    </div>
  );
}
