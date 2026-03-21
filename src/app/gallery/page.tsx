import { Suspense } from "react";
import { GalleryExperience } from "@/components/site/GalleryExperience";

export const metadata = {
  title: "المعرض | samarammar",
  description: "معرض مشاريع samarammar — داخلي، لاندسكيب، معماري، تجاري.",
};

export default function GalleryPage() {
  return (
    <Suspense fallback={null}>
      <GalleryExperience />
    </Suspense>
  );
}
