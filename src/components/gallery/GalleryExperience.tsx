"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildGalleryCategories, type GalleryProject } from "@/content/gallery";
import { getSiteMenuItems } from "@/content/navigation";
import { STUDIO_STATS } from "@/content/studio";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import brandLogo from "@/assets/brand/white-logo.png";
import { IMAGE_QUALITY, IMAGE_SIZES } from "@/lib/imageConfig";
import styles from "./gallery.module.css";

gsap.registerPlugin(ScrollTrigger);

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

export function GalleryExperience({ initialCategory }: { initialCategory?: string }) {
  const { tr } = useLanguage();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const zoomImageWrapRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeFilter, setActiveFilter] = useState<string>(() =>
    initialCategory && VALID_CATEGORY_IDS.has(initialCategory) ? initialCategory : ALL_ID,
  );
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

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    setTheme("dark");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const intro = root.querySelectorAll("[data-gallery-entry]");
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-gallery-section]"));
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-gallery-card]"));

    if (reducedMotion) {
      gsap.set([...intro, ...sections, ...cards], { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        intro,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.04,
        },
      );

      gsap.set(sections, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(sections, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          });
        },
      });

      cards.forEach((card) => {
        const media = card.querySelector("[data-gallery-card-media]");
        const copy = card.querySelector("[data-gallery-card-copy]");
        gsap.set(card, { autoAlpha: 0, y: 64, scale: 0.94, transformOrigin: "50% 85%" });
        if (media) gsap.set(media, { scale: 1.2 });
        if (copy) gsap.set(copy, { autoAlpha: 0, y: 16 });
      });

      ScrollTrigger.batch(cards, {
        start: "top 92%",
        once: true,
        interval: 0.1,
        batchMax: 5,
        onEnter: (batch) => {
          batch.forEach((card, index) => {
            const media = card.querySelector("[data-gallery-card-media]");
            const copy = card.querySelector("[data-gallery-card-copy]");
            const delay = index * 0.09;

            gsap.to(card, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.92,
              delay,
              ease: "power3.out",
              onComplete: () => {
                gsap.set(card, { clearProps: "transform" });
              },
            });

            if (media) {
              gsap.to(media, {
                scale: 1,
                duration: 1.25,
                delay,
                ease: "power2.out",
                onComplete: () => {
                  gsap.set(media, { clearProps: "transform" });
                },
              });
            }

            if (copy) {
              gsap.to(copy, {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                delay: delay + 0.22,
                ease: "power2.out",
              });
            }
          });
        },
      });
    }, root);

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      ctx.revert();
    };
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
        logoAlt={tr("Samarammar logo", "شعار سمر عمار")}
        items={menuItems}
        controlsVisible
        showLangToggle
        showThemeToggle
        variant="hero"
        pinLangToggle
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
            >
              <div className={styles.gallerySectionHead} data-gallery-section>
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
                    data-gallery-card
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
                    <div className={styles.cardMedia} data-gallery-card-media>
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
                    <div className={styles.cardCopy} data-gallery-card-copy>
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
