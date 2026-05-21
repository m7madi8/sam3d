"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/content/capsules";
import styles from "./site.module.css";
import serviceImageInterior from "../../../interior.jpg";
import serviceImageLandscape from "../../../landscape.jpg";
import serviceImageExterior from "../../../exterior.jpg";
import aboutImage from "../../../sam.jpg";
import contactImage from "../../../contact.webp";
import brandLogo from "../../../white-logo.png";
import FullscreenMenu from "../navigation/FullscreenMenu";
import { useLanguage } from "./LanguageProvider";
import { LocationMap } from "./LocationMap";
import { HeroSection } from "@/components/HeroSection";
import { getStudioStatEntries, STUDIO_STATS } from "@/content/studio";
import { IMAGE_QUALITY, IMAGE_SIZES } from "@/lib/imageConfig";
import { scheduleHashScroll, scrollToHashTarget } from "@/lib/scrollToHash";
import { getSiteMenuItems } from "@/content/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const THEME_STORAGE_KEY = "sam3d-theme";

const LOCATION_STATS = {
  years: STUDIO_STATS.yearsExperience,
  projects: STUDIO_STATS.projects,
} as const;

type NarrativeExperienceProps = {
  introReady?: boolean;
};

export function NarrativeExperience({ introReady = false }: NarrativeExperienceProps) {
  const { lang, tr } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [locationNums, setLocationNums] = useState({ years: 0, projects: 0 });
  const locationStatsAnimatedRef = useRef(false);
  const locationStatsRef = useRef<HTMLUListElement | null>(null);

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

  // تأثير العد للأرقام في قسم الخريطة عند ظهور القسم
  useEffect(() => {
    const el = locationStatsRef.current;
    if (!el || locationStatsAnimatedRef.current) return;
    const obj = { years: 0, projects: 0 };
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || locationStatsAnimatedRef.current) return;
        locationStatsAnimatedRef.current = true;
        gsap.to(obj, {
          years: LOCATION_STATS.years,
          projects: LOCATION_STATS.projects,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            setLocationNums({
              years: Math.floor(obj.years),
              projects: Math.floor(obj.projects),
            });
          },
        });
      },
      { threshold: 0.25, rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const serviceImagesById: Record<string, string> = {
    interior: serviceImageInterior.src,
    landscape: serviceImageLandscape.src,
    architectural: serviceImageExterior.src,
    commercial: "/Commercial%20Design.jpg",
  };
  const serviceTitleArById: Record<string, string> = {
    interior: "التصميم الداخلي",
    landscape: "اللاندسكيب",
    architectural: "التصميم المعماري",
    commercial: "التصميم التجاري",
  };
  const serviceDescriptionArById: Record<string, string> = {
    interior:
      "مساحات داخلية دافئة ومصقولة بهوية معاصرة، توازن بين البساطة والفخامة العملية.",
    landscape: "تصميم خارجي متوازن يربط الطبيعة بالوظيفة والجمال.",
    architectural: "حلول معمارية دقيقة تحقق التوازن بين الشكل والاستخدام.",
    commercial: "مساحات تجارية عملية تعزز تجربة العميل وتدفق العمل.",
  };
  const menuItems = getSiteMenuItems(tr);

  const heroRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const servicesStageRef = useRef<HTMLDivElement | null>(null);
  const serviceCardRefs = useRef<HTMLElement[]>([]);
  const serviceLayerRefs = useRef<HTMLDivElement[]>([]);
  const serviceCopyRefs = useRef<HTMLDivElement[]>([]);
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);

  useEffect(() => {
    const lenis =
      window.__lenis ??
      new Lenis({
        duration: 1.35,
        smoothWheel: true,
        touchMultiplier: 1.2,
      });
    const ownsLenis = !window.__lenis;

    lenis.on("scroll", ScrollTrigger.update);
    lenisRef.current = lenis;
    if (ownsLenis) window.__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const cards = serviceCardRefs.current;
    const layers = serviceLayerRefs.current;
    const copy = serviceCopyRefs.current;
    const stage = servicesStageRef.current;

    const hasServicesReady =
      !!stage &&
      cards.length === services.length &&
      layers.length === services.length &&
      copy.length === services.length;

    if (!hasServicesReady) {
      return () => {
        cancelAnimationFrame(rafId);
        lenisRef.current = null;
        if (ownsLenis && window.__lenis === lenis) delete window.__lenis;
        if (ownsLenis) lenis.destroy();
      };
    }

    const ctx = gsap.context(() => {
      const sectionScrollSpan = isMobile
        ? window.innerHeight * (cards.length * 0.95)
        : window.innerHeight * (cards.length + 1.5);

      cards.forEach((card, index) => {
        gsap.set(card, { zIndex: index + 1 });
        gsap.set(card, { yPercent: index === 0 ? 0 : 108 });
        gsap.set(layers[index], {
          scale: 1,
          borderRadius: 0,
          boxShadow: "0 28px 56px rgb(16 12 9 / 28%)",
        });
        gsap.set(copy[index], { opacity: 0 });
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut", force3D: true },
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top top",
          end: () => `+=${sectionScrollSpan}`,
          pin: servicesRef.current,
          scrub: isMobile ? 0.8 : 1,
          anticipatePin: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      const firstTransitionStart = isMobile ? 0.5 : 1.15;
      const transitionStep = isMobile ? 0.7 : 1.2;
      const dScale = isMobile ? 0.5 : 1.2;
      const dCopyOut = isMobile ? 0.3 : 0.5;
      const dCard = isMobile ? 0.55 : 0.95;
      const dScaleNext = isMobile ? 0.5 : 0.8;
      const dCopyIn = isMobile ? 0.4 : 0.6;

      cards.forEach((_, index) => {
        if (index === 0) {
          timeline.to(copy[0], { opacity: 1, duration: isMobile ? 0.35 : 0.65 }, isMobile ? 0.25 : 0.5);
        }

        if (!cards[index + 1]) return;
        const transitionStart = firstTransitionStart + index * transitionStep;

        timeline.to(
          layers[index],
          {
            scale: 1,
            duration: isMobile ? 0.4 : 0.7,
          },
          transitionStart,
        );
        timeline.to(copy[index], { opacity: 0.06, duration: dCopyOut }, transitionStart);
        timeline.to(cards[index + 1], { yPercent: 0, duration: dCard }, transitionStart + (isMobile ? 0.02 : 0.04));
        timeline.to(
          layers[index + 1],
          { scale: 1, duration: dScaleNext },
          transitionStart + (isMobile ? 0.05 : 0.08),
        );
        timeline.to(copy[index + 1], { opacity: 1, duration: dCopyIn }, transitionStart + (isMobile ? 0.28 : 0.4));
      });
    }, servicesRef);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
      lenisRef.current = null;
      if (ownsLenis && window.__lenis === lenis) delete window.__lenis;
      if (ownsLenis) lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const cleanupScheduled = scheduleHashScroll(lenisRef.current);

    const onHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;
      scrollToHashTarget(hash, { lenis: lenisRef.current });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      cleanupScheduled();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    const root = aboutRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const rtl = document.documentElement.dir === "rtl";
      const slideX = rtl ? -32 : 32;

      const aboutIndex = root.querySelector<HTMLElement>(`.${styles.aboutIndex}`);
      const kicker = root.querySelector<HTMLElement>(`.${styles.aboutHeader} .${styles.kicker}`);
      const headlineLines = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(`.${styles.aboutHeadline} span`),
      );
      const aboutLead = root.querySelector<HTMLElement>(`.${styles.aboutLead}`);
      const aboutPillarsList = root.querySelector<HTMLElement>(`.${styles.aboutPillars}`);
      const aboutPillars = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(`.${styles.aboutPillar}`),
      );
      const pillarIndices = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(`.${styles.aboutPillarIndex}`),
      );
      const pillarTitles = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(`.${styles.aboutPillarTitle}`),
      );
      const pillarTexts = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(`.${styles.aboutPillarText}`),
      );
      const aboutMotto = root.querySelector<HTMLElement>(`.${styles.aboutMotto}`);
      const aboutFigure = root.querySelector<HTMLElement>(`.${styles.aboutFigure}`);
      const aboutMat = root.querySelector<HTMLElement>(`.${styles.aboutMat}`);
      const aboutPortrait = root.querySelector<HTMLElement>(`.${styles.aboutPortrait}`);
      const aboutCaption = root.querySelector<HTMLElement>(`.${styles.aboutCaption}`);
      const aboutBadge = root.querySelector<HTMLElement>(`.${styles.aboutBadge}`);

      const pillarCopyTargets = [...pillarIndices, ...pillarTitles, ...pillarTexts];

      const copyTargets = [
        aboutIndex,
        kicker,
        ...headlineLines,
        aboutLead,
        ...pillarCopyTargets,
        aboutMotto,
      ].filter(Boolean) as HTMLElement[];

      const imageTargets = [aboutFigure, aboutMat, aboutPortrait, aboutCaption, aboutBadge].filter(
        Boolean,
      ) as HTMLElement[];

      if (reducedMotion) {
        gsap.set([...copyTargets, ...imageTargets], { clearProps: "all" });
        return;
      }

      if (aboutIndex) gsap.set(aboutIndex, { autoAlpha: 0, x: slideX });
      if (kicker) gsap.set(kicker, { autoAlpha: 0, y: 18 });
      if (headlineLines.length) gsap.set(headlineLines, { autoAlpha: 0, y: 36 });
      if (aboutLead) gsap.set(aboutLead, { autoAlpha: 0, y: 26, filter: "blur(5px)" });
      if (pillarIndices.length) gsap.set(pillarIndices, { autoAlpha: 0, y: 22, x: rtl ? 14 : -14 });
      if (pillarTitles.length) gsap.set(pillarTitles, { autoAlpha: 0, y: 18 });
      if (pillarTexts.length) gsap.set(pillarTexts, { autoAlpha: 0, y: 14, filter: "blur(4px)" });
      if (aboutMotto) gsap.set(aboutMotto, { autoAlpha: 0, y: 18 });
      if (aboutFigure) gsap.set(aboutFigure, { autoAlpha: 0, y: 32 });
      if (aboutMat) gsap.set(aboutMat, { autoAlpha: 0, y: 20 });
      if (aboutPortrait) gsap.set(aboutPortrait, { scale: 1.08, autoAlpha: 0.92 });
      if (aboutCaption) gsap.set(aboutCaption, { autoAlpha: 0, y: 12 });
      if (aboutBadge) gsap.set(aboutBadge, { autoAlpha: 0, y: 22 });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      if (aboutIndex) {
        timeline.to(aboutIndex, { autoAlpha: 1, x: 0, duration: 1.05 }, 0);
      }
      if (kicker) {
        timeline.to(kicker, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.1);
      }
      if (headlineLines.length) {
        timeline.to(
          headlineLines,
          { autoAlpha: 1, y: 0, duration: 0.88, stagger: 0.11 },
          0.18,
        );
      }
      if (aboutLead) {
        timeline.to(
          aboutLead,
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.85 },
          0.34,
        );
      }
      if (aboutPillars.length && aboutPillarsList) {
        const pillarsTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: aboutPillarsList,
            start: "top 86%",
            toggleActions: "play none none none",
            once: true,
          },
        });

        const pillarGap = 0.22;

        aboutPillars.forEach((_, index) => {
          const start = index * pillarGap;
          const indexEl = pillarIndices[index];
          const titleEl = pillarTitles[index];
          const textEl = pillarTexts[index];

          if (indexEl) {
            pillarsTimeline.to(indexEl, { autoAlpha: 1, y: 0, x: 0, duration: 0.72 }, start);
          }
          if (titleEl) {
            pillarsTimeline.to(titleEl, { autoAlpha: 1, y: 0, duration: 0.7 }, start + 0.1);
          }
          if (textEl) {
            pillarsTimeline.to(
              textEl,
              { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.85 },
              start + 0.2,
            );
          }
        });

        if (aboutMotto) {
          const mottoAt = Math.max(0, (aboutPillars.length - 1) * pillarGap + 0.38);
          pillarsTimeline.to(aboutMotto, { autoAlpha: 1, y: 0, duration: 0.72 }, mottoAt);
        }
      } else if (aboutMotto) {
        timeline.to(aboutMotto, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.5);
      }

      if (aboutFigure) {
        const imageTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: aboutFigure,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
        });

        imageTimeline.to(aboutFigure, { autoAlpha: 1, y: 0, duration: 0.88 }, 0);

        if (aboutMat) {
          imageTimeline.to(aboutMat, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.1);
        }
        if (aboutPortrait) {
          imageTimeline.to(
            aboutPortrait,
            { scale: 1, autoAlpha: 1, duration: 1.65, ease: "power2.out" },
            0.2,
          );
        }
        if (aboutCaption) {
          imageTimeline.to(aboutCaption, { autoAlpha: 1, y: 0, duration: 0.68 }, 0.72);
        }
        if (aboutBadge) {
          imageTimeline.to(aboutBadge, { autoAlpha: 1, y: 0, duration: 0.78 }, 0.84);
        }
      }
    }, aboutRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const storytellingTargets = gsap.utils.toArray<HTMLElement>(
        [
          `.${styles.panelContent}:not(.${styles.heroContent}) > *`,
          `.${styles.locationInfoCards} article`,
          `.${styles.contactFormPanel}`,
        ].join(","),
      );

      storytellingTargets.forEach((element) => {
        if (element.closest(`.${styles.aboutPanel}`)) return;

        gsap.fromTo(
          element,
          {
            y: 24,
            autoAlpha: 0,
            filter: "blur(3px)",
          },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.25,
            ease: "sine.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              end: "top 50%",
              scrub: 1.25,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.pageShell}>
      <main className={styles.narrativeRoot}>
        <FullscreenMenu
          brand="SAMARAMMAR"
          items={menuItems}
          logoSrc={brandLogo}
          logoAlt={tr("Samarammar logo", "شعار سمر عمار")}
          controlsVisible
          showLangToggle
          showThemeToggle
          theme={theme}
          setTheme={setTheme}
        />
        <HeroSection
          ref={heroRef}
          introReady={introReady}
          brand="SAMARAMMAR"
          logoSrc={brandLogo}
          logoAlt={tr("Samarammar — home", "سمر عمار — الرئيسية")}
          discipline={tr("Dare to be different.", "تجرأ أن تكون مختلفًا.")}
          imageCaption={tr(
            "Interior · Landscape · Architecture · Commercial",
            "تصميم داخلي · لاندسكيب · عمارة · تجاري",
          )}
          headline={
            lang === "ar"
              ? ["تصميم", "بلا مساومة.", "قوةٌ تدوم."]
              : ["Design", "without compromise.", "Built to endure."]
          }
          accentLineIndex={1}
          subline={tr(
            `${STUDIO_STATS.yearsDisplay} years of experience · more than ${STUDIO_STATS.projectsDisplay} projects worldwide.`,
            `${STUDIO_STATS.yearsDisplay} سنوات خبرة · أكثر من ${STUDIO_STATS.projectsDisplay} مشروع · حول العالم.`,
          )}
          ctaText={tr("View our work →", "استعرض أعمالنا →")}
          ctaHref="/gallery"
          imageSrc="/home.jpg"
          imageAlt={tr(
            "Contemporary interior architecture with natural light and refined material palette",
            "عمارة داخلية معاصرة بإضاءة طبيعية ومواد مصقولة",
          )}
          stats={getStudioStatEntries(lang)}
        />

        <section id="about" className={`${styles.panel} ${styles.aboutPanel}`} ref={aboutRef}>
          <div className={styles.panelContent}>
            <div className={styles.aboutSection}>
              <div className={styles.aboutStage}>
                <div className={styles.aboutIntro}>
                  <span className={styles.aboutIndex} aria-hidden>
                    02
                  </span>
                  <header className={styles.aboutHeader}>
                    <p className={styles.kicker}>{tr("About", "من نحن")}</p>
                    <h2 className={styles.aboutHeadline}>
                      <span>{tr("Unusual calm.", "هدوء مختلف.")}</span>
                      <span>{tr("Precise interior character.", "هوية داخلية دقيقة.")}</span>
                    </h2>
                    <p className={styles.aboutLead}>
                      {tr(
                        "Samar leads a design language where softness meets geometry. Every space is minimal, elegant, and emotionally memorable.",
                        "تقود سمر لغة تصميمية تمزج بين النعومة والهندسة. كل مساحة بسيطة وأنيقة وتترك أثرًا عاطفيًا.",
                      )}
                    </p>
                  </header>

                  <ul className={styles.aboutPillars} aria-label={tr("Studio principles", "مبادئ الاستوديو")}>
                    <li className={styles.aboutPillar}>
                      <span className={styles.aboutPillarIndex}>01</span>
                      <div className={styles.aboutPillarBody}>
                        <p className={styles.aboutPillarTitle}>{tr("Signature", "الهوية")}</p>
                        <p className={styles.aboutPillarText}>
                          {tr(
                            "Interior concepts with a couture-like sense of composition.",
                            "مفاهيم داخلية بروح فاخرة ودقة في التكوين.",
                          )}
                        </p>
                      </div>
                    </li>
                    <li className={styles.aboutPillar}>
                      <span className={styles.aboutPillarIndex}>02</span>
                      <div className={styles.aboutPillarBody}>
                        <p className={styles.aboutPillarTitle}>{tr("Material mood", "مزاج الخامات")}</p>
                        <p className={styles.aboutPillarText}>
                          {tr(
                            "Warm neutrals, curated textures, and controlled light rhythm.",
                            "ألوان حيادية دافئة، خامات منتقاة، وإيقاع ضوئي متوازن.",
                          )}
                        </p>
                      </div>
                    </li>
                    <li className={styles.aboutPillar}>
                      <span className={styles.aboutPillarIndex}>03</span>
                      <div className={styles.aboutPillarBody}>
                        <p className={styles.aboutPillarTitle}>{tr("Client story", "قصة العميل")}</p>
                        <p className={styles.aboutPillarText}>
                          {tr(
                            "Every project feels personal, intentional, and unlike the expected.",
                            "كل مشروع شخصي ومقصود ويتجاوز المتوقع.",
                          )}
                        </p>
                      </div>
                    </li>
                  </ul>

                  <p className={styles.aboutMotto}>{tr("Dare to be different.", "تجرأ أن تكون مختلفًا.")}</p>
                </div>

                <figure className={styles.aboutFigure}>
                  <div className={styles.aboutMat}>
                    <div className={styles.aboutPortrait}>
                      <Image
                        src={aboutImage}
                        alt="Samar, interior design engineer"
                        fill
                        sizes={IMAGE_SIZES.aboutPortrait}
                        quality={IMAGE_QUALITY.hero}
                      />
                    </div>
                    <figcaption className={styles.aboutCaption}>Samar</figcaption>
                  </div>
                  <div className={styles.aboutBadge}>
                    <span className={styles.aboutBadgeRole}>
                      {tr("Interior Design Engineer", "مهندسة تصميم داخلي")}
                    </span>
                    <span className={styles.aboutBadgeName}>Samarammar</span>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className={styles.servicesSection} ref={servicesRef}>
          <div className={styles.servicesStage} ref={servicesStageRef}>
            <div className={styles.servicesHeaderBlock}>
              <p className={styles.servicesHeading}>{tr("Services", "الخدمات")}</p>
            </div>
            <div className={styles.servicesBackdrop} aria-hidden="true">
              <p className={styles.servicesBackdropLine}>
                DARE TO BE DIFFERENT • SAMAR AMMAR • INTERIOR • LANDSCAPE • ARCHITECTURE
              </p>
              <p className={`${styles.servicesBackdropLine} ${styles.servicesBackdropLineAlt}`}>
                SAMAR AMMAR • DESIGN STORY • SPATIAL LUXURY • MODERN CRAFT
              </p>
            </div>
            <div className={styles.servicesStack}>
              {services.map((service, index) => (
                <article
                  className={styles.serviceCard}
                  key={service.id}
                  ref={(node) => {
                    if (!node) return;
                    serviceCardRefs.current[index] = node;
                  }}
                >
                  <div
                    className={styles.serviceLayer}
                    ref={(node) => {
                      if (!node) return;
                      serviceLayerRefs.current[index] = node;
                    }}
                  >
                    <div className={styles.serviceMedia}>
                      <Image
                        src={serviceImagesById[service.id] ?? serviceImageInterior}
                        alt={tr(service.title, serviceTitleArById[service.id] ?? service.title)}
                        fill
                        sizes={IMAGE_SIZES.servicePanel}
                        priority={index === 0}
                        quality={IMAGE_QUALITY.hero}
                      />
                      <div className={styles.serviceOverlay} />
                    </div>
                    <div
                      className={styles.serviceCopy}
                      ref={(node) => {
                        if (!node) return;
                        serviceCopyRefs.current[index] = node;
                      }}
                    >
                      <div className={styles.servicePanel}>
                        <div className={styles.servicePanelHead}>
                          <h3 className={styles.serviceTitle}>
                            {tr(service.title, serviceTitleArById[service.id] ?? service.title)}
                          </h3>
                          <p className={styles.serviceScrollHint}>{tr("(Scroll)", "(مرّر)")}</p>
                        </div>
                        <p className={styles.serviceDescription}>
                          {tr(service.description, serviceDescriptionArById[service.id] ?? service.description)}
                        </p>
                        <div className={styles.serviceActions}>
                          <a
                            href={`/gallery?category=${service.id}`}
                            className={styles.serviceGalleryButton}
                          >
                            <span>{tr("Gallery", "المعرض")}</span>
                            <span aria-hidden="true">→</span>
                          </a>
                          <a href={`/request-service/${service.id}`} className={styles.serviceRequestButton}>
                            <span>
                              {tr("Request", "طلب")}{" "}
                              {tr(service.title, serviceTitleArById[service.id] ?? service.title)}
                            </span>
                            <span aria-hidden="true">→</span>
                          </a>
                        </div>
                        <div className={styles.serviceIndex} aria-hidden>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <i />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.locationContactRow}>
        <section id="location" className={`${styles.panel} ${styles.locationPanel}`}>
          <div className={styles.panelContent}>
            <div className={styles.locationSection}>
              <header className={styles.locationHeader}>
                <span className={styles.panelIndex} aria-hidden>
                  04
                </span>
                <p className={styles.kicker}>{tr("Studio", "الاستوديو")}</p>
                <h2 className={styles.locationHeadline}>{tr("Our Location", "موقعنا")}</h2>
                <p className={styles.locationLead}>
                  {tr(
                    "Visit us in Ramallah or start your project remotely — we work with clients across the region and worldwide.",
                    "زُرنا في رام الله أو ابدأ مشروعك عن بُعد — نعمل مع عملاء في المنطقة وحول العالم.",
                  )}
                </p>
              </header>

              <ul className={styles.locationStatsBand} ref={locationStatsRef} aria-label={tr("Studio reach", "انتشار الاستوديو")}>
                {getStudioStatEntries(lang).map((stat, index) => {
                  const value =
                    stat.key === "experience"
                      ? String(locationNums.years)
                      : stat.key === "projects"
                        ? `${locationNums.projects}+`
                        : stat.value;

                  return (
                    <li
                      key={stat.key}
                      className={`${styles.locationStat} ${stat.display === "phrase" ? styles.locationStatPhrase : ""}`}
                    >
                      {stat.prefix ? <span className={styles.locationStatPrefix}>{stat.prefix}</span> : null}
                      <span
                        className={
                          stat.display === "phrase" ? styles.locationStatValuePhrase : styles.locationStatValue
                        }
                      >
                        {value}
                      </span>
                      {stat.label ? <span className={styles.locationStatLabel}>{stat.label}</span> : null}
                      {index < 2 ? <span className={styles.locationStatDivider} aria-hidden="true" /> : null}
                    </li>
                  );
                })}
              </ul>

              <div className={styles.locationStage}>
                <div className={styles.locationCopy}>
                  <p className={styles.locationCity}>{tr("Ramallah, Palestine", "رام الله، فلسطين")}</p>
                  <address className={styles.locationAddress}>
                    <span>{tr("Al Kulliyah Al Ahliyah Street", "شارع الكلية الأهلية")}</span>
                  </address>
                  <p className={styles.locationHours}>
                    {tr("Consultations by appointment", "الاستشارات بموعد مسبق")}
                  </p>
                  <div className={styles.locationLinks}>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Al+Kulliyah+Al+Ahliyah+Street+Ramallah+Palestine"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.locationCta}
                    >
                      <span>{tr("Open in Google Maps", "فتح في خرائط جوجل")}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                    <a href="#contact" className={styles.locationCtaSecondary}>
                      <span>{tr("Request a consultation", "طلب استشارة")}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
                <div className={styles.locationMapWrap}>
                  <LocationMap />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className={`${styles.panel} ${styles.contactFooterPanel}`}>
          <div className={styles.panelContent}>
            <div className={styles.contactFooterSection}>
              <div className={styles.contactFooterStage}>
                <div className={styles.contactFooterIntro}>
                  <span className={styles.panelIndex} aria-hidden>
                    05
                  </span>
                  <p className={styles.kicker}>{tr("Contact", "تواصل")}</p>
                  <h2 className={styles.contactFooterHeadline}>
                    {tr("Start your project with us.", "ابدأ مشروعك معنا.")}
                  </h2>
                  <p className={styles.contactFooterLead}>
                    {tr(
                      "Tell us about your space, timeline, and vision — we respond with clarity and care.",
                      "أخبرنا عن مساحتك والجدول الزمني ورؤيتك — نرد بوضوح واهتمام.",
                    )}
                  </p>
                  <div className={styles.contactChannels}>
                    <a href="mailto:sam.ammar1992@gmail.com" className={styles.contactChannel}>
                      <span className={styles.contactChannelLabel}>{tr("Email", "البريد")}</span>
                      <span>sam.ammar1992@gmail.com</span>
                    </a>
                    <a href="tel:+972569126200" className={styles.contactChannel}>
                      <span className={styles.contactChannelLabel}>{tr("Phone", "الهاتف")}</span>
                      <span>+972 56-912-6200</span>
                    </a>
                  </div>
                </div>

                <div className={styles.contactFormPanel}>
                  <form className={styles.contactForm} aria-label={tr("Contact form", "نموذج التواصل")}>
                    <label className={styles.contactField}>
                      <span>{tr("Name", "الاسم")}</span>
                      <input
                        type="text"
                        name="name"
                        placeholder={tr("Your name", "اسمك")}
                        required
                        suppressHydrationWarning
                      />
                    </label>

                    <label className={styles.contactField}>
                      <span>{tr("Phone", "الهاتف")}</span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={tr("+972 56 000 0000", "+972 56 000 0000")}
                        required
                        suppressHydrationWarning
                      />
                    </label>

                    <label className={styles.contactField}>
                      <span>{tr("Message", "الرسالة")}</span>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder={tr("Tell us about your project...", "أخبرنا عن مشروعك...")}
                        required
                      />
                    </label>

                    <button type="submit" className={styles.contactButton} suppressHydrationWarning>
                      {tr("Send message", "إرسال الرسالة")}
                    </button>
                  </form>
                </div>

                <figure className={styles.contactFooterVisual} aria-hidden>
                  <div className={styles.contactFooterMat}>
                    <div className={styles.contactFooterImageWrap}>
                      <Image
                        src={contactImage}
                        alt=""
                        className={styles.contactFooterImage}
                        fill
                        sizes={IMAGE_SIZES.desktopOnlyColumn}
                        quality={IMAGE_QUALITY.editorial}
                      />
                    </div>
                  </div>
                </figure>
              </div>

              <footer className={styles.contactFooterBase}>
                <div className={styles.contactFooterBrand}>
                  <div className={styles.footerLogoWrap}>
                    <Image src={brandLogo} alt="samarammar logo" className={styles.footerLogo} quality={100} />
                  </div>
                  <p className={styles.footerTagline}>{tr("Dare to be different.", "تجرأ أن تكون مختلفًا.")}</p>
                </div>

                <nav className={styles.contactFooterNav} aria-label={tr("Site navigation", "تنقّل الموقع")}>
                  <p className={styles.footerBlockTitle}>{tr("Explore", "استكشف")}</p>
                  <a href="#hero">{tr("Home", "الرئيسية")}</a>
                  <a href="/gallery">{tr("Gallery", "المعرض")}</a>
                  <a href="#about">{tr("About", "من نحن")}</a>
                  <a href="#services">{tr("Services", "الخدمات")}</a>
                  <a href="#location">{tr("Location", "الموقع")}</a>
                  <a href="#contact">{tr("Contact", "تواصل")}</a>
                </nav>

                <div className={styles.contactFooterMeta}>
                  <p className={styles.footerBlockTitle}>{tr("Studio", "الاستوديو")}</p>
                  <p>{tr("Ramallah, Palestine", "رام الله، فلسطين")}</p>
                  <p>{tr("Consultations by appointment", "الاستشارات بموعد مسبق")}</p>
                </div>
              </footer>

              <div className={styles.contactFooterLegal}>
                <p>
                  {tr(
                    "Interior • Landscape • Architectural • Commercial",
                    "داخلي • لاندسكيب • معماري • تجاري",
                  )}
                </p>
                <p className={styles.footerCopy}>
                  © {new Date().getFullYear()} samarammar. {tr("All rights reserved.", "جميع الحقوق محفوظة.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        </div>

      </main>
    </div>
  );
}
