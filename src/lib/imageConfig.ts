/** Shared Next/Image hints — sizes must match real layout width (incl. 2×/3× DPR). */

export const IMAGE_QUALITY = {
  /** Full-bleed hero, homepage services, about portrait */
  hero: 100,
  home: 100,
  editorial: 92,
  gallery: 95,
} as const;

export const IMAGE_SIZES = {
  heroMat: "(max-width: 767px) 92vw, 38vw",
  galleryHero: "(max-width: 1023px) 92vw, 34vw",
  galleryCard: "(max-width: 520px) 100vw, (max-width: 767px) 50vw, (max-width: 1100px) 33vw, 20vw",
  fullViewport: "100vw",
  /** Homepage hero — always full viewport width on every breakpoint */
  homeHero: "100vw",
  aboutPortrait:
    "(max-width: 767px) 100vw, (max-width: 1023px) min(58vw, 34rem), min(50vw, 42rem)",
  servicePanel: "100vw",
  /** Decorative column hidden below 1024px — avoid loading full-width assets on mobile. */
  desktopOnlyColumn: "(min-width: 1024px) 32vw, 1px",
  projectStoryItem: "(max-width: 767px) 85vw, 55vw",
  /** Original-size masonry: 1 col mobile, 2 col tablet, 3 col desktop. */
  projectOriginalItem: "(max-width: 767px) 92vw, (max-width: 1100px) 46vw, 30vw",
} as const;
