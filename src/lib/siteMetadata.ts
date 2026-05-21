import type { Metadata } from "next";

export const SITE_NAME = "samarammar";

const DEFAULT_SITE_URL = "https://sam3d-sage.vercel.app";

/** Public site URL — set NEXT_PUBLIC_SITE_URL in Vercel for custom domains. */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL,
);

export const DEFAULT_OG_IMAGE = "/samarammarinterior-20260521-0001.jpg";

export const SITE_DESCRIPTION_EN =
  "Premium interior, landscape, architectural & commercial design by Samar Ammar. Dare to be different — Ramallah & worldwide.";

export const SITE_DESCRIPTION_AR =
  "سمر عمار — تصميم داخلي، لاندسكيب، عمارة، وتجاري. تجرأ أن تكون مختلفًا · رام الله وحول العالم.";

export const SITE_DESCRIPTION_BILINGUAL = `${SITE_DESCRIPTION_EN} | ${SITE_DESCRIPTION_AR}`;

export const SITE_TITLE_DEFAULT = "samarammar — Samar Ammar Studio";

function resolveImageUrl(image: string): string {
  return image.startsWith("http") ? image : new URL(image, siteUrl).toString();
}

export type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
};

/** Shared Open Graph + Twitter metadata for a route. */
export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION_BILINGUAL,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  imageAlt,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = new URL(canonicalPath, siteUrl).toString();
  const imageUrl = resolveImageUrl(image);
  const alt = imageAlt ?? `${SITE_NAME} — design studio`;

  return {
    title,
    description,
    metadataBase: siteUrl,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ["ar_PS"],
      url: pageUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const rootMetadata: Metadata = {
  ...createPageMetadata({
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION_BILINGUAL,
    path: "/",
    image: DEFAULT_OG_IMAGE,
    imageAlt: "samarammar interior design — Samar Ammar Studio",
  }),
  applicationName: SITE_NAME,
  keywords: [
    "samarammar",
    "Samar Ammar",
    "interior design",
    "landscape design",
    "architecture",
    "commercial design",
    "Ramallah",
    "Palestine",
    "تصميم داخلي",
    "لاندسكيب",
  ],
  authors: [{ name: "Samar Ammar" }],
  creator: "Samar Ammar",
};
