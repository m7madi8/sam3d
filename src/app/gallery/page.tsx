import { Suspense } from "react";
import { GalleryExperience } from "@/components/site/GalleryExperience";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Gallery | samarammar — المعرض",
  description:
    "Explore samarammar projects — interior, landscape, architecture & commercial design. | معرض مشاريع سمر عمار — داخلي، لاندسكيب، معماري، تجاري.",
  path: "/gallery",
  imageAlt: "samarammar design gallery",
});

export default function GalleryPage() {
  return (
    <Suspense fallback={null}>
      <GalleryExperience />
    </Suspense>
  );
}
