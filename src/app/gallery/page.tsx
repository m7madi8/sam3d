import { GalleryExperience } from "@/components/gallery/GalleryExperience";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Gallery",
  description:
    "Explore samarammar projects — interior, landscape, architecture & commercial design. | معرض مشاريع سمر عمار — داخلي، لاندسكيب، معماري، تجاري.",
  path: "/gallery",
  imageAlt: "samarammar design gallery",
});

type GalleryPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { category } = await searchParams;
  return <GalleryExperience initialCategory={category} />;
}
