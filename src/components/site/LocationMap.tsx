"use client";

import { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./site.module.css";

const LOCATION = { lat: 31.9032, lng: 35.2048 } as const;
const COORDINATES_URL = `https://www.google.com/maps?q=${LOCATION.lat},${LOCATION.lng}`;

export function LocationMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const icon = L.divIcon({
    className: styles.locationMarkerIcon,
    html: `<span class="${styles.locationMarkerPin}" aria-hidden="true"></span>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (mapRef.current) return;

    const map = L.map(container, {
      center: [LOCATION.lat, LOCATION.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    const marker = L.marker([LOCATION.lat, LOCATION.lng], { icon }).addTo(map);

    const popupHtml = `
      <div class="${styles.locationMapInfoCard}">
        <p class="${styles.locationMapInfoMeta}">Company</p>
        <h3 class="${styles.locationMapInfoCardTitle}">Samar Ammar Interior Design</h3>
        <span class="${styles.locationMapInfoDivider}" aria-hidden="true"></span>
        <p class="${styles.locationMapInfoAddress}">
          <span class="${styles.locationMapInfoIcon}" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          </span>
          Al Kulliyah Al Ahliyah Street
        </p>
        <p class="${styles.locationMapInfoPlace}">
          <span class="${styles.locationMapInfoIcon}" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          </span>
          Ramallah, Palestine
        </p>
        <a href="${COORDINATES_URL}" target="_blank" rel="noopener noreferrer" class="${styles.locationMapGetDirections}">
          Open coordinates
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    `;

    marker.bindPopup(popupHtml, { className: styles.locationMapPopup, closeButton: true, autoClose: false });
    marker.openPopup();

    // Ensure correct sizing after mount
    const id = window.setTimeout(() => map.invalidateSize(), 50);

    return () => {
      window.clearTimeout(id);
      map.remove();
      mapRef.current = null;
    };
  }, [icon]);

  return (
    <div className={styles.locationMapFrame}>
      <div ref={containerRef} className={styles.locationMapContainer} />
      <div className={styles.locationMapAttribution}>
        <span>© OpenStreetMap · © CARTO</span>
      </div>
    </div>
  );
}
