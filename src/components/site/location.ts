/** Studio — Al Kulliyah Al Ahliyah Street, Ramallah */
export const STUDIO_COORDS = {
  lat: 31.9026,
  lng: 35.1998,
} as const;

export const STUDIO_MAP_ZOOM = 14;

export const GOOGLE_MAPS_STUDIO =
  "https://www.google.com/maps/search/?api=1&query=Al+Kulliyah+Al+Ahliyah+Street+Ramallah+Palestine";

/** Minimal label-free tiles — easier to tint toward the site palette */
export const MAP_TILES = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
} as const;
