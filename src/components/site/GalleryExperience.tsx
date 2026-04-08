"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildGalleryCategories } from "@/content/gallery";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
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
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string>(ALL_ID);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && VALID_CATEGORY_IDS.has(category)) {
      setActiveFilter(category);
    }
  }, [searchParams]);

  const visibleCategories = useMemo(
    () => (activeFilter === ALL_ID ? categories : categories.filter((c) => c.id === activeFilter)),
    [activeFilter],
  );

  const setFilter = (id: string) => {
    setActiveFilter(id);
    const url = id === ALL_ID ? "/gallery" : `/gallery?category=${id}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <div className={styles.pageShell}>
      <main className={styles.galleryRoot}>
        <FullscreenMenu brand="SAMARAMMAR" items={menuItems} showThemeToggle={false} />

        <header className={styles.galleryHeader}>
          <p className={styles.galleryEyebrow}>SAMAR AMMAR STUDIO</p>
          <h1 className={styles.galleryTitle}>Design Gallery</h1>
          <p className={styles.galleryLead}>
            A living library of interiors, landscapes, architecture, and commercial destinations.
          </p>
          <div className={styles.headerActions}>
            <Link href="/" className={styles.backLink} aria-label="Back to home">
              Back Home
            </Link>
            <Link href="/#contact" className={styles.ctaLink} aria-label="Start your project">
              Start a project
            </Link>
          </div>
        </header>

        <nav className={styles.filterBar} aria-label="Filter by category">
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
                <p className={styles.gallerySectionMeta}>{category.projects.length} projects</p>
              </div>

              <div className={styles.cardsGrid}>
                {category.projects.map((project) => (
                  <article key={project.id} className={styles.card}>
                    <Link href={`/gallery/${project.id}`} className={styles.cardMedia} aria-label={project.title}>
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                        quality={95}
                      />
                      <span className={styles.cardCategoryBadge}>
                        {(project.subtitle ?? category.titleEn).toUpperCase()}
                      </span>
                      <div className={styles.cardMediaCaption}>
                        <p className={styles.cardMediaSubtitle}>{project.subtitle ?? category.titleEn}</p>
                        <h3 className={styles.cardMediaTitle}>{project.title}</h3>
                      </div>
                    </Link>
                    <div className={styles.cardCopy}>
                      <div className={styles.cardTopLine}>
                        <span>{project.photosCount ?? 10} photos</span>
                        <span>{project.subtitle ?? category.titleEn}</span>
                      </div>
                      <h3 className={styles.cardTitle}>
                        <Link href={`/gallery/${project.id}`}>{project.title}</Link>
                      </h3>
                      <Link href={`/gallery/${project.id}`} className={styles.cardAction}>
                        View Project
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
