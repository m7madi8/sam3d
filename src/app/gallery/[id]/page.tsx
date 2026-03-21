import { Suspense } from "react";
import { ProjectDetailView } from "@/components/portfolio/ProjectDetailView";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `${id.replace(/-/g, " ")} | Portfolio | samarammar`,
    description: `Project detail — ${id}`,
  };
}

export default function GalleryProjectPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--surface-primary)]" />}>
      <ProjectDetailView />
    </Suspense>
  );
}
