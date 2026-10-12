import type { StaticImageData } from "next/image";
import { COMMERCIAL_PROJECT_IMAGES } from "@/content/commercialImages";
import { EXTERIOR_PROJECT_IMAGES } from "@/content/exteriorImages";
import { EXTERIOR_01_IMAGES } from "@/content/exterior01Images";
import { EXTERIOR_02_IMAGES } from "@/content/exterior02Images";
import { INTERIOR_PROJECT_IMAGES } from "@/content/interiorImages";
import { LANDSCAPE_PROJECT_IMAGES } from "@/content/landscapeImages";
import { LANDSCAPE_01_IMAGES } from "@/content/landscape01Images";
import { LANDSCAPE_02_IMAGES } from "@/content/landscape02Images";
import { LANDSCAPE_02_TARAS_IMAGES } from "@/content/landscape02TarasImages";
import { LANDSCAPE_03_IMAGES } from "@/content/landscape03Images";
import { LANDSCAPE_04_IMAGES } from "@/content/landscape04Images";
import { LANDSCAPE_05_IMAGES } from "@/content/landscape05Images";
import { PALM_VILLA_IMAGES } from "@/content/palmVillaImages";

const EXTERIOR_REAL_IMAGE_SETS = [EXTERIOR_01_IMAGES, EXTERIOR_02_IMAGES];

const LANDSCAPE_REAL_IMAGE_SETS = [
  LANDSCAPE_01_IMAGES,
  LANDSCAPE_02_IMAGES,
  LANDSCAPE_03_IMAGES,
  LANDSCAPE_04_IMAGES,
  LANDSCAPE_05_IMAGES,
];

export type GalleryImage = StaticImageData | string;

export type GalleryProject = {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitle?: string;
  image: GalleryImage;
  photosCount?: number;
};

export type GalleryCategory = {
  id: string;
  titleAr: string;
  titleEn: string;
  projects: GalleryProject[];
};

export function buildGalleryCategories(): GalleryCategory[] {
  const projectTitlesEn: Record<string, string[]> = {
    interior: ["Palm Villa", "Duplex Apartment", "Guest House", "Reception Hall", "Modern Living"],
    landscape: ["Wedding Hall", "Palace Garden", "Villa Garden", "Terraced Garden", "Estate Landscape"],
    exterior: ["Building A Facade", "East Wing", "Main Entrance", "Residential Tower", "Office Block"],
    architectural: ["Villa Al-Masyoun", "Cultural Center", "House on the Hill", "Extension & Renovation", "Mixed-Use Block"],
    commercial: ["Jewelry Store", "Office", "Restaurant", "Cafe", "Clothing Store"],
  };
  const projectTitlesAr: Record<string, string[]> = {
    interior: ["فيلا النخيل", "شقة دوبلكس", "بيت الضيافة", "قاعة استقبال", "معيشة عصرية"],
    landscape: ["قاعة أفراح", "حديقة قصر", "حديقة فيلا", "حديقة مدرّجة", "لاندسكيب عقار"],
    exterior: ["واجهة المبنى A", "الجناح الشرقي", "المدخل الرئيسي", "برج سكني", "مبنى مكاتب"],
    architectural: ["فيلا المصيون", "مركز ثقافي", "بيت على التل", "توسعة وترميم", "مبنى متعدد الاستخدام"],
    commercial: ["متجر مجوهرات", "مكتب", "مطعم", "مقهى", "متجر ملابس"],
  };
  const projectSubtitle: Record<string, string> = {
    interior: "Interior",
    landscape: "Landscape",
    exterior: "Exterior",
    architectural: "Architectural",
    commercial: "Commercial",
  };

  const photoCounts: Record<string, number[]> = {
    interior: [12, 8, 15, 10, 14],
    landscape: [9, 11, 7, 13, 10],
    exterior: [16, 10, 12, 8, 14],
    architectural: [12, 10, 14, 9, 11],
    commercial: [11, 9, 13, 7, 15],
  };

  return [
    {
      id: "interior",
      titleAr: "الداخلي",
      titleEn: "Interior",
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: `interior-${i + 1}`,
        titleEn: projectTitlesEn.interior[i],
        titleAr: projectTitlesAr.interior[i],
        subtitle: projectSubtitle.interior,
        image: i === 0 ? PALM_VILLA_IMAGES[0] : INTERIOR_PROJECT_IMAGES[i],
        photosCount: i === 0 ? PALM_VILLA_IMAGES.length : photoCounts.interior[i],
      })),
    },
    {
      id: "landscape",
      titleAr: "اللاندسكيب",
      titleEn: "Landscape",
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: `landscape-${i + 1}`,
        titleEn: projectTitlesEn.landscape[i],
        titleAr: projectTitlesAr.landscape[i],
        subtitle: projectSubtitle.landscape,
        image: LANDSCAPE_REAL_IMAGE_SETS[i]?.[0] ?? LANDSCAPE_PROJECT_IMAGES[i],
        photosCount:
          i === 1
            ? LANDSCAPE_02_IMAGES.length + LANDSCAPE_02_TARAS_IMAGES.length
            : LANDSCAPE_REAL_IMAGE_SETS[i]?.length ?? photoCounts.landscape[i],
      })),
    },
    {
      id: "exterior",
      titleAr: "الخارجي",
      titleEn: "Exterior",
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: `exterior-${i + 1}`,
        titleEn: projectTitlesEn.exterior[i],
        titleAr: projectTitlesAr.exterior[i],
        subtitle: projectSubtitle.exterior,
        image: EXTERIOR_REAL_IMAGE_SETS[i]?.[0] ?? EXTERIOR_PROJECT_IMAGES[i],
        photosCount: EXTERIOR_REAL_IMAGE_SETS[i]?.length ?? photoCounts.exterior[i],
      })),
    },
    {
      id: "architectural",
      titleAr: "المعماري",
      titleEn: "Architectural",
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: `architectural-${i + 1}`,
        titleEn: projectTitlesEn.architectural[i],
        titleAr: projectTitlesAr.architectural[i],
        subtitle: projectSubtitle.architectural,
        image: EXTERIOR_PROJECT_IMAGES[i],
        photosCount: photoCounts.architectural[i],
      })),
    },
    {
      id: "commercial",
      titleAr: "التجاري",
      titleEn: "Commercial",
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: `commercial-${i + 1}`,
        titleEn: projectTitlesEn.commercial[i],
        titleAr: projectTitlesAr.commercial[i],
        subtitle: projectSubtitle.commercial,
        image: COMMERCIAL_PROJECT_IMAGES[i],
        photosCount: photoCounts.commercial[i],
      })),
    },
  ];
}

export function getGalleryProjectImagePath(image: GalleryImage): string {
  return typeof image === "string" ? image : image.src;
}

export function findGalleryProjectById(id: string): GalleryProject | null {
  for (const category of buildGalleryCategories()) {
    const project = category.projects.find((p) => p.id === id);
    if (project) return project;
  }
  return null;
}
