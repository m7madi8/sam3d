"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { buildGalleryCategories, type GalleryProject } from "@/content/gallery";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import styles from "./gallery.module.css";
import interiorImage from "../../../interior.jpg";
import landscapeImage from "../../../landscape.jpg";
import exteriorImage from "../../../exterior.jpg";
import brandLogo from "../../../white-logo.png";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>(ALL_ID);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevFilterRef = useRef<string>(ALL_ID);
  const isInitialLoadRef = useRef(true);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [zoomProject, setZoomProject] = useState<GalleryProject | null>(null);
  const [zoomReady, setZoomReady] = useState(false);
  const zoomCardRef = useRef<HTMLDivElement | null>(null);

  const openProjectPage = () => {
    if (!zoomProject) return;

    const overlay = document.querySelector<HTMLElement>(`.${styles.zoomOverlay}`);
    if (!overlay) {
      router.push(`/gallery/${zoomProject.id}`);
      return;
    }

    gsap.to(overlay, {
      opacity: 0,
      scale: 1.03,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        router.push(`/gallery/${zoomProject.id}`);
      },
    });
  };

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && VALID_CATEGORY_IDS.has(category)) {
      setActiveFilter(category);
    }
  }, [searchParams]);

  const visibleCategories =
    activeFilter === ALL_ID ? categories : categories.filter((c) => c.id === activeFilter);

  const setFilter = (id: string) => {
    setActiveFilter(id);
    const url = id === ALL_ID ? "/gallery" : `/gallery?category=${id}`;
    window.history.replaceState(null, "", url);
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.set(root.querySelectorAll("[data-gallery-entry]"), { opacity: 0, y: 20 });
  }, []);

  useLayoutEffect(() => {
    const wrap = contentRef.current;
    if (!wrap) return;
    gsap.set(wrap.querySelectorAll("[data-gallery-section]"), { opacity: 0, y: 12 });
    gsap.set(wrap.querySelectorAll("[data-gallery-card]"), { opacity: 0, y: 24 });
  }, [visibleCategories]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const entryEls = root.querySelectorAll("[data-gallery-entry]");
    if (entryEls.length) {
      gsap.to(entryEls, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    const wrap = contentRef.current;
    if (!wrap) return;

    const sections = wrap.querySelectorAll("[data-gallery-section]");
    const cards = wrap.querySelectorAll("[data-gallery-card]");

    const filterJustChanged = prevFilterRef.current !== activeFilter;
    prevFilterRef.current = activeFilter;

    const isInitial = isInitialLoadRef.current;
    if (isInitial) isInitialLoadRef.current = false;

    const contentDelay = isInitial ? 0.5 : filterJustChanged ? 0.06 : 0;
    const cardsDelay = isInitial ? 0.62 : filterJustChanged ? 0.14 : 0.1;

    if (filterJustChanged && !isInitial) {
      gsap.fromTo(
        wrap,
        { opacity: 0.7 },
        { opacity: 1, duration: 0.32, ease: "power2.out" },
      );
    }

    gsap.to(sections, {
      opacity: 1,
      y: 0,
      duration: 0.48,
      stagger: 0.05,
      ease: "power2.out",
      delay: contentDelay,
    });

    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
      delay: cardsDelay,
    });
  }, [activeFilter, visibleCategories]);

  useEffect(() => {
    if (!zoomProject || !zoomCardRef.current) return;

    const sourceEl = cardRefs.current[zoomProject.id];
    const zoomEl = zoomCardRef.current;
    if (!sourceEl) return;

    const rect = sourceEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    gsap.set(zoomEl, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      borderRadius: "0.5rem 0.5rem 1.75rem 0.5rem",
    });

    gsap.to(zoomEl, {
      x: 0,
      y: 0,
      width: vw,
      height: vh,
      borderRadius: 0,
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        setZoomReady(true);
      },
    });
  }, [zoomProject]);

  const closeZoom = () => {
    setZoomReady(false);

    if (!zoomProject || !zoomCardRef.current) {
      setZoomProject(null);
      return;
    }

    const targetEl = cardRefs.current[zoomProject.id];
    const zoomEl = zoomCardRef.current;
    if (!targetEl) {
      setZoomProject(null);
      return;
    }

    const rect = targetEl.getBoundingClientRect();

    gsap.to(zoomEl, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      borderRadius: "0.5rem 0.5rem 1.75rem 0.5rem",
      duration: 0.7,
      ease: "power3.inOut",
      onComplete: () => setZoomProject(null),
    });
  };

  return (
    <div className={styles.pageShell} ref={rootRef}>
      <main className={styles.galleryRoot}>
        <FullscreenMenu
          brand="SAMARAMMAR"
          items={menuItems}
          logoSrc={brandLogo.src}
          logoAlt="samarammar logo"
          showThemeToggle={false}
        />

        <div className={styles.galleryHeaderBar}>
          <div className={styles.galleryHeaderBarLeft}>
            <Link href="/" className={styles.galleryTopLogo} aria-label="samarammar home" data-gallery-entry>
              <Image
                src={brandLogo}
                alt=""
                width={140}
                height={56}
                className={styles.galleryTopLogoImg}
                quality={100}
              />
            </Link>
            <Link href="/" className={styles.backLink} aria-label="Back to home" data-gallery-entry>
              ← Home
            </Link>
          </div>
        </div>

        <header className={styles.galleryHeader} data-gallery-entry>
          <p className={styles.galleryKicker}>Projects</p>
          <h1 className={styles.galleryTitle}>Gallery</h1>
        </header>

        <nav className={styles.filterBar} aria-label="Filter by category" data-gallery-entry>
          <ul className={styles.filterList}>
            <li>
              <button
                type="button"
                className={`${styles.filterTab} ${activeFilter === ALL_ID ? styles.filterTabActive : ""}`}
                onClick={() => setFilter(ALL_ID)}
                aria-pressed={activeFilter === ALL_ID}
              >
                All
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

        <div ref={contentRef} className={styles.galleryContent}>
          {visibleCategories.map((category) => (
            <section
              key={category.id}
              data-gallery-section
              className={styles.gallerySection}
              id={category.id}
              aria-labelledby={`gallery-${category.id}`}
            >
              <h2 id={`gallery-${category.id}`} className={styles.gallerySectionLabel}>
                {category.titleEn}
              </h2>

              <div className={styles.cardsGrid}>
                {category.projects.map((project) => (
                  <article
                    key={project.id}
                    data-gallery-card
                    className={styles.card}
                    ref={(el) => {
                      cardRefs.current[project.id] = el;
                    }}
                  >
                    <div className={styles.cardTags}>
                      <span className={styles.cardTagPhotos}>
                        {project.photosCount ?? 10} PHOTOS
                      </span>
                      <span className={styles.cardTagCategory}>
                        {project.subtitle?.toUpperCase() ?? category.titleEn.toUpperCase()}
                      </span>
                    </div>
                    <a
                      href="#"
                      className={styles.cardLink}
                      aria-label={project.title}
                      onClick={(e) => {
                        e.preventDefault();
                        setZoomProject(project);
                      }}
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
                    <div className={styles.cardOverlay} aria-hidden="true" />
                    <div className={styles.cardCopy}>
                      <h3 className={styles.cardTitle}>{project.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {zoomProject && (
          <div className={styles.zoomOverlay} role="dialog" aria-modal="true">
            <button type="button" className={styles.zoomClose} onClick={closeZoom}>
              Close
            </button>
            <div ref={zoomCardRef} className={styles.zoomCard}>
              <Image
                src={zoomProject.image}
                alt={zoomProject.title}
                fill
                sizes="100vw"
                className={styles.zoomImage}
                priority
              />
              <div className={styles.zoomGradient} />
              <div className={`${styles.zoomMeta} ${zoomReady ? styles.zoomMetaReady : ""}`}>
                <p className={styles.zoomMetaKicker}>
                  {zoomProject.photosCount ?? 10} PHOTOS ·{" "}
                  {zoomProject.subtitle ?? "Project"}
                </p>
                <h2 className={styles.zoomMetaTitle}>{zoomProject.title}</h2>
              </div>
            </div>

            <aside
              className={`${styles.detailPanel} ${zoomReady ? styles.detailPanelReady : ""}`}
              aria-label="Project details"
            >
              <p className={styles.detailPanelKicker}>
                {zoomProject.subtitle ?? "Project"} · {zoomProject.photosCount ?? 10} photos
              </p>
              <h2 className={styles.detailPanelTitle}>{zoomProject.title}</h2>
              <p className={styles.detailPanelBody}>
                Detailed description for this project will live here. You can describe the
                design story, functional goals, and unique elements that make this space
                special, while the full-bleed image remains visible on the left.
              </p>
              <p className={styles.detailPanelMeta}>
                Scroll to explore more details, materials, and key highlights of this
                project.
              </p>
              <button
                type="button"
                onClick={openProjectPage}
                className={styles.detailPanelButton}
                aria-label={`Open full page for ${zoomProject.title}`}
              >
                Open project page
                <span className={styles.detailPanelButtonIcon}>↗</span>
              </button>
            </aside>

            <span className={styles.srOnly} aria-live="polite">
              Opened project {zoomProject.title}
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
