"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/site/LanguageProvider";
import styles from "./Loader.module.css";
import brandLogo from "../../../white-logo.png";

export const LOADER_DURATION_MS = 2600;
export const LOADER_FADE_MS = 550;
const LOADER_DURATION_MOBILE_MS = 2000;
const LOADER_SAFETY_MS = 4500;

type LoaderProps = {
  onComplete?: () => void;
};

function getLoaderDurationMs() {
  return window.matchMedia("(max-width: 767px)").matches
    ? LOADER_DURATION_MOBILE_MS
    : LOADER_DURATION_MS;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function Loader({ onComplete }: LoaderProps) {
  const { tr } = useLanguage();
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finishLoader = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  };

  const beginFade = () => {
    setFading(true);
    finishLoader();
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const durationMs = reducedMotion ? 700 : getLoaderDurationMs();
    const fadeMs = reducedMotion ? 300 : LOADER_FADE_MS;
    const progressMs = reducedMotion ? 1 : Math.max(durationMs - 950, 900);

    if (reducedMotion) {
      setProgress(100);
    }

    const startedAt = Date.now();
    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const t = Math.min(1, elapsed / progressMs);
      setProgress(reducedMotion ? 100 : Math.round(easeInOut(t) * 100));
      if (t >= 1) window.clearInterval(progressTimer);
    }, 40);

    const fadeTimer = window.setTimeout(beginFade, durationMs);
    const unmountTimer = window.setTimeout(() => setMounted(false), durationMs + fadeMs);
    const safetyTimer = window.setTimeout(beginFade, LOADER_SAFETY_MS);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
      window.clearTimeout(safetyTimer);
    };
  }, []);

  if (!mounted) return null;

  const progressLabel = String(Math.min(progress, 99)).padStart(2, "0");

  return (
    <div
      className={styles.overlay}
      data-fading={fading || undefined}
      role="status"
      aria-live="polite"
      aria-label={tr("Loading site", "جاري تحميل الموقع")}
    >
      <div className={styles.stage}>
        <div className={styles.logoMark} data-loader-entry>
          <Image src={brandLogo} alt="" className={styles.logo} priority fetchPriority="high" />
        </div>

        <p className={styles.tagline} data-loader-entry>
          {tr("Dare to be different.", "تجرأ أن تكون مختلفًا.")}
        </p>

        <div className={styles.progressBlock} data-loader-entry>
          <div className={styles.progressMeta}>
            <span className={styles.progressLabel}>{tr("Loading", "تحميل")}</span>
            <span className={styles.progressValue} aria-hidden>
              {progress >= 100 ? "100" : progressLabel}
            </span>
          </div>
          <div className={styles.progressTrack} aria-hidden>
            <div className={styles.progressFill} />
          </div>
        </div>
      </div>
    </div>
  );
}
