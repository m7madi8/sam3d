"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "./LanguageProvider";
import {
  GOOGLE_MAPS_STUDIO,
  MAP_TILES,
  STUDIO_COORDS,
  STUDIO_MAP_ZOOM,
} from "./location";
import styles from "./site.module.css";

function useSiteTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const read = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

/** View-only map: no pan/zoom; marker popup and directions link stay clickable. */
function MapViewOnly() {
  const map = useMap();

  useEffect(() => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.zoomControl?.remove();

    const container = map.getContainer();
    container.style.touchAction = "manipulation";
    container.style.cursor = "default";

    return () => {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    };
  }, [map]);

  return null;
}

function MapResize() {
  const map = useMap();

  useEffect(() => {
    const target = map.getContainer().parentElement;
    if (!target) return;

    const refresh = () => {
      map.invalidateSize({ animate: false });
    };

    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(target);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          window.requestAnimationFrame(refresh);
        }
      },
      { threshold: 0.12 },
    );
    intersectionObserver.observe(target);

    refresh();
    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [map]);

  return null;
}

function StudioPopup() {
  const { tr } = useLanguage();
  const companyMeta = tr("Studio", "المكتب");
  const companyTitle = tr("Samar Ammar Interior Design", "سمر عمار — التصميم الداخلي");
  const streetLine = tr("Al Kulliyah Al Ahliyah Street", "شارع الكلية الأهلية");
  const cityLine = tr("Ramallah, Palestine", "رام الله، فلسطين");
  const directionsLabel = tr("Open in Google Maps", "فتح في خرائط جوجل");

  return (
    <article className={styles.locationMapInfoCard}>
      <p className={styles.locationMapInfoMeta}>{companyMeta}</p>
      <h3 className={styles.locationMapInfoCardTitle}>{companyTitle}</h3>
      <p className={styles.locationMapInfoAddress}>{streetLine}</p>
      <p className={styles.locationMapInfoPlace}>{cityLine}</p>
      <a
        href={GOOGLE_MAPS_STUDIO}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.locationMapGetDirections}
      >
        <span>{directionsLabel}</span>
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}

export default function LocationMapInner() {
  const { tr } = useLanguage();
  const isDark = useSiteTheme();
  const tiles = isDark ? MAP_TILES.dark : MAP_TILES.light;
  const position: L.LatLngExpression = [STUDIO_COORDS.lat, STUDIO_COORDS.lng];

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: styles.locationMarkerIcon,
        html: `<span class="${styles.locationMarker}" aria-hidden="true"><span class="${styles.locationMarkerPulse}"></span><span class="${styles.locationMarkerCore}"></span></span>`,
        iconSize: [52, 52],
        iconAnchor: [26, 26],
        popupAnchor: [0, -30],
      }),
    [],
  );

  const mapLabel = tr(
    "Map showing the studio location in Ramallah",
    "خريطة توضح موقع المكتب في رام الله",
  );

  return (
    <MapContainer
      key={isDark ? "map-dark" : "map-light"}
      className={styles.locationMapContainer}
      center={position}
      zoom={STUDIO_MAP_ZOOM}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      boxZoom={false}
      keyboard={false}
      attributionControl={false}
      zoomControl={false}
      aria-label={mapLabel}
    >
      <TileLayer url={tiles.url} attribution={tiles.attribution} />
      <MapViewOnly />
      <MapResize />
      <Marker position={position} icon={markerIcon}>
        <Popup closeButton maxWidth={300} minWidth={260}>
          <StudioPopup />
        </Popup>
      </Marker>
    </MapContainer>
  );
}
