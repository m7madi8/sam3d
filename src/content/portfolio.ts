import type { StaticImageData } from "next/image";

export type PortfolioCategoryId = "interior" | "landscape" | "exterior" | "commercial" | "architectural";

export type PortfolioProject = {
  id: string;
  title: string;
  category: PortfolioCategoryId;
  categoryLabel: string;
  location: string;
  description: string;
  descriptionSecondary?: string;
  materials?: string;
  thumbnail: StaticImageData;
  gallery: StaticImageData[];
  photosCount?: number;
  /** e.g. "18000 sq. ft." */
  area?: string;
  /** Client or developer name */
  client?: string;
  /** e.g. "Completed" */
  status?: string;
  /** e.g. ["Interior planning", "Spatial planning"] */
  services?: string[];
  /** e.g. "2024" */
  year?: string | number;
  /** If true, gallery is shown as floor sections; if false, single image set. */
  hasFloors?: boolean;
};

export const PORTFOLIO_CATEGORIES: { id: PortfolioCategoryId; label: string }[] = [
  { id: "interior", label: "Interior" },
  { id: "landscape", label: "Landscape" },
  { id: "exterior", label: "Exterior" },
  { id: "commercial", label: "Commercial" },
  { id: "architectural", label: "Architectural" },
];

export function buildPortfolioProjects(
  interiorImg: StaticImageData,
  landscapeImg: StaticImageData,
  exteriorImg: StaticImageData
): PortfolioProject[] {
  const defaultSpecs = {
    status: "Completed",
    services: ["Interior planning", "Spatial planning", "Furniture curation", "Project coordination"],
    year: "2024",
  };
  const interior: PortfolioProject[] = [
    { id: "interior-1", title: "Palm Villa", category: "interior", categoryLabel: "Interior", location: "Ramallah, Palestine", description: "Villa interior with natural materials and open spaces. Warm tones and calm living.", materials: "Oak, marble, linen", area: "4500 sq. ft.", client: "Private client", ...defaultSpecs, thumbnail: interiorImg, gallery: [interiorImg, interiorImg, interiorImg], photosCount: 12 },
    { id: "interior-2", title: "Duplex Apartment", category: "interior", categoryLabel: "Interior", location: "Ramallah, Palestine", description: "Modern duplex with double-height living. Focus and collaboration zones.", materials: "Concrete, wood, brass", area: "3200 sq. ft.", client: "Private client", ...defaultSpecs, thumbnail: interiorImg, gallery: [interiorImg, interiorImg], photosCount: 8 },
    { id: "interior-3", title: "Guest House", category: "interior", categoryLabel: "Interior", location: "Ramallah, Palestine", description: "Minimalist guest pavilion with courtyard views.", thumbnail: interiorImg, area: "1800 sq. ft.", client: "Private client", ...defaultSpecs, gallery: [interiorImg], photosCount: 15 },
    { id: "interior-4", title: "Reception Hall", category: "interior", categoryLabel: "Interior", location: "Ramallah, Palestine", description: "Grand reception with custom joinery. Flexible for events.", materials: "Oak, brass", area: "5600 sq. ft.", client: "Corporate client", ...defaultSpecs, thumbnail: interiorImg, gallery: [interiorImg, interiorImg], photosCount: 10 },
    { id: "interior-5", title: "Modern Living", category: "interior", categoryLabel: "Interior", location: "Ramallah, Palestine", description: "Open-plan living with integrated kitchen.", thumbnail: interiorImg, area: "2800 sq. ft.", client: "Private client", ...defaultSpecs, gallery: [interiorImg], photosCount: 14 },
  ];
  const landscape: PortfolioProject[] = [
    { id: "landscape-1", title: "Rooftop Garden", category: "landscape", categoryLabel: "Landscape", location: "Ramallah, Palestine", description: "Rooftop garden with native planting.", area: "2200 sq. ft.", client: "Private client", ...defaultSpecs, thumbnail: landscapeImg, gallery: [landscapeImg, landscapeImg], photosCount: 9 },
    { id: "landscape-2", title: "Pool Terrace", category: "landscape", categoryLabel: "Landscape", location: "Ramallah, Palestine", description: "Infinity pool and terrace with desert views.", area: "3500 sq. ft.", client: "Private client", ...defaultSpecs, thumbnail: landscapeImg, gallery: [landscapeImg], photosCount: 11 },
    { id: "landscape-3", title: "Shade Walk", category: "landscape", categoryLabel: "Landscape", location: "Ramallah, Palestine", description: "Shaded walkway with water feature.", ...defaultSpecs, thumbnail: landscapeImg, gallery: [landscapeImg, landscapeImg], photosCount: 7 },
    { id: "landscape-4", title: "Inner Courtyard", category: "landscape", categoryLabel: "Landscape", location: "Ramallah, Palestine", description: "Central courtyard with olive trees.", ...defaultSpecs, thumbnail: landscapeImg, gallery: [landscapeImg], photosCount: 13 },
    { id: "landscape-5", title: "Front Layout", category: "landscape", categoryLabel: "Landscape", location: "Ramallah, Palestine", description: "Front garden and approach design.", ...defaultSpecs, thumbnail: landscapeImg, gallery: [landscapeImg, landscapeImg], photosCount: 10 },
  ];
  const exterior: PortfolioProject[] = [
    { id: "exterior-1", title: "Building A Facade", category: "exterior", categoryLabel: "Exterior", location: "Ramallah, Palestine", description: "Contemporary facade with vertical fins.", area: "18000 sq. ft.", client: "Development client", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg, exteriorImg], photosCount: 16 },
    { id: "exterior-2", title: "East Wing", category: "exterior", categoryLabel: "Exterior", location: "Ramallah, Palestine", description: "Residential wing with screened terraces.", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg], photosCount: 10 },
    { id: "exterior-3", title: "Main Entrance", category: "exterior", categoryLabel: "Exterior", location: "Ramallah, Palestine", description: "Monumental entrance and porte-cochère.", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg, exteriorImg], photosCount: 12 },
    { id: "exterior-4", title: "Residential Tower", category: "exterior", categoryLabel: "Exterior", location: "Ramallah, Palestine", description: "High-rise residential with brise-soleil.", area: "24000 sq. ft.", client: "Developer", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg], photosCount: 8 },
    { id: "exterior-5", title: "Office Block", category: "exterior", categoryLabel: "Exterior", location: "Ramallah, Palestine", description: "Corporate headquarters facade.", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg, exteriorImg], photosCount: 14 },
  ];
  const commercial: PortfolioProject[] = [
    { id: "commercial-1", title: "Showroom", category: "commercial", categoryLabel: "Commercial", location: "Ramallah, Palestine", description: "Luxury automotive showroom.", area: "12000 sq. ft.", client: "Brand client", ...defaultSpecs, thumbnail: interiorImg, gallery: [interiorImg, interiorImg], photosCount: 11 },
    { id: "commercial-2", title: "Executive Office", category: "commercial", categoryLabel: "Commercial", location: "Ramallah, Palestine", description: "Executive floor with boardroom.", ...defaultSpecs, thumbnail: interiorImg, gallery: [interiorImg], photosCount: 9 },
    { id: "commercial-3", title: "Lobby", category: "commercial", categoryLabel: "Commercial", location: "Ramallah, Palestine", description: "Hotel lobby with double-height ceiling.", ...defaultSpecs, thumbnail: interiorImg, gallery: [interiorImg, interiorImg], photosCount: 13 },
    { id: "commercial-4", title: "Meeting Hall", category: "commercial", categoryLabel: "Commercial", location: "Ramallah, Palestine", description: "Conference and event space.", ...defaultSpecs, thumbnail: interiorImg, gallery: [interiorImg], photosCount: 7 },
    { id: "commercial-5", title: "Retail Front", category: "commercial", categoryLabel: "Commercial", location: "Ramallah, Palestine", description: "Street-level retail and signage.", ...defaultSpecs, thumbnail: interiorImg, gallery: [interiorImg, interiorImg], photosCount: 15 },
  ];
  const architectural: PortfolioProject[] = [
    { id: "architectural-1", title: "Villa Al-Masyoun", category: "architectural", categoryLabel: "Architectural", location: "Ramallah, Palestine", description: "Residential villa with clean volumes and natural light.", area: "4200 sq. ft.", client: "Private client", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg, exteriorImg], photosCount: 12 },
    { id: "architectural-2", title: "Cultural Center", category: "architectural", categoryLabel: "Architectural", location: "Ramallah, Palestine", description: "Public building with courtyard and shaded facades.", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg], photosCount: 10 },
    { id: "architectural-3", title: "House on the Hill", category: "architectural", categoryLabel: "Architectural", location: "Ramallah, Palestine", description: "Single-family home with panoramic views.", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg, exteriorImg], photosCount: 14 },
    { id: "architectural-4", title: "Extension & Renovation", category: "architectural", categoryLabel: "Architectural", location: "Ramallah, Palestine", description: "Existing building extended with a new wing.", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg], photosCount: 9 },
    { id: "architectural-5", title: "Mixed-Use Block", category: "architectural", categoryLabel: "Architectural", location: "Ramallah, Palestine", description: "Ground-floor commercial with residential above.", ...defaultSpecs, thumbnail: exteriorImg, gallery: [exteriorImg, exteriorImg], photosCount: 11 },
  ];
  const all = [...interior, ...landscape, ...exterior, ...commercial, ...architectural];
  const firstThreeInteriorIds = ["interior-1", "interior-2", "interior-3"];
  return all.map((p) => {
    const isInterior = p.category === "interior";
    const isLandscape = p.category === "landscape";
    const isArchitectural = p.category === "architectural";
    const isCommercial = p.category === "commercial";
    const interiorLevels = isInterior && firstThreeInteriorIds.includes(p.id) ? 2 : 1;
    const useScrollDrivenGallery = isInterior || isLandscape || isArchitectural || isCommercial;
    return {
      ...p,
      hasFloors: useScrollDrivenGallery,
      gallery: isInterior
        ? galleryWithLevels(p.gallery, interiorLevels)
        : isLandscape || isArchitectural || isCommercial
          ? galleryWithLevels(p.gallery, 1)
          : galleryWithMinImages(p.gallery),
    };
  });
}

/** Number of images per level; change this to adjust all sections. */
export const IMAGES_PER_LEVEL = 10;

/** Ensures gallery has IMAGES_PER_LEVEL images per level by repeating; returns flat array. */
export function galleryWithTenPerLevel(gallery: StaticImageData[]): StaticImageData[] {
  if (gallery.length === 0) return [];
  const out: StaticImageData[] = [];
  for (let i = 0; i < IMAGES_PER_LEVEL; i++) out.push(gallery[i % gallery.length]);
  return out;
}

/** Returns a flat gallery with `levelCount` levels, each having IMAGES_PER_LEVEL images. */
function galleryWithLevels(gallery: StaticImageData[], levelCount: number): StaticImageData[] {
  if (gallery.length === 0 || levelCount < 1) return [];
  const out: StaticImageData[] = [];
  for (let level = 0; level < levelCount; level++) {
    for (let i = 0; i < IMAGES_PER_LEVEL; i++) out.push(gallery[i % gallery.length]);
  }
  return out;
}

const GALLERY_MIN_IMAGES = 10;

/** Ensures gallery has at least GALLERY_MIN_IMAGES by repeating; for flat (non-floor) projects. */
function galleryWithMinImages(gallery: StaticImageData[], minCount: number = GALLERY_MIN_IMAGES): StaticImageData[] {
  if (gallery.length === 0) return [];
  const out: StaticImageData[] = [];
  for (let i = 0; i < minCount; i++) out.push(gallery[i % gallery.length]);
  return out;
}

export function getProjectById(projects: PortfolioProject[], id: string): PortfolioProject | undefined {
  return projects.find((p) => p.id === id);
}

export function getPrevNextIds(projects: PortfolioProject[], currentId: string): { prev: string | null; next: string | null } {
  const i = projects.findIndex((p) => p.id === currentId);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? projects[i - 1].id : null,
    next: i < projects.length - 1 ? projects[i + 1].id : null,
  };
}
