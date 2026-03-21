"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  buildPortfolioProjects,
  getProjectById,
  getPrevNextIds,
  IMAGES_PER_LEVEL,
  type PortfolioProject,
} from "@/content/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import interiorImage from "../../../interior.jpg";
import landscapeImage from "../../../landscape.jpg";
import exteriorImage from "../../../exterior.jpg";
import styles from "./project-detail.module.css";

gsap.registerPlugin(ScrollTrigger);

const projects = buildPortfolioProjects(interiorImage, landscapeImage, exteriorImage);

export function ProjectDetailView() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const project = getProjectById(projects, id);
  const reducedMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement | null>(null);
  const heroImageWrapRef = useRef<HTMLDivElement | null>(null);
  const heroOverlayRef = useRef<HTMLDivElement | null>(null);
  const heroRevealRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  if (!project) notFound();

  const { prev, next } = getPrevNextIds(projects, id);
  const year = project.year ?? "—";
  const locationLine = `${project.location}${year !== "—" ? ` (${year})` : ""}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const stagger = reducedMotion ? 0 : 0.1;
    const scrubVal = reducedMotion ? 0 : 1.2;

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    let refreshId: number | undefined;
    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      const heroImageWrap = heroImageWrapRef.current;
      const heroOverlay = heroOverlayRef.current;
      const heroReveal = heroRevealRef.current;
      const header = headerRef.current;
      const content = contentRef.current;
      const gallery = galleryRef.current;
      const footer = footerRef.current;

      if (!hero || !heroImageWrap || !heroOverlay || !heroReveal || !header) return;

      gsap.set(header, { autoAlpha: 0 });
      gsap.set(heroImageWrap, { scale: 1.08 });
      gsap.set(heroOverlay, { opacity: 0 });
      gsap.set(heroReveal.querySelectorAll("*"), { y: 28, autoAlpha: 0 });

      const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });
      heroTl
        .to(heroImageWrap, { scale: 1, duration: reducedMotion ? 0.01 : 1.1 })
        .to(heroOverlay, { opacity: 0.45, duration: reducedMotion ? 0.01 : 0.8 }, 0)
        .to(
          heroReveal.querySelectorAll("*"),
          { y: 0, autoAlpha: 1, duration: reducedMotion ? 0.01 : 0.85, stagger, ease: "power3.out" },
          reducedMotion ? 0 : 0.25
        );
      heroTl.add(() => {
        gsap.to(header, { autoAlpha: 1, duration: reducedMotion ? 0.01 : 0.5, ease: "power2.out" });
      }, reducedMotion ? 0 : 1);

      if (!reducedMotion) {
        gsap.to(heroImageWrap, {
          scale: 1.2,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: scrubVal,
          },
        });
        gsap.to(heroOverlay, {
          opacity: 0.65,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: scrubVal,
          },
        });
      }

      if (content && !reducedMotion) {
        const revealEls = content.querySelectorAll("[data-project-reveal]");
        if (revealEls.length) {
          gsap.fromTo(
            revealEls,
            { y: 32, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: content,
                start: "top 82%",
                end: "top 50%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      if (gallery && project.hasFloors && !reducedMotion) {
        const floorSections = gallery.querySelectorAll<HTMLElement>("[data-project-floor]");
        const vh = window.innerHeight;
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const firstStrip = floorSections[0]?.querySelector<HTMLElement>(`.${styles.floorGrid}`);
        const firstStripItems = firstStrip?.querySelectorAll<HTMLElement>(`.${styles.floorGridItem}`);
        const mobileItemWidth = isMobile && firstStripItems?.length ? (firstStripItems[0].offsetWidth || 0) : 0;
        const mobileGap = isMobile && firstStripItems && firstStripItems.length >= 2
          ? Math.max(0, (firstStripItems[1].offsetLeft || 0) - (firstStripItems[0].offsetLeft || 0) - (firstStripItems[0].offsetWidth || 0))
          : 8;
        floorSections.forEach((section) => {
          const strip = section.querySelector<HTMLElement>(`.${styles.floorGrid}`);
          if (!strip) return;
          const wrap = strip.parentElement;
          if (!wrap) return;
          gsap.set(strip, { x: 0 });
          const items = strip.querySelectorAll<HTMLElement>(`.${styles.floorGridItem}`);
          const count = items.length;
          const phantomSpace = isMobile ? window.innerWidth * 0.15 : 0;
          const stripWidth = isMobile && mobileItemWidth > 0 && count > 0
            ? count * mobileItemWidth + Math.max(0, count - 1) * mobileGap + phantomSpace
            : strip.scrollWidth;
          const visibleWidth = isMobile && mobileItemWidth > 0
            ? mobileItemWidth
            : (isMobile ? window.innerWidth * 0.8 : wrap.clientWidth);
          const maxScroll = Math.max(0, stripWidth - visibleWidth);
          if (maxScroll <= 0) return;
          const scrollDistance = vh;
          gsap.to(strip, {
            x: -maxScroll,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "center center",
              end: `+=${scrollDistance}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        });
      }

      if (gallery && !project.hasFloors && !reducedMotion) {
        const flatItems = gallery.querySelectorAll<HTMLElement>("[data-project-flat-item]");
        if (flatItems.length) {
          gsap.fromTo(
            flatItems,
            { scale: 0.96, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.04,
              ease: "power2.out",
              scrollTrigger: {
                trigger: gallery,
                start: "top 85%",
                end: "top 40%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      if (footer && !reducedMotion) {
        gsap.fromTo(
          footer,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 92%",
              end: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (reducedMotion) {
        gsap.set(header, { autoAlpha: 1 });
        gsap.set(heroImageWrap, { scale: 1 });
        gsap.set(heroOverlay, { opacity: 0.45 });
        gsap.set(heroReveal?.querySelectorAll("*") ?? [], { y: 0, autoAlpha: 1 });
        const revealEls = content?.querySelectorAll("[data-project-reveal]");
        if (revealEls?.length) gsap.set(revealEls, { y: 0, autoAlpha: 1 });
        const flatItems = gallery?.querySelectorAll("[data-project-flat-item]");
        if (flatItems?.length) gsap.set(flatItems, { scale: 1, autoAlpha: 1 });
        if (footer) gsap.set(footer, { autoAlpha: 1 });
      }

      refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    });

    return () => {
      if (refreshId != null) clearTimeout(refreshId);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [project?.id, project?.hasFloors, reducedMotion]);

  return (
    <div className={styles.page}>
      <header ref={headerRef} className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/gallery" className={styles.backBtn} aria-label="Back to gallery">
            Back
          </Link>
          <nav className={styles.nav} aria-label="Project navigation">
            <Link href="/gallery">Gallery</Link>
            {prev && (
              <Link href={`/gallery/${prev}`}>Prev</Link>
            )}
            {next && (
              <Link href={`/gallery/${next}`}>Next</Link>
            )}
          </nav>
        </div>
      </header>

      <section ref={heroRef} className={styles.hero}>
        <div ref={heroImageWrapRef} className={styles.heroImageWrap}>
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes="100vw"
            className={styles.heroImage}
            priority
          />
        </div>
        <div ref={heroOverlayRef} className={styles.heroOverlay} />
        <div className={styles.heroTitleBlock} ref={heroRevealRef} data-project-hero-reveal>
          <h1 className={styles.heroTitle}>{project.title}</h1>
          <p className={styles.heroMeta}>{locationLine}</p>
        </div>
      </section>

      <section ref={contentRef} className={styles.content}>
        <div className={styles.twoCol}>
          <div className={styles.colLeft} data-project-reveal>
            <p className={styles.descriptionShort}>{project.description}</p>
          </div>
          <div className={styles.colRight} data-project-reveal>
            <div className={styles.specCompact}>
              <span className={styles.specCompactItem}>{project.categoryLabel}</span>
              {project.status && <span className={styles.specCompactDot} aria-hidden="true">·</span>}
              {project.status && <span className={styles.specCompactItem}>{project.status}</span>}
            </div>
            {project.services && project.services.length > 0 && (
              <p className={styles.specServicesLine}>{project.services.join(" · ")}</p>
            )}
          </div>
        </div>
      </section>

      {project.gallery.length > 0 && (
        <section ref={galleryRef} className={styles.gallery}>
          {project.hasFloors ? (
            chunkBy(project.gallery, IMAGES_PER_LEVEL).map((images, levelIndex) => {
              const isLandscape = project.category === "landscape";
              const isArchitectural = project.category === "architectural";
              const isCommercial = project.category === "commercial";
              const singleGalleryCategory = isLandscape || isArchitectural || isCommercial;
              const sectionLabel = levelIndex === 0 && singleGalleryCategory ? "Gallery" : levelIndex === 0 ? "Ground" : String(levelIndex).padStart(2, "0");
              const sectionSubtitle = singleGalleryCategory ? "Photos" : "Floor";
              return (
                <article key={levelIndex} className={styles.floorSection} data-project-floor>
                  <div className={styles.floorLabel}>
                    <span className={styles.floorNumber}>{sectionLabel}</span>
                    <span className={styles.floorTitle}>{sectionSubtitle}</span>
                    <span className={styles.floorCount}>{images.length} photos</span>
                  </div>
                  <div className={styles.floorGridWrap}>
                    <div className={styles.floorGrid}>
                      {images.map((img, i) => (
                        <div key={i} className={styles.floorGridItem}>
                          <Image
                            src={img}
                            alt={`${project.title} — ${sectionLabel}, image ${i + 1}`}
                            fill
                            sizes="(max-width: 767px) 50vw, 12vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className={styles.flatGallery}>
              <div className={styles.flatGalleryGrid}>
                {project.gallery.map((img, i) => (
                  <div key={i} className={styles.flatGalleryItem} data-project-flat-item>
                    <Image
                      src={img}
                      alt={`${project.title} — image ${i + 1}`}
                      fill
                      sizes="(max-width: 767px) 50vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <footer ref={footerRef} className={styles.footerStrip} data-project-footer>
        <Link href="/">Home</Link>
        {" · "}
        <Link href="/gallery">Gallery</Link>
        {" · "}
        <Link href="/#contact">Contact</Link>
        {" · "}
        <span>© {new Date().getFullYear()} samarammar. All rights reserved.</span>
      </footer>

      <div className={styles.mobileBackBar} aria-hidden="false">
        <Link href="/gallery" className={styles.mobileBackBtn} aria-label="Back to gallery">
          Back to Gallery
        </Link>
      </div>
    </div>
  );
}

function chunkBy<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}
