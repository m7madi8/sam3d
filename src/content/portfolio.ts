import type { StaticImageData } from "next/image";
import { COMMERCIAL_PROJECT_IMAGES } from "@/content/commercialImages";
import { EXTERIOR_PROJECT_IMAGES } from "@/content/exteriorImages";
import { INTERIOR_PROJECT_IMAGES } from "@/content/interiorImages";
import { LANDSCAPE_PROJECT_IMAGES } from "@/content/landscapeImages";
import { PALM_VILLA_IMAGES } from "@/content/palmVillaImages";

type PortfolioImage = StaticImageData | string;

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
  thumbnail: PortfolioImage;
  gallery: PortfolioImage[];
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
  /** If true, gallery is rendered at each image's original aspect ratio (no crop, single set). */
  originalSize?: boolean;
};

export const PORTFOLIO_CATEGORIES: { id: PortfolioCategoryId; label: string }[] = [
  { id: "interior", label: "Interior" },
  { id: "landscape", label: "Landscape" },
  { id: "exterior", label: "Exterior" },
  { id: "commercial", label: "Commercial" },
  { id: "architectural", label: "Architectural" },
];

export function buildPortfolioProjects(): PortfolioProject[] {
  const defaultSpecs = {
    status: "Completed",
    services: ["Interior planning", "Spatial planning", "Furniture curation", "Project coordination"],
    year: "2024",
  };
  const interior: PortfolioProject[] = INTERIOR_PROJECT_IMAGES.map((img, i) => {
    const titles = ["Palm Villa", "Duplex Apartment", "Guest House", "Reception Hall", "Modern Living"];
    const descriptions = [
      "Villa interior with natural materials and open spaces. Warm tones and calm living.",
      "Modern duplex with double-height living. Focus and collaboration zones.",
      "Minimalist guest pavilion with courtyard views.",
      "Grand reception with custom joinery. Flexible for events.",
      "Open-plan living with integrated kitchen.",
    ];
    const areas = ["4500 sq. ft.", "3200 sq. ft.", "1800 sq. ft.", "5600 sq. ft.", "2800 sq. ft."];
    const photosCounts = [12, 8, 15, 10, 14];
    const materials = i === 0 ? "Oak, marble, linen" : i === 1 ? "Concrete, wood, brass" : i === 3 ? "Oak, brass" : undefined;
    const client = i === 3 ? "Corporate client" : "Private client";
    // Palm Villa (interior-1) uses its real photo set, shown at original aspect ratio.
    const isPalmVilla = i === 0;
    return {
      id: `interior-${i + 1}`,
      title: titles[i],
      category: "interior" as const,
      categoryLabel: "Interior",
      location: "Ramallah, Palestine",
      description: descriptions[i],
      materials,
      area: areas[i],
      client,
      ...defaultSpecs,
      thumbnail: isPalmVilla ? PALM_VILLA_IMAGES[0] : img,
      gallery: isPalmVilla ? PALM_VILLA_IMAGES : [img],
      photosCount: isPalmVilla ? PALM_VILLA_IMAGES.length : photosCounts[i],
      originalSize: isPalmVilla || undefined,
    };
  });
  const landscape: PortfolioProject[] = LANDSCAPE_PROJECT_IMAGES.map((img, i) => {
    const titles = ["Rooftop Garden", "Pool Terrace", "Shade Walk", "Inner Courtyard", "Front Layout"];
    const descriptions = [
      "Rooftop garden with native planting.",
      "Infinity pool and terrace with desert views.",
      "Shaded walkway with water feature.",
      "Central courtyard with olive trees.",
      "Front garden and approach design.",
    ];
    const areas = ["2200 sq. ft.", "3500 sq. ft.", undefined, undefined, undefined];
    const photosCounts = [9, 11, 7, 13, 10];
    return {
      id: `landscape-${i + 1}`,
      title: titles[i],
      category: "landscape" as const,
      categoryLabel: "Landscape",
      location: "Ramallah, Palestine",
      description: descriptions[i],
      area: areas[i],
      client: "Private client",
      ...defaultSpecs,
      thumbnail: img,
      gallery: [img],
      photosCount: photosCounts[i],
    };
  });
  const exterior: PortfolioProject[] = EXTERIOR_PROJECT_IMAGES.map((img, i) => {
    const titles = ["Building A Facade", "East Wing", "Main Entrance", "Residential Tower", "Office Block"];
    const descriptions = [
      "Contemporary facade with vertical fins.",
      "Residential wing with screened terraces.",
      "Monumental entrance and porte-cochère.",
      "High-rise residential with brise-soleil.",
      "Corporate headquarters facade.",
    ];
    const areas = ["18000 sq. ft.", undefined, undefined, "24000 sq. ft.", undefined];
    const photosCounts = [16, 10, 12, 8, 14];
    const client = i === 0 ? "Development client" : i === 3 ? "Developer" : undefined;
    return {
      id: `exterior-${i + 1}`,
      title: titles[i],
      category: "exterior" as const,
      categoryLabel: "Exterior",
      location: "Ramallah, Palestine",
      description: descriptions[i],
      area: areas[i],
      client,
      ...defaultSpecs,
      thumbnail: img,
      gallery: [img],
      photosCount: photosCounts[i],
    };
  });
  const commercial: PortfolioProject[] = COMMERCIAL_PROJECT_IMAGES.map((img, i) => {
    const titles = ["Jewelry Store", "Office", "Restaurant", "Cafe", "Clothing Store"];
    const descriptions = [
      "Luxury retail with bespoke display and lighting.",
      "Executive workspace with refined material palette.",
      "Restaurant interior balancing atmosphere and flow.",
      "Cafe design with warm, inviting character.",
      "Street-level retail and signage with strong brand presence.",
    ];
    const areas = ["12000 sq. ft.", undefined, undefined, undefined, undefined];
    const photosCounts = [11, 9, 13, 7, 15];
    const client = i === 0 ? "Brand client" : undefined;
    return {
      id: `commercial-${i + 1}`,
      title: titles[i],
      category: "commercial" as const,
      categoryLabel: "Commercial",
      location: "Ramallah, Palestine",
      description: descriptions[i],
      area: areas[i],
      client,
      ...defaultSpecs,
      thumbnail: img,
      gallery: [img],
      photosCount: photosCounts[i],
    };
  });
  const architectural: PortfolioProject[] = EXTERIOR_PROJECT_IMAGES.map((img, i) => {
    const titles = ["Villa Al-Masyoun", "Cultural Center", "House on the Hill", "Extension & Renovation", "Mixed-Use Block"];
    const descriptions = [
      "Residential villa with clean volumes and natural light.",
      "Public building with courtyard and shaded facades.",
      "Single-family home with panoramic views.",
      "Existing building extended with a new wing.",
      "Ground-floor commercial with residential above.",
    ];
    const areas = ["4200 sq. ft.", undefined, undefined, undefined, undefined];
    const photosCounts = [12, 10, 14, 9, 11];
    return {
      id: `architectural-${i + 1}`,
      title: titles[i],
      category: "architectural" as const,
      categoryLabel: "Architectural",
      location: "Ramallah, Palestine",
      description: descriptions[i],
      area: areas[i],
      client: "Private client",
      ...defaultSpecs,
      thumbnail: img,
      gallery: [img],
      photosCount: photosCounts[i],
    };
  });
  const all = [...interior, ...landscape, ...exterior, ...commercial, ...architectural];
  const firstThreeInteriorIds = ["interior-1", "interior-2", "interior-3"];
  return all.map((p) => {
    // Original-size projects (e.g. Palm Villa) keep their real photos as a single set, no floors.
    if (p.originalSize) {
      return { ...p, hasFloors: false };
    }
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
export function galleryWithTenPerLevel(gallery: PortfolioImage[]): PortfolioImage[] {
  if (gallery.length === 0) return [];
  const out: PortfolioImage[] = [];
  for (let i = 0; i < IMAGES_PER_LEVEL; i++) out.push(gallery[i % gallery.length]);
  return out;
}

/** Returns a flat gallery with `levelCount` levels, each having IMAGES_PER_LEVEL images. */
function galleryWithLevels(gallery: PortfolioImage[], levelCount: number): PortfolioImage[] {
  if (gallery.length === 0 || levelCount < 1) return [];
  const out: PortfolioImage[] = [];
  for (let level = 0; level < levelCount; level++) {
    for (let i = 0; i < IMAGES_PER_LEVEL; i++) out.push(gallery[i % gallery.length]);
  }
  return out;
}

const GALLERY_MIN_IMAGES = 10;

/** Ensures gallery has at least GALLERY_MIN_IMAGES by repeating; for flat (non-floor) projects. */
function galleryWithMinImages(gallery: PortfolioImage[], minCount: number = GALLERY_MIN_IMAGES): PortfolioImage[] {
  if (gallery.length === 0) return [];
  const out: PortfolioImage[] = [];
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
