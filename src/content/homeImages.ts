import type { StaticImageData } from "next/image";
import heroImage from "../../public/home.jpg";
import serviceInterior from "../../public/interior/download (2).jpg";
import { LANDSCAPE_02_IMAGES } from "@/content/landscape02Images";
import serviceArchitectural from "../../public/exterior/Sleek black modern villa with minimal design Wallpaper.jpg";
import serviceCommercial from "../../public/commercial/download.jpg";

/** Homepage hero and service panels — static imports for full-resolution Next/Image optimization. */
export const HOME_HERO_IMAGE: StaticImageData = heroImage;

export const HOME_SERVICE_IMAGES: Record<string, StaticImageData> = {
  interior: serviceInterior,
  landscape: LANDSCAPE_02_IMAGES[0],
  architectural: serviceArchitectural,
  commercial: serviceCommercial,
};
