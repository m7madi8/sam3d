"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { buildGalleryCategories, type GalleryProject } from "@/content/gallery";
import { getSiteMenuItems } from "@/content/navigation";
import { STUDIO_STATS } from "@/content/studio";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import { useLanguage } from "@/components/site/LanguageProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import brandLogo from "../../../white-logo.png";
import { IMAGE_QUALITY, IMAGE_SIZES } from "@/lib/imageConfig";
import styles from "./gallery.module.css";
const THEME_STORAGE_KEY = "sam3d-theme";

const categories = buildGalleryCategories();
const ALL_ID = "all";
const VALID_CATEGORY_IDS = new Set(categories.map((c) => c.id));

const SUBTITLE_AR: Record<string, string> = {
  Interior: "داخلي",
  Landscape: "لاندسكيب",
  Architectural: "معماري",
  Commercial: "تجاري",
};

export function GalleryExperience() {
  const { tr } = useLanguage();
  const reducedMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const zoomImageWrapRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    const category = searchParams.get("category");
    return category && VALID_CATEGORY_IDS.has(category) ? category : ALL_ID;
  });
  const [zoomProject, setZoomProject] = useState<GalleryProject | null>(null);
  const [zoomPanelReady, setZoomPanelReady] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);

  const visibleCategories = useMemo(
    () => (activeFilter === ALL_ID ? categories : categories.filter((c) => c.id === activeFilter)),
    [activeFilter],
  );

  const totalProjects = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.projects.length, 0),
    [],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      const id = requestAnimationFrame(() => setTheme(stored));
      return () => cancelAnimationFrame(id);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    gsap.set(root.querySelectorAll("[data-gallery-entry]"), { opacity: 0, y: 16 });
  }, [activeFilter, reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reducedMotion) {
      root.querySelectorAll<HTMLElement>("[data-gallery-entry]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }
    const els = root.querySelectorAll("[data-gallery-entry]");
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.06,
    });
  }, [activeFilter, reducedMotion]);

  const setFilter = (id: string) => {
    setActiveFilter(id);
    const url = id === ALL_ID ? "/gallery" : `/gallery?category=${id}`;
    window.history.replaceState(null, "", url);
  };

  useEffect(() => {
    document.body.style.overflow = zoomProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomProject]);

  useEffect(() => {
    if (!zoomProject || !zoomImageWrapRef.current || !sourceId) {
      if (zoomProject && reducedMotion) setZoomPanelReady(true);
      return;
    }
    if (reducedMotion) {
      setZoomPanelReady(true);
      return;
    }

    const sourceEl = cardRefs.current[sourceId];
    const zoomEl = zoomImageWrapRef.current;
    if (!sourceEl) return;

    const rect = sourceEl.getBoundingClientRect();
    const scaleX = rect.width / window.innerWidth;
    const scaleY = rect.height / window.innerHeight;
    gsap.set(zoomEl, {
      x: rect.left,
      y: rect.top,
      scaleX,
      scaleY,
      transformOrigin: "top left",
      borderRadius: 14,
    });
    gsap.to(zoomEl, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      borderRadius: 0,
      duration: 0.46,
      ease: "power3.inOut",
      onComplete: () => setZoomPanelReady(true),
    });
  }, [zoomProject, sourceId, reducedMotion]);

  const openQuickView = (project: GalleryProject) => {
    setZoomPanelReady(reducedMotion);
    setSourceId(project.id);
    setZoomProject(project);
  };

  const closeQuickView = () => {
    if (!zoomProject || !zoomImageWrapRef.current || !sourceId || isClosingRef.current || reducedMotion) {
      setZoomPanelReady(false);
      setZoomProject(null);
      setSourceId(null);
      return;
    }

    const targetEl = cardRefs.current[sourceId];
    const zoomEl = zoomImageWrapRef.current;
    if (!targetEl) {
      setZoomPanelReady(false);
      setZoomProject(null);
      setSourceId(null);
      return;
    }

    isClosingRef.current = true;
    setZoomPanelReady(false);
    const rect = targetEl.getBoundingClientRect();
    const scaleX = rect.width / window.innerWidth;
    const scaleY = rect.height / window.innerHeight;
    gsap.to(zoomEl, {
      x: rect.left,
      y: rect.top,
      scaleX,
      scaleY,
      borderRadius: 14,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: () => {
        isClosingRef.current = false;
        setZoomProject(null);
        setSourceId(null);
      },
    });
  };

  const menuItems = getSiteMenuItems(tr);

  return (
    <div className={styles.pageShell} ref={rootRef}>
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

      <main className={styles.galleryRoot}>
        <div className={styles.galleryStage} data-gallery-entry>
          <div className={styles.galleryIntro}>
            <span className={styles.galleryIndex} aria-hidden>
              00
            </span>
            <p className={styles.galleryKicker}>{tr("SAMAR AMMAR STUDIO", "استوديو سمر عمار")}</p>
            <h1 className={styles.galleryTitle}>{tr("Design Gallery", "معرض التصاميم")}</h1>
            <p className={styles.galleryLead}>
              {tr(
                "A living library of interiors, landscapes, architecture, and commercial destinations—curated as editorial chapters.",
                "مكتبة حية للداخلي واللاندسكيب والمعماري والتجاري—منظّمة كفصول تحريرية.",
              )}
            </p>
            <ul className={styles.galleryStats} aria-label={tr("Studio highlights", "أبرز الأرقام")}>
              <li>
                <span className={styles.galleryStatValue}>{totalProjects}+</span>
                <span className={styles.galleryStatLabel}>{tr("Projects", "مشروع")}</span>
              </li>
              <li>
                <span className={styles.galleryStatValue}>{STUDIO_STATS.yearsDisplay}</span>
                <span className={styles.galleryStatLabel}>{tr("Years", "سنوات")}</span>
              </li>
              <li>
                <span className={styles.galleryStatValue}>{categories.length}</span>
                <span className={styles.galleryStatLabel}>{tr("Disciplines", "تخصص")}</span>
              </li>
            </ul>
            <div className={styles.headerActions}>
              <Link href="/" className={styles.backLink}>
                <span>{tr("← Home", "← الرئيسية")}</span>
              </Link>
              <Link href="/#contact" className={styles.ctaLink} scroll={false}>
                <span>{tr("Start a project", "ابدأ مشروعًا")}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

        </div>

        <div className={styles.galleryToolbar} data-gallery-entry>
          <nav className={styles.filterBar} aria-label={tr("Filter by category", "تصفية حسب القسم")}>
            <ul className={styles.filterList}>
              <li>
                <button
                  type="button"
                  className={`${styles.filterTab} ${activeFilter === ALL_ID ? styles.filterTabActive : ""}`}
                  onClick={() => setFilter(ALL_ID)}
                  aria-pressed={activeFilter === ALL_ID}
                >
                  {tr("All", "الكل")}
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    className={`${styles.filterTab} ${activeFilter === cat.id ? styles.filterTabActive : ""}`}
                    onClick={() => setFilter(cat.id)}
                    aria-pressed={activeFilter === cat.id}
                  >
                    {tr(cat.titleEn, cat.titleAr)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <p className={styles.toolbarMeta}>
            {visibleCategories.reduce((n, c) => n + c.projects.length, 0)}{" "}
            {tr("projects on view", "مشروع معروض")}
          </p>
        </div>

        <div className={styles.galleryContent}>
          {visibleCategories.map((category, sectionIndex) => (
            <section
              key={category.id}
              className={styles.gallerySection}
              id={category.id}
              aria-labelledby={`gallery-${category.id}`}
              data-gallery-entry
            >
              <div className={styles.gallerySectionHead}>
                <div className={styles.gallerySectionTitleWrap}>
                  <span className={styles.gallerySectionIndex} aria-hidden>
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <h2 id={`gallery-${category.id}`} className={styles.gallerySectionLabel}>
                    {tr(category.titleEn, category.titleAr)}
                  </h2>
                </div>
                <p className={styles.gallerySectionMeta}>
                  {category.projects.length} {tr("projects", "مشروع")}
                </p>
              </div>

              <div className={styles.cardsGrid}>
                {category.projects.map((project, cardIndex) => (
                  <article
                    key={project.id}
                    className={styles.card}
                    ref={(el) => {
                      cardRefs.current[project.id] = el;
                    }}
                  >
                    <button
                      type="button"
                      className={styles.cardHit}
                      aria-label={tr(
                        `Open quick details for ${project.titleEn}`,
                        `فتح التفاصيل السريعة لـ ${project.titleAr}`,
                      )}
                      onClick={() => openQuickView(project)}
                    />
                    <div className={styles.cardMedia}>
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes={IMAGE_SIZES.galleryCard}
                        quality={IMAGE_QUALITY.gallery}
                        className={styles.cardImage}
                      />
                      <span className={styles.cardIndex} aria-hidden>
                        {String(cardIndex + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className={styles.cardCopy}>
                      <div className={styles.cardTopLine}>
                        <span>
                          {project.photosCount ?? 10} {tr("photos", "صورة")}
                        </span>
                        <span>
                          {project.subtitle
                            ? tr(project.subtitle, SUBTITLE_AR[project.subtitle] ?? project.subtitle)
                            : tr(category.titleEn, category.titleAr)}
                        </span>
                      </div>
                      <h3 className={styles.cardTitle}>
                        <button
                          type="button"
                          onClick={() => openQuickView(project)}
                          className={styles.cardTitleButton}
                        >
                          {tr(project.titleEn, project.titleAr)}
                        </button>
                      </h3>
                      <button type="button" className={styles.cardAction} onClick={() => openQuickView(project)}>
                        {tr("View project", "عرض المشروع")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {zoomProject && (
          <div
            className={styles.quickViewOverlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
          >
            <button
              type="button"
              className={styles.quickViewBackdrop}
              aria-label={tr("Close quick view", "إغلاق المعاينة السريعة")}
              onClick={closeQuickView}
            />
            <div
              ref={zoomImageWrapRef}
              className={`${styles.quickViewImageWrap} ${reducedMotion ? styles.quickViewImageWrapStatic : ""}`}
            >
              <Image
                src={zoomProject.image}
                alt={tr(zoomProject.titleEn, zoomProject.titleAr)}
                fill
                sizes={IMAGE_SIZES.fullViewport}
                quality={IMAGE_QUALITY.gallery}
                className={styles.quickViewImage}
                priority
              />
              <div className={styles.quickViewImageShade} />
            </div>
            <aside className={`${styles.quickViewPanel} ${zoomPanelReady ? styles.quickViewPanelReady : ""}`}>
              <p className={styles.quickViewKicker}>
                {zoomProject.subtitle
                  ? tr(zoomProject.subtitle, SUBTITLE_AR[zoomProject.subtitle] ?? zoomProject.subtitle)
                  : tr("Project", "مشروع")}{" "}
                · {zoomProject.photosCount ?? 10} {tr("photos", "صورة")}
              </p>
              <h2 id="quick-view-title" className={styles.quickViewTitle}>
                {tr(zoomProject.titleEn, zoomProject.titleAr)}
              </h2>
              <p className={styles.quickViewBody}>
                {tr(
                  "Preview this project, then close or continue to the full project page.",
                  "عاين هذا المشروع ثم أغلق أو تابع إلى صفحة المشروع الكاملة.",
                )}
              </p>
              <div className={styles.quickViewActions}>
                <button type="button" onClick={closeQuickView} className={styles.quickViewClose}>
                  {tr("Close", "إغلاق")}
                </button>
                <Link href={`/gallery/${zoomProject.id}`} className={styles.quickViewEnter}>
                  {tr("Enter project", "دخول المشروع")}
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
