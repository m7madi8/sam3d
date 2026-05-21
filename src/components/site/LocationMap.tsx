"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "./LanguageProvider";
import styles from "./site.module.css";

const LocationMapInner = dynamic(() => import("./LocationMapInner"), {
  ssr: false,
  loading: () => <div className={styles.locationMapSkeleton} aria-hidden />,
});

export function LocationMap() {
  const { tr } = useLanguage();
  const attribution = tr("Map data © OpenStreetMap · CARTO", "بيانات الخريطة © OpenStreetMap · CARTO");
  const caption = tr("Ramallah", "رام الله");

  return (
    <figure className={styles.locationMapFrame}>
      <div className={styles.locationMapMat}>
        <div className={styles.locationMapViewport}>
          <LocationMapInner />
          <div className={styles.locationMapVignette} aria-hidden />
        </div>
        <figcaption className={styles.locationMapCaption}>{caption}</figcaption>
      </div>
      <span className={styles.locationMapAttribution}>{attribution}</span>
    </figure>
  );
}
