"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { PortfolioProject } from "@/content/portfolio";

type ProjectCardProps = {
  project: PortfolioProject;
  index: number;
  onOpen: (el: HTMLButtonElement | null) => void;
};

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  return (
    <motion.button
      type="button"
      ref={cardRef}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[2/3] w-full overflow-hidden rounded-2xl bg-neutral-200 shadow-lg text-left"
      onClick={() => onOpen(cardRef.current)}
      aria-label={`View ${project.title}`}
    >
      <motion.div
        className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-110"
        layoutId={`project-${project.id}-image`}
      >
        <Image
          src={project.thumbnail}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 z-[3] translate-y-4 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/90">{project.categoryLabel}</p>
        <h3 className="mt-1 text-xl font-semibold text-white">{project.title}</h3>
        <p className="mt-0.5 text-sm text-white/80">{project.location}</p>
      </div>
    </motion.button>
  );
}
