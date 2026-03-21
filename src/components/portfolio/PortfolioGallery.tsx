"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { FilterBar } from "@/components/portfolio/FilterBar";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import {
  buildPortfolioProjects,
  PORTFOLIO_CATEGORIES,
  type PortfolioCategoryId,
  type PortfolioProject,
} from "@/content/portfolio";
import interiorImage from "../../../interior.jpg";
import landscapeImage from "../../../landscape.jpg";
import exteriorImage from "../../../exterior.jpg";
import brandLogo from "../../../white-logo.png";

const projects = buildPortfolioProjects(interiorImage, landscapeImage, exteriorImage);
const layoutEase = [0.25, 0.46, 0.45, 0.94] as const;

const menuItems = [
  { label: "Home", ariaLabel: "Back to home", link: "/" },
  { label: "Gallery", ariaLabel: "Gallery page", link: "/gallery" },
  { label: "Services", ariaLabel: "Services section", link: "/#services" },
  { label: "About", ariaLabel: "About section", link: "/#about" },
  { label: "Location", ariaLabel: "Location section", link: "/#location" },
  { label: "Contact", ariaLabel: "Contact section", link: "/#contact" },
];

export function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategoryId | "all">("all");
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const zoomContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    if (!activeProject || !sourceRect || !zoomContainerRef.current) return;

    const el = zoomContainerRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    gsap.set(el, {
      x: sourceRect.left,
      y: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
      borderRadius: "1.5rem",
    });

    gsap.to(el, {
      x: 0,
      y: 0,
      width: vw,
      height: vh,
      borderRadius: 0,
      duration: 0.9,
      ease: "power3.inOut",
    });
  }, [activeProject, sourceRect]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[var(--surface-primary)] text-[var(--text-primary)]">
      <FullscreenMenu
        brand="SAMARAMMAR"
        items={menuItems}
        logoSrc={brandLogo.src}
        logoAlt="samarammar logo"
        showThemeToggle={false}
      />

      <PortfolioHero subtitle="Selected Work" />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <FilterBar
            categories={PORTFOLIO_CATEGORIES}
            activeFilter={activeFilter}
            onFilter={setActiveFilter}
          />
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-8"
          transition={{ layout: { duration: 0.4, ease: layoutEase } }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={(el) => {
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  setSourceRect(rect);
                  setActiveProject(project);
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {activeProject && (
            <motion.div
              key={activeProject.id}
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                className="absolute right-6 top-6 z-[90] rounded-full bg-black/60 px-4 py-2 text-sm font-medium uppercase tracking-wide text-white shadow-lg hover:bg-black"
                onClick={() => setActiveProject(null)}
                aria-label="Close project view"
              >
                إغلاق
              </button>

              <div
                ref={zoomContainerRef}
                className="pointer-events-none fixed left-0 top-0 z-[85] overflow-hidden bg-neutral-900 shadow-2xl"
              >
                <div className="absolute inset-0">
                  <activeProject.image.component
                    alt={activeProject.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                    {activeProject.categoryLabel}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    {activeProject.title}
                  </h2>
                  {activeProject.location && (
                    <p className="mt-1 text-sm text-white/80">{activeProject.location}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
