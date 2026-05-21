"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  const [theme, setTheme] = useState<"light" | "dark">("dark");

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

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isSmallScreen = window.innerWidth < 1024;
    const useLightParallax = isCoarsePointer || isSmallScreen;
    const scrubVal = reducedMotion ? 0 : useLightParallax ? 0.42 : 0.62;

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
      const heroMat = root.querySelector<HTMLElement>(`.${styles.heroMat}`);
      const heroImage = root.querySelector<HTMLElement>(`.${styles.heroImageWrap}`);

      if (heroMat && heroImage && !reducedMotion) {
        gsap.set(heroImage, { scale: 1.05, force3D: true });
        gsap.to(heroImage, {
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
        });
        gsap.to(heroImage, {
          scale: useLightParallax ? 1.04 : 1.07,
          y: useLightParallax ? -6 : -12,
          ease: "none",
          scrollTrigger: {
            trigger: heroMat,
            start: "top top",
            end: "bottom top",
            scrub: scrubVal,
          },
        });
      }

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

            {project.hasFloors ? (
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
                        {images.map((img, i) => (
                          <div key={i} className={styles.stripItem}>
                            <div className={styles.stripMat}>
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
                            </div>
                          </div>
                        ))}
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
                      <div className={styles.stripMat}>
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
                      </div>
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
