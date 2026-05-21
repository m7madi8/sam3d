import type { StaticImageData } from "next/image";
import { COMMERCIAL_PROJECT_IMAGES } from "@/content/commercialImages";
import { EXTERIOR_PROJECT_IMAGES } from "@/content/exteriorImages";
import { INTERIOR_PROJECT_IMAGES } from "@/content/interiorImages";
import { LANDSCAPE_PROJECT_IMAGES } from "@/content/landscapeImages";

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
    landscape: ["Rooftop Garden", "Pool Terrace", "Shade Walk", "Inner Courtyard", "Front Layout"],
    architectural: ["Building A Facade", "East Wing", "Main Entrance", "Residential Tower", "Office Block"],
    commercial: ["Jewelry Store", "Office", "Restaurant", "Cafe", "Clothing Store"],
  };
  const projectTitlesAr: Record<string, string[]> = {
    interior: ["فيلا النخيل", "شقة دوبلكس", "بيت الضيافة", "قاعة استقبال", "معيشة عصرية"],
    landscape: ["حديقة السطح", "تراس المسبح", "ممشى الظل", "فناء داخلي", "تنسيق الواجهة"],
    architectural: ["واجهة المبنى A", "الجناح الشرقي", "المدخل الرئيسي", "برج سكني", "مبنى مكاتب"],
    commercial: ["متجر مجوهرات", "مكتب", "مطعم", "مقهى", "متجر ملابس"],
  };
  const projectSubtitle: Record<string, string> = {
    interior: "Interior",
    landscape: "Landscape",
    architectural: "Architectural",
    commercial: "Commercial",
  };

  const photoCounts: Record<string, number[]> = {
    interior: [12, 8, 15, 10, 14],
    landscape: [9, 11, 7, 13, 10],
    architectural: [16, 10, 12, 8, 14],
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
        image: INTERIOR_PROJECT_IMAGES[i],
        photosCount: photoCounts.interior[i],
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
        image: LANDSCAPE_PROJECT_IMAGES[i],
        photosCount: photoCounts.landscape[i],
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
