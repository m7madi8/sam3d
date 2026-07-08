"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  buildPortfolioProjects,
  getProjectById,
  getPrevNextIds,
  IMAGES_PER_LEVEL,
} from "@/content/portfolio";
import { getProjectDisplayLabels } from "@/content/projectDisplay";
import { getSiteMenuItems } from "@/content/navigation";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import { useLanguage } from "@/components/site/LanguageProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IMAGE_QUALITY, IMAGE_SIZES } from "@/lib/imageConfig";
import brandLogo from "../../../white-logo.png";
import styles from "./project-detail.module.css";

gsap.registerPlugin(ScrollTrigger);

const THEME_STORAGE_KEY = "sam3d-theme";
const projects = buildPortfolioProjects();

const STATUS_AR: Record<string, string> = {
  Completed: "مكتمل",
};

export function ProjectDetailView() {
  const { tr } = useLanguage();
  const reducedMotion = useReducedMotion();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const project = getProjectById(projects, id);
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!project) notFound();

  const display = getProjectDisplayLabels(project.id);
  const title = display?.titleEn
    ? tr(display.titleEn, display.titleAr ?? project.title)
    : project.title;
  const categoryLabel = display?.categoryEn
    ? tr(display.categoryEn, display.categoryAr ?? project.categoryLabel)
    : project.categoryLabel;

  const projectIndex = String(projects.findIndex((p) => p.id === id) + 1).padStart(2, "0");
  const { prev, next } = getPrevNextIds(projects, id);
  const year = project.year ?? "—";
  const photoTotal = project.photosCount ?? project.gallery.length;
  const galleryCount = project.gallery.length;

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((v) => (v === null ? v : (v - 1 + galleryCount) % galleryCount)),
    [galleryCount],
  );
  const showNext = useCallback(
    () => setLightboxIndex((v) => (v === null ? v : (v + 1) % galleryCount)),
    [galleryCount],
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX.current;
      const dy = t.clientY - touchStartY.current;
      touchStartX.current = null;
      touchStartY.current = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) showNext();
        else showPrev();
      }
    },
    [showNext, showPrev],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    lenisRef.current?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenisRef.current?.start();
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      const frame = requestAnimationFrame(() => setTheme(stored));
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    gsap.set(root.querySelectorAll("[data-project-entry]"), { opacity: 0, y: 18 });
  }, [id, reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reducedMotion) {
      root.querySelectorAll<HTMLElement>("[data-project-entry]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    } else {
      gsap.to(root.querySelectorAll("[data-project-entry]"), {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.1,
      });
    }

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    let refreshId: number | undefined;
    const ctx = gsap.context(() => {
      const revealEls = root.querySelectorAll("[data-project-reveal]");
      if (revealEls.length && !reducedMotion) {
        gsap.fromTo(
          revealEls,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: revealEls[0],
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 450);
    }, root);

    return () => {
      if (refreshId != null) clearTimeout(refreshId);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
      lenisRef.current = null;
      cancelAnimationFrame(rafId);
    };
  }, [project.id, project.hasFloors, reducedMotion, id]);

  const menuItems = getSiteMenuItems(tr);

  return (
    <div ref={rootRef} className={styles.pageShell}>
      <FullscreenMenu
        brand="SAMARAMMAR"
        logoSrc={brandLogo}
        logoAlt="samarammar"
        items={menuItems}
        showLangToggle
        showThemeToggle
        theme={theme}
        setTheme={setTheme}
      />

      <main className={styles.projectRoot}>
        <div className={styles.projectStage} data-project-entry>
          <div className={styles.projectIntro}>
            <span className={styles.projectIndex} aria-hidden>
              {projectIndex}
            </span>
            <p className={styles.projectKicker}>
              {categoryLabel} · {tr("Project", "مشروع")}
            </p>
            <h1 className={styles.projectTitle}>{title}</h1>
            <p className={styles.projectMeta}>
              {project.location}
              {year !== "—" ? ` · ${year}` : ""}
            </p>
            <div className={styles.projectActions}>
              <Link href="/gallery" className={styles.backLink}>
                <span>{tr("← Gallery", "← المعرض")}</span>
              </Link>
              <Link href="/#contact" className={styles.ctaLink} scroll={false}>
                <span>{tr("Start a project", "ابدأ مشروعًا")}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <figure className={styles.heroMat}>
              <div className={styles.heroMatFrame}>
                <div className={styles.heroImageWrap}>
                  <Image
                    src={project.thumbnail}
                    alt={title}
                    fill
                    sizes={IMAGE_SIZES.galleryHero}
                    quality={IMAGE_QUALITY.hero}
                    className={styles.heroImage}
                    priority
                  />
                </div>
                <figcaption className={styles.heroCaption}>
                  {photoTotal} {tr("photos", "صورة")}
                </figcaption>
              </div>
          </figure>
        </div>

        <section className={styles.briefSection} data-project-entry>
          <div className={styles.briefPanel} data-project-reveal>
            <p className={styles.briefLabel}>{tr("Project brief", "ملخص المشروع")}</p>
            <p className={styles.briefText}>{project.description}</p>
            {project.descriptionSecondary ? (
              <p className={styles.briefTextMuted}>{project.descriptionSecondary}</p>
            ) : null}
          </div>

          <ul className={styles.specGrid} data-project-reveal>
            {project.status ? (
              <li className={styles.specItem}>
                <span className={styles.specKey}>{tr("Status", "الحالة")}</span>
                <span className={styles.specValue}>
                  {tr(project.status, STATUS_AR[project.status] ?? project.status)}
                </span>
              </li>
            ) : null}
            {project.area ? (
              <li className={styles.specItem}>
                <span className={styles.specKey}>{tr("Area", "المساحة")}</span>
                <span className={styles.specValue}>{project.area}</span>
              </li>
            ) : null}
            {project.client ? (
              <li className={styles.specItem}>
                <span className={styles.specKey}>{tr("Client", "العميل")}</span>
                <span className={styles.specValue}>{project.client}</span>
              </li>
            ) : null}
            {project.materials ? (
              <li className={styles.specItem}>
                <span className={styles.specKey}>{tr("Materials", "المواد")}</span>
                <span className={styles.specValue}>{project.materials}</span>
              </li>
            ) : null}
            {project.services && project.services.length > 0 ? (
              <li className={`${styles.specItem} ${styles.specItemWide}`}>
                <span className={styles.specKey}>{tr("Scope", "النطاق")}</span>
                <span className={styles.specValue}>{project.services.join(" · ")}</span>
              </li>
            ) : null}
          </ul>
        </section>

        {project.gallery.length > 0 ? (
          <section className={styles.gallerySection} aria-label={tr("Project gallery", "معرض المشروع")}>
            <div className={styles.gallerySectionHead} data-project-entry>
              <div className={styles.gallerySectionTitleWrap}>
                <span className={styles.gallerySectionIndex} aria-hidden>
                  {projectIndex}
                </span>
                <h2 className={styles.gallerySectionTitle}>{tr("Visual story", "القصة البصرية")}</h2>
              </div>
              <p className={styles.gallerySectionMeta}>
                {photoTotal} {tr("frames", "إطار")}
              </p>
            </div>

            {project.originalSize ? (
              <div className={styles.stripWrap} data-project-entry>
                <div className={styles.originalStrip}>
                  {project.gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      className={styles.originalSlide}
                      onClick={() => openLightbox(i)}
                      aria-label={tr("View image", "عرض الصورة")}
                      data-project-reveal
                    >
                      <Image
                        src={img}
                        alt={`${title} — ${i + 1}`}
                        sizes={IMAGE_SIZES.projectOriginalItem}
                        quality={IMAGE_QUALITY.gallery}
                        className={styles.originalSlideImage}
                      />
                      <span className={styles.originalIndex} aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : project.hasFloors ? (
              chunkBy(project.gallery, IMAGES_PER_LEVEL).map((images, levelIndex) => {
                const isLandscape = project.category === "landscape";
                const isArchitectural = project.category === "architectural";
                const isCommercial = project.category === "commercial";
                const singleGalleryCategory = isLandscape || isArchitectural || isCommercial;
                const sectionLabel =
                  levelIndex === 0 && singleGalleryCategory
                    ? tr("Gallery", "المعرض")
                    : levelIndex === 0
                      ? tr("Ground", "الأرضي")
                      : String(levelIndex).padStart(2, "0");
                const sectionSubtitle = singleGalleryCategory ? tr("Photos", "صور") : tr("Floor", "طابق");

                return (
                  <article key={levelIndex} className={styles.floorBlock} data-project-entry>
                    <div className={styles.floorHead}>
                      <span className={styles.floorIndex}>{String(levelIndex + 1).padStart(2, "0")}</span>
                      <div className={styles.floorTitles}>
                        <h3 className={styles.floorTitle}>{sectionLabel}</h3>
                        <p className={styles.floorSubtitle}>{sectionSubtitle}</p>
                      </div>
                      <span className={styles.floorCount}>
                        {images.length} {tr("photos", "صورة")}
                      </span>
                    </div>
                    <div className={styles.stripWrap}>
                      <div className={styles.photoStrip}>
                        {images.map((img, i) => {
                          const globalIndex = levelIndex * IMAGES_PER_LEVEL + i;
                          return (
                            <div key={i} className={styles.stripItem}>
                              <button
                                type="button"
                                className={styles.stripMat}
                                onClick={() => openLightbox(globalIndex)}
                                aria-label={tr("View image", "عرض الصورة")}
                              >
                                <Image
                                  src={img}
                                  alt={`${title} — ${sectionLabel}, ${i + 1}`}
                                  fill
                                  sizes={IMAGE_SIZES.projectStoryItem}
                                  quality={IMAGE_QUALITY.gallery}
                                  className={styles.stripImage}
                                />
                                <span className={styles.stripIndex} aria-hidden>
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className={styles.stripWrap} data-project-entry>
                <div className={styles.photoStrip}>
                  {project.gallery.map((img, i) => (
                    <div key={i} className={styles.stripItem} data-project-reveal>
                      <button
                        type="button"
                        className={styles.stripMat}
                        onClick={() => openLightbox(i)}
                        aria-label={tr("View image", "عرض الصورة")}
                      >
                        <Image
                          src={img}
                          alt={`${title} — ${i + 1}`}
                          fill
                          sizes={IMAGE_SIZES.projectStoryItem}
                          quality={IMAGE_QUALITY.gallery}
                          className={styles.stripImage}
                        />
                        <span className={styles.stripIndex} aria-hidden>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null}

        <footer className={styles.projectFooter} data-project-entry>
          <nav className={styles.projectNav} aria-label={tr("Project navigation", "تنقل المشاريع")}>
            {prev ? (
              <Link href={`/gallery/${prev}`} className={styles.navLink}>
                <span className={styles.navDirection}>{tr("Previous", "السابق")}</span>
                <span className={styles.navHint} aria-hidden>
                  ←
                </span>
              </Link>
            ) : (
              <span className={styles.navPlaceholder} />
            )}
            <Link href="/gallery" className={styles.navCenter}>
              {tr("All projects", "كل المشاريع")}
            </Link>
            {next ? (
              <Link href={`/gallery/${next}`} className={`${styles.navLink} ${styles.navLinkNext}`}>
                <span className={styles.navDirection}>{tr("Next", "التالي")}</span>
                <span className={styles.navHint} aria-hidden>
                  →
                </span>
              </Link>
            ) : (
              <span className={styles.navPlaceholder} />
            )}
          </nav>
        </footer>
      </main>

      <div className={styles.mobileBar}>
        <Link href="/gallery" className={styles.mobileBarBtn}>
          {tr("← Gallery", "← المعرض")}
        </Link>
      </div>

      {lightboxIndex !== null ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={tr("Image viewer", "عارض الصور")}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label={tr("Close", "إغلاق")}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            >
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          </button>

          {galleryCount > 1 ? (
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label={tr("Previous image", "الصورة السابقة")}
            >
              ‹
            </button>
          ) : null}

          <div
            className={styles.lightboxStage}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div key={lightboxIndex} className={styles.lightboxFrame}>
              <Image
                src={project.gallery[lightboxIndex]}
                alt={`${title} — ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                quality={IMAGE_QUALITY.hero}
                className={styles.lightboxImage}
                priority
              />
            </div>
          </div>

          {galleryCount > 1 ? (
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label={tr("Next image", "الصورة التالية")}
            >
              ›
            </button>
          ) : null}

          <span className={styles.lightboxCount}>
            {String(lightboxIndex + 1).padStart(2, "0")} / {String(galleryCount).padStart(2, "0")}
          </span>
        </div>
      ) : null}
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
