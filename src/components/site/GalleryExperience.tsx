"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { buildGalleryCategories, type GalleryProject } from "@/content/gallery";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import { useLanguage } from "@/components/site/LanguageProvider";
import styles from "./gallery.module.css";
import interiorImage from "../../../interior.jpg";
import landscapeImage from "../../../landscape.jpg";
import exteriorImage from "../../../exterior.jpg";

const categories = buildGalleryCategories(interiorImage, landscapeImage, exteriorImage);
const ALL_ID = "all";
const VALID_CATEGORY_IDS = new Set(categories.map((c) => c.id));

const menuItems = [
  { label: "Home", ariaLabel: "Back to home", link: "/" },
  { label: "Gallery", ariaLabel: "Gallery page", link: "/gallery" },
  { label: "Services", ariaLabel: "Services section", link: "/#services" },
  { label: "About", ariaLabel: "About section", link: "/#about" },
  { label: "Location", ariaLabel: "Location section", link: "/#location" },
  { label: "Contact", ariaLabel: "Contact section", link: "/#contact" },
];

export function GalleryExperience() {
  const { tr } = useLanguage();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    const category = searchParams.get("category");
    return category && VALID_CATEGORY_IDS.has(category) ? category : ALL_ID;
  });
  const [zoomProject, setZoomProject] = useState<GalleryProject | null>(null);
  const [zoomPanelReady, setZoomPanelReady] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const zoomImageWrapRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const visibleCategories = useMemo(
    () => (activeFilter === ALL_ID ? categories : categories.filter((c) => c.id === activeFilter)),
    [activeFilter],
  );

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
    if (!zoomProject || !zoomImageWrapRef.current || !sourceId) return;
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
  }, [zoomProject, sourceId]);

  const openQuickView = (project: GalleryProject) => {
    setZoomPanelReady(false);
    setSourceId(project.id);
    setZoomProject(project);
  };

  const closeQuickView = () => {
    if (!zoomProject || !zoomImageWrapRef.current || !sourceId || isClosingRef.current) {
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

  return (
    <div className={styles.pageShell}>
      <main className={styles.galleryRoot}>
        <FullscreenMenu
          brand="SAMARAMMAR"
          items={menuItems.map((m) => ({
            ...m,
            label:
              m.label === "Home"
                ? tr("Home", "الرئيسية")
                : m.label === "Gallery"
                  ? tr("Gallery", "المعرض")
                  : m.label === "Services"
                    ? tr("Services", "الخدمات")
                    : m.label === "About"
                      ? tr("About", "من نحن")
                      : m.label === "Location"
                        ? tr("Location", "الموقع")
                        : tr("Contact", "تواصل"),
          }))}
          showThemeToggle={false}
        />

        <header className={styles.galleryHeader}>
          <p className={styles.galleryEyebrow}>SAMAR AMMAR STUDIO</p>
          <h1 className={styles.galleryTitle}>{tr("Design Gallery", "معرض التصاميم")}</h1>
          <p className={styles.galleryLead}>
            A living library of interiors, landscapes, architecture, and commercial destinations.
          </p>
          <div className={styles.headerActions}>
            <Link href="/" className={styles.backLink} aria-label={tr("Back to home", "العودة للرئيسية")}>
              {tr("Back Home", "العودة للرئيسية")}
            </Link>
            <Link href="/#contact" className={styles.ctaLink} aria-label={tr("Start your project", "ابدأ مشروعك")}>
              {tr("Start a project", "ابدأ مشروعًا")}
            </Link>
          </div>
        </header>

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
                  {cat.titleEn}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.galleryContent}>
          {visibleCategories.map((category) => (
            <section
              key={category.id}
              className={styles.gallerySection}
              id={category.id}
              aria-labelledby={`gallery-${category.id}`}
            >
              <div className={styles.gallerySectionHead}>
                <h2 id={`gallery-${category.id}`} className={styles.gallerySectionLabel}>
                  {category.titleEn}
                </h2>
                <p className={styles.gallerySectionMeta}>
                  {category.projects.length} {tr("projects", "مشروع")}
                </p>
              </div>

              <div className={styles.cardsGrid}>
                {category.projects.map((project) => (
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
                      aria-label={`Open quick details for ${project.title}`}
                      onClick={() => openQuickView(project)}
                    />
                    <div className={styles.cardMedia}>
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                        quality={95}
                      />
                    </div>
                    <div className={styles.cardCopy}>
                      <div className={styles.cardTopLine}>
                        <span>{project.photosCount ?? 10} {tr("photos", "صورة")}</span>
                        <span>{project.subtitle ?? category.titleEn}</span>
                      </div>
                      <h3 className={styles.cardTitle}>
                        <button type="button" onClick={() => openQuickView(project)} className={styles.cardTitleButton}>
                          {project.title}
                        </button>
                      </h3>
                      <button type="button" className={styles.cardAction} onClick={() => openQuickView(project)}>
                        {tr("View Project", "عرض المشروع")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {zoomProject && (
          <div className={styles.quickViewOverlay} role="dialog" aria-modal="true">
            <button
              type="button"
              className={styles.quickViewBackdrop}
              aria-label={tr("Close quick view", "إغلاق المعاينة السريعة")}
              onClick={closeQuickView}
            />
            <div ref={zoomImageWrapRef} className={styles.quickViewImageWrap}>
              <Image
                src={zoomProject.image}
                alt={zoomProject.title}
                fill
                sizes="100vw"
                className={styles.quickViewImage}
                priority
              />
              <div className={styles.quickViewImageShade} />
            </div>
            <aside className={`${styles.quickViewPanel} ${zoomPanelReady ? styles.quickViewPanelReady : ""}`}>
              <p className={styles.quickViewKicker}>
                {zoomProject.subtitle ?? tr("Project", "مشروع")} · {zoomProject.photosCount ?? 10} {tr("photos", "صورة")}
              </p>
              <h2 className={styles.quickViewTitle}>{zoomProject.title}</h2>
              <p className={styles.quickViewBody}>
                {tr(
                  "Preview this project, then choose to close or continue to the full project page.",
                  "عاين هذا المشروع ثم اختر الإغلاق أو متابعة صفحة المشروع الكاملة.",
                )}
              </p>
              <div className={styles.quickViewActions}>
                <button type="button" onClick={closeQuickView} className={styles.quickViewClose}>
                  {tr("Close", "إغلاق")}
                </button>
                <Link href={`/gallery/${zoomProject.id}`} className={styles.quickViewEnter}>
                  {tr("Enter Project", "دخول المشروع")}
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
