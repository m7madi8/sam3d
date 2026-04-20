"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import styles from "./site.module.css";

const GOOGLE_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Al+Kulliyah+Al+Ahliyah+Street+Ramallah+Palestine";

function MapPinGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function LocationMap() {
  const { tr } = useLanguage();
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const dialogId = useId();

  const mapAlt = tr(
    "Map illustration of Ramallah and the studio area",
    "رسم خريطة لرام الله ومنطقة المكتب",
  );

  const openMapsLabel = tr("Open location in Google Maps", "فتح الموقع في خرائط جوجل");
  const pinLabel = tr("Open studio location details", "عرض تفاصيل موقع المكتب");
  const closeLabel = tr("Close", "إغلاق");
  const companyMeta = tr("Studio", "المكتب");
  const companyTitle = tr("Samar Ammar Interior Design", "سمر عمار — التصميم الداخلي");
  const streetLine = tr("Al Kulliyah Al Ahliyah Street", "شارع الكلية الأهلية");
  const cityLine = tr("Ramallah, Palestine", "رام الله، فلسطين");
  const directionsLabel = tr("Open in Google Maps", "فتح في خرائط جوجل");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className={styles.locationMapFrame}>
      <div className={styles.locationMapImageWrap}>
        <a
          href={GOOGLE_MAPS}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.locationMapImageLink}
          aria-label={openMapsLabel}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ramallah_map.svg" alt={mapAlt} className={styles.locationMapImage} loading="lazy" />
        </a>
        <button
          type="button"
          className={styles.locationMapMarkerBtn}
          onClick={() => setOpen(true)}
          aria-label={pinLabel}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={open ? dialogId : undefined}
        >
          <span className={styles.locationMarkerPin} aria-hidden />
        </button>
      </div>

      {open ? (
        <>
          <div className={styles.locationMapDialogBackdrop} onClick={close} aria-hidden />
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={styles.locationMapDialog}
          >
            <button
              type="button"
              ref={closeBtnRef}
              className={styles.locationMapDialogClose}
              onClick={close}
              aria-label={closeLabel}
            >
              ×
            </button>
            <div className={styles.locationMapDialogIconWrap}>
              <MapPinGlyph className={styles.locationMapDialogIcon} />
            </div>
            <div className={styles.locationMapInfoCard}>
              <p className={styles.locationMapInfoMeta}>{companyMeta}</p>
              <h3 id={titleId} className={styles.locationMapInfoCardTitle}>
                {companyTitle}
              </h3>
              <span className={styles.locationMapInfoDivider} aria-hidden />
              <p className={styles.locationMapInfoAddress}>
                <span className={styles.locationMapInfoIcon} aria-hidden>
                  <MapPinGlyph />
                </span>
                {streetLine}
              </p>
              <p className={styles.locationMapInfoPlace}>
                <span className={styles.locationMapInfoIcon} aria-hidden>
                  <MapPinGlyph />
                </span>
                {cityLine}
              </p>
              <a
                href={GOOGLE_MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.locationMapGetDirections}
              >
                {directionsLabel}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
