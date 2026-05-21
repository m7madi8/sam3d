import { Suspense } from "react";
import { ProjectDetailView } from "@/components/portfolio/ProjectDetailView";
import {
  findGalleryProjectById,
  getGalleryProjectImagePath,
} from "@/content/gallery";
import { createPageMetadata } from "@/lib/siteMetadata";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const project = findGalleryProjectById(id);

  if (!project) {
    return createPageMetadata({
      title: `Project | samarammar`,
      description: "samarammar design project.",
      path: `/gallery/${id}`,
    });
  }

  return createPageMetadata({
    title: `${project.titleEn} | ${project.titleAr} — samarammar`,
    description: `${project.titleEn} — ${project.subtitle ?? "Design"} project by samarammar. | ${project.titleAr} — مشروع ${project.subtitle ?? "تصميم"} من سمر عمار.`,
    path: `/gallery/${id}`,
    image: getGalleryProjectImagePath(project.image),
    imageAlt: `${project.titleEn} — samarammar`,
  });
}

export default function GalleryProjectPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--surface-primary)]" />}>
      <ProjectDetailView />
    </Suspense>
  );
}
