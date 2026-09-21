import type { StaticImageData } from "next/image";
import heroImage from "../../public/home.jpg";
import serviceInterior from "../../public/interior/download (2).jpg";
import serviceLandscape from "../../public/landscape/Modern Mansion Garden with Luxury Landscaping _ Luxury Modern Mansion Garden That People Love it.jpg";
import serviceArchitectural from "../../public/exterior/Sleek black modern villa with minimal design Wallpaper.jpg";
import serviceCommercial from "../../public/commercial/download.jpg";

/** Homepage hero and service panels — static imports for full-resolution Next/Image optimization. */
export const HOME_HERO_IMAGE: StaticImageData = heroImage;

export const HOME_SERVICE_IMAGES: Record<string, StaticImageData> = {
  interior: serviceInterior,
  landscape: serviceLandscape,
  architectural: serviceArchitectural,
  commercial: serviceCommercial,
};
