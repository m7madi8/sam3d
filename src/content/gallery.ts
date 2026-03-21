import type { StaticImageData } from "next/image";

export type GalleryProject = {
  id: string;
  title: string;
  subtitle?: string;
  image: StaticImageData;
  photosCount?: number;
};

export type GalleryCategory = {
  id: string;
  titleAr: string;
  titleEn: string;
  projects: GalleryProject[];
};

export function buildGalleryCategories(
  interiorImg: StaticImageData,
  landscapeImg: StaticImageData,
  exteriorImg: StaticImageData,
): GalleryCategory[] {
  const projectTitles: Record<string, string[]> = {
    interior: ["Palm Villa", "Duplex Apartment", "Guest House", "Reception Hall", "Modern Living"],
    landscape: ["Rooftop Garden", "Pool Terrace", "Shade Walk", "Inner Courtyard", "Front Layout"],
    architectural: ["Building A Facade", "East Wing", "Main Entrance", "Residential Tower", "Office Block"],
    commercial: ["Showroom", "Executive Office", "Lobby", "Meeting Hall", "Retail Front"],
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
        title: projectTitles.interior[i],
        subtitle: projectSubtitle.interior,
        image: interiorImg,
        photosCount: photoCounts.interior[i],
      })),
    },
    {
      id: "landscape",
      titleAr: "اللاندسكيب",
      titleEn: "Landscape",
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: `landscape-${i + 1}`,
        title: projectTitles.landscape[i],
        subtitle: projectSubtitle.landscape,
        image: landscapeImg,
        photosCount: photoCounts.landscape[i],
      })),
    },
    {
      id: "architectural",
      titleAr: "المعماري",
      titleEn: "Architectural",
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: `architectural-${i + 1}`,
        title: projectTitles.architectural[i],
        subtitle: projectSubtitle.architectural,
        image: exteriorImg,
        photosCount: photoCounts.architectural[i],
      })),
    },
    {
      id: "commercial",
      titleAr: "التجاري",
      titleEn: "Commercial",
      projects: Array.from({ length: 5 }, (_, i) => ({
        id: `commercial-${i + 1}`,
        title: projectTitles.commercial[i],
        subtitle: projectSubtitle.commercial,
        image: interiorImg,
        photosCount: photoCounts.commercial[i],
      })),
    },
  ];
}
