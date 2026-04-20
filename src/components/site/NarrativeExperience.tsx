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
import { Loader } from "./Loader";
import { useLanguage } from "./LanguageProvider";
import { LocationMap } from "./LocationMap";

gsap.registerPlugin(ScrollTrigger);

const THEME_STORAGE_KEY = "sam3d-theme";

const LOCATION_STATS = {
  total: 1000,
  completed: 1000,
  clients: 999,
  years: 10,
} as const;

export function NarrativeExperience() {
  const { lang, toggleLang, tr } = useLanguage();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [heroInView, setHeroInView] = useState(true);
  const [heroControlsVisible, setHeroControlsVisible] = useState(false);
  const [locationNums, setLocationNums] = useState({ total: 0, completed: 0, clients: 0, years: 0 });
  const locationStatsAnimatedRef = useRef(false);
  const locationStatsRef = useRef<HTMLDivElement | null>(null);

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

  // لتبديل ظهور زر اللغة في الشريط الثابت عند مغادرة الهيرو
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "0px" }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // تأثير العد للأرقام في قسم الخريطة عند ظهور القسم
  useEffect(() => {
    const el = locationStatsRef.current;
    if (!el || locationStatsAnimatedRef.current) return;
    const obj = { total: 0, completed: 0, clients: 0, years: 0 };
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || locationStatsAnimatedRef.current) return;
        locationStatsAnimatedRef.current = true;
        gsap.to(obj, {
          total: LOCATION_STATS.total,
          completed: LOCATION_STATS.completed,
          clients: LOCATION_STATS.clients,
          years: LOCATION_STATS.years,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            setLocationNums({
              total: Math.floor(obj.total),
              completed: Math.floor(obj.completed),
              clients: Math.floor(obj.clients),
              years: Math.floor(obj.years),
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
    commercial: serviceImageExterior.src,
  };
  const serviceTitleArById: Record<string, string> = {
    interior: "التصميم الداخلي",
    landscape: "اللاندسكيب",
    architectural: "التصميم المعماري",
    commercial: "التصميم التجاري",
  };
  const serviceDescriptionArById: Record<string, string> = {
    interior: "مساحات داخلية أنيقة تجمع بين الراحة والهوية الجمالية.",
    landscape: "تصميم خارجي متوازن يربط الطبيعة بالوظيفة والجمال.",
    architectural: "حلول معمارية دقيقة تحقق التوازن بين الشكل والاستخدام.",
    commercial: "مساحات تجارية عملية تعزز تجربة العميل وتدفق العمل.",
  };
  const menuItems = [
    { label: tr("Home", "الرئيسية"), ariaLabel: tr("Go to home section", "الذهاب لقسم الرئيسية"), link: "#hero" },
    { label: tr("Gallery", "المعرض"), ariaLabel: tr("Go to gallery page", "الذهاب لصفحة المعرض"), link: "/gallery" },
    { label: tr("Services", "الخدمات"), ariaLabel: tr("Go to services section", "الذهاب لقسم الخدمات"), link: "#services" },
    { label: tr("About", "من نحن"), ariaLabel: tr("Go to about section", "الذهاب لقسم من نحن"), link: "#about" },
    { label: tr("Location", "الموقع"), ariaLabel: tr("Go to location section", "الذهاب لقسم الموقع"), link: "#location" },
    { label: tr("Contact", "تواصل"), ariaLabel: tr("Go to contact section", "الذهاب لقسم التواصل"), link: "#contact" },
  ];

  const heroRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const servicesStageRef = useRef<HTMLDivElement | null>(null);
  const serviceCardRefs = useRef<HTMLElement[]>([]);
  const serviceLayerRefs = useRef<HTMLDivElement[]>([]);
  const serviceCopyRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      if (!hero) return;
      const heroImage = hero.querySelector<HTMLElement>(`.${styles.heroImage}`);
      const heroOverlay = hero.querySelector<HTMLElement>(`.${styles.heroOverlay}`);
      const heroContent = hero.querySelector<HTMLElement>(`.${styles.heroContent}`);
      const heroScrollHint = hero.querySelector<HTMLElement>(`.${styles.heroScrollHint}`);
      const revealItems = hero.querySelectorAll<HTMLElement>("[data-hero-reveal]");
      if (!heroImage || !heroOverlay || !heroContent) return;

      gsap.set(heroImage, { scale: 1.02, y: 0, z: 0, filter: "none", transformOrigin: "50% 28%" });
      gsap.set(heroOverlay, { opacity: 0.06 });
      gsap.set(heroContent, { autoAlpha: 1, y: 0, pointerEvents: "none" });
      if (heroScrollHint) gsap.set(heroScrollHint, { autoAlpha: 1, y: 0 });
      if (revealItems.length) gsap.set(revealItems, { y: 30, autoAlpha: 0 });

      const heroTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.45}`,
          pin: hero,
          pinSpacing: true,
          scrub: 1.95,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const isReady = self.progress > 0.62;
            gsap.set(heroContent, { pointerEvents: isReady ? "auto" : "none" });
            setHeroControlsVisible(isReady);
          },
        },
      });

      // Phase 1: cinematic zoom while user scrolls
      heroTl.to(
        heroImage,
        {
          scale: 1.74,
          y: -108,
          z: 285,
          rotationX: 1.6,
          rotationY: -1.2,
          filter: "none",
          duration: 0.9,
        },
        0,
      );
      if (heroScrollHint) heroTl.to(heroScrollHint, { autoAlpha: 0, y: 8, duration: 0.2 }, 0.52);

      // Phase 2: reveal hero copy after zoom peak (logo stays visible from start)
      if (revealItems.length) {
        heroTl.to(
          revealItems,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.22,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.66,
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

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
        lenis.destroy();
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
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const aboutRail = aboutRef.current?.querySelector<HTMLElement>(`.${styles.aboutNeoRail}`);
      const aboutHeader = aboutRef.current?.querySelector<HTMLElement>(`.${styles.aboutNeoHeader}`);
      const aboutCards = gsap.utils.toArray<HTMLElement>(`.${styles.aboutNeoCard}`);
      const aboutImage = aboutRef.current?.querySelector<HTMLElement>(`.${styles.aboutPortrait}`);
      const aboutBadge = aboutRef.current?.querySelector<HTMLElement>(`.${styles.aboutNeoBadge}`);

      if (aboutImage) {
        gsap.fromTo(
          aboutImage,
          {
            autoAlpha: 0.35,
            scale: 1.14,
            y: 26,
            clipPath: "inset(16% 12% 14% 10% round 18px)",
          },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0% round 16px)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 80%",
              end: "top 28%",
              scrub: 1,
            },
          },
        );
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 75%",
          end: "bottom 38%",
          scrub: 1.05,
        },
      });

      if (aboutRail) {
        timeline.fromTo(
          aboutRail,
          { x: -24, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.75 },
          0.08,
        );
      }

      if (aboutHeader) {
        timeline.fromTo(
          aboutHeader,
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.85 },
          0.18,
        );
      }

      if (aboutCards.length) {
        timeline.fromTo(
          aboutCards,
          { y: 32, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.12 },
          0.3,
        );
      }

      if (aboutBadge) {
        timeline.fromTo(
          aboutBadge,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65 },
          0.52,
        );
      }
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const storytellingTargets = gsap.utils.toArray<HTMLElement>(
        [
          `.${styles.panelContent}:not(.${styles.heroContent}) > *`,
          `.${styles.aboutNeoCard}`,
          `.${styles.locationInfoCards} article`,
          `.${styles.contactGrid}`,
        ].join(","),
      );

      storytellingTargets.forEach((element) => {
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
      <Loader />
      <main className={styles.narrativeRoot}>
        <FullscreenMenu
          brand="SAMARAMMAR"
          items={menuItems}
          controlsVisible={heroControlsVisible || !heroInView}
          showLangToggle={heroInView}
          showThemeToggle={false}
          theme={theme}
          setTheme={setTheme}
        />
        <section id="hero" className={`${styles.panel} ${styles.heroPanel}`} ref={heroRef}>
          <div className={styles.heroMedia}>
            <Image
              src="/home.jpg"
              alt="samarammar hero background"
              className={styles.heroImage}
              fill
              sizes="100vw"
              priority
              quality={100}
              unoptimized
            />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroScrollHint} aria-hidden="true">
            <span className={styles.heroScrollHintText}>{tr("Scroll to explore", "مرر للاستكشاف")}</span>
            <span className={styles.heroScrollHintArrow}>↓</span>
          </div>
          <div className={`${styles.panelContent} ${styles.heroContent}`}>
            <div className={styles.heroLogoWrap}>
              <Image src={brandLogo} alt="samarammar logo" className={styles.heroLogo} quality={100} />
            </div>
            <div className={styles.heroHeadingWrap} data-hero-reveal>
              <p className={`${styles.kicker} ${styles.heroKicker}`}>{tr("Dare to be different", "تجرأ أن تكون مختلفًا")}</p>
              <span className={styles.heroRule} aria-hidden="true" />
              <h1 className={`${styles.displayTitle} ${styles.heroTitle}`}>{tr("Timeless Design", "تصميم خالد")}</h1>
            </div>
            <p className={`${styles.lead} ${styles.heroLead}`} data-hero-reveal>
              {tr("Interior, landscape, and architectural excellence.", "تميز في التصميم الداخلي واللاندسكيب والعمارة.")}
            </p>
            <div className={styles.heroThemeWrap} data-hero-reveal>
              <button
                type="button"
                className={styles.heroLangButton}
                onClick={toggleLang}
                aria-label={tr("Toggle language", "تبديل اللغة")}
              >
                <span className={styles.heroLangLabel}>Language</span>
                <span className={styles.heroLangCodes}>
                  <span className={lang === "en" ? styles.heroLangActive : ""}>EN</span>
                  <span>/</span>
                  <span className={lang === "ar" ? styles.heroLangActive : ""}>AR</span>
                </span>
              </button>
              <button
                type="button"
                className={styles.heroThemeButton}
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                aria-label={theme === "dark" ? tr("Switch to light mode", "التبديل للوضع الفاتح") : tr("Switch to dark mode", "التبديل للوضع الداكن")}
              >
                <span className={styles.heroThemeButtonIcon} aria-hidden="true">
                  {theme === "dark" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </span>
                <span>{theme === "dark" ? tr("Light", "فاتح") : tr("Night", "ليلي")}</span>
              </button>
            </div>
          </div>
        </section>

        <section id="about" className={`${styles.panel} ${styles.aboutPanel}`} ref={aboutRef}>
          <div className={styles.panelContent}>
            <div className={styles.aboutNeo}>
              <aside className={styles.aboutNeoRail} aria-label={tr("About studio note", "ملاحظة عن الاستوديو")}>
                <p>{tr("About", "من نحن")}</p>
                <span>{tr("Dare to be different", "تجرأ أن تكون مختلفًا")}</span>
              </aside>

              <div className={styles.aboutNeoMain}>
                <header className={styles.aboutNeoHeader}>
                  <p className={styles.kicker}>{tr("Samarammar", "سمر عمار")}</p>
                  <h2 className={styles.sectionTitle}>
                    {tr("Unusual Calm.", "هدوء مختلف.")}
                    <br />
                    {tr("Precise Interior Character.", "هوية داخلية دقيقة.")}
                  </h2>
                  <p className={styles.lead}>
                    {tr(
                      "Samar leads a design language where softness meets geometry. Every space is minimal, elegant, and emotionally memorable.",
                      "تقود سمر لغة تصميمية تمزج بين النعومة والهندسة. كل مساحة بسيطة وأنيقة وتترك أثرًا عاطفيًا.",
                    )}
                  </p>
                </header>

                <div className={styles.aboutNeoGrid}>
                  <article className={styles.aboutNeoCard}>
                    <h3>{tr("Signature", "الهوية")}</h3>
                    <p>{tr("Interior concepts with a couture-like sense of composition.", "مفاهيم داخلية بروح فاخرة ودقة في التكوين.")}</p>
                  </article>
                  <article className={styles.aboutNeoCard}>
                    <h3>{tr("Material Mood", "مزاج الخامات")}</h3>
                    <p>{tr("Warm neutrals, curated textures, and controlled light rhythm.", "ألوان حيادية دافئة، خامات منتقاة، وإيقاع ضوئي متوازن.")}</p>
                  </article>
                  <article className={styles.aboutNeoCard}>
                    <h3>{tr("Client Story", "قصة العميل")}</h3>
                    <p>{tr("Every project feels personal, intentional, and unlike the expected.", "كل مشروع شخصي ومقصود ويتجاوز المتوقع.")}</p>
                  </article>
                </div>
              </div>

              <div className={styles.aboutNeoVisual}>
                <div className={styles.aboutPortrait}>
                  <Image
                    src={aboutImage}
                    alt="Samar, interior design engineer"
                    fill
                    sizes="(max-width: 1023px) 100vw, 36vw"
                    quality={100}
                  />
                </div>
                <div className={styles.aboutNeoBadge}>
                  <span>{tr("Interior Design Engineer", "مهندسة تصميم داخلي")}</span>
                  <p>Samar</p>
                </div>
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
                        sizes="100vw"
                        priority={index === 0}
                        quality={100}
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
                      <div className={styles.serviceTopLine}>
                        <h3 className={styles.serviceTitle}>{tr(service.title, serviceTitleArById[service.id] ?? service.title)}</h3>
                        <p className={styles.serviceScrollHint}>{tr("(Scroll)", "(مرر)")}</p>
                      </div>
                      <p className={styles.serviceDescription}>{tr(service.description, serviceDescriptionArById[service.id] ?? service.description)}</p>
                      <div className={styles.serviceActions}>
                        <a
                          href={`/gallery?category=${service.id}`}
                          className={styles.serviceGalleryButton}
                        >
                          {tr("Gallery", "المعرض")}
                        </a>
                        <a href={`/request-service/${service.id}`} className={styles.serviceRequestButton}>
                          {tr("Request", "طلب")} {tr(service.title, serviceTitleArById[service.id] ?? service.title)}
                        </a>
                      </div>
                      <div className={styles.serviceBottomLine}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <i aria-hidden="true" />
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
            <div className={styles.locationStats} ref={locationStatsRef}>
              <article className={styles.locationStatCard}>
                <span className={styles.locationStatNumber}>+{locationNums.total}</span>
                <span className={styles.locationStatLabel}>{tr("Total Projects", "إجمالي المشاريع")}</span>
              </article>
              <article className={styles.locationStatCard}>
                <span className={styles.locationStatNumber}>+{locationNums.completed}</span>
                <span className={styles.locationStatLabel}>{tr("Completed Projects", "المشاريع المنجزة")}</span>
              </article>
              <article className={styles.locationStatCard}>
                <span className={styles.locationStatNumber}>+{locationNums.clients}</span>
                <span className={styles.locationStatLabel}>{tr("Happy Clients", "عملاء سعداء")}</span>
              </article>
              <article className={styles.locationStatCard}>
                <span className={styles.locationStatNumber}>+{locationNums.years}</span>
                <span className={styles.locationStatLabel}>{tr("Years of Experience", "سنوات الخبرة")}</span>
              </article>
            </div>
            <div className={styles.locationNeo}>
              <aside className={styles.locationNeoRail} aria-label="Location note">
                <p>Location</p>
                <span>Ramallah</span>
              </aside>

              <div className={styles.locationNeoMain}>
                <h2 className={styles.locationSectionTitle}>{tr("Our Location", "موقعنا")}</h2>
                <span className={styles.locationTitleAccent} aria-hidden="true" />
                <p className={styles.locationAddressLine}>Al Kulliyah Al Ahliyah Street, Ramallah, Palestine</p>
                <div className={styles.locationActions}>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Al+Kulliyah+Al+Ahliyah+Street+Ramallah+Palestine"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tr("Open Full Map", "فتح الخريطة الكاملة")}
                  </a>
                  <a href="#contact">{tr("Request Site Consultation", "طلب استشارة ميدانية")}</a>
                </div>
              </div>

              <div className={styles.locationNeoVisual}>
                <LocationMap />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className={`${styles.panel} ${styles.contactPanel}`}>
          <div className={styles.contactMedia}>
            <Image
              src={contactImage}
              alt="Contact section background"
              className={styles.contactImage}
              fill
              sizes="100vw"
              quality={100}
            />
            <div className={styles.contactOverlay} />
          </div>
          <div className={styles.panelContent}>
            <p className={styles.kicker}>{tr("Contact", "تواصل")}</p>
            <h2 className={styles.sectionTitle}>{tr("Start Your Project With Us", "ابدأ مشروعك معنا")}</h2>
            <div className={styles.contactGrid}>
              <p>
                {tr("For inquiries and collaborations:", "للاستفسارات والتعاون:")}
                <br />
                <a href="mailto:sam.ammar1992@gmail.com">sam.ammar1992@gmail.com</a>
                <br />
                <a href="tel:+972569126200">+972 56-912-6200</a>
              </p>

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

                <button
                  type="submit"
                  className={styles.contactButton}
                  suppressHydrationWarning
                >
                  {tr("Send Message", "إرسال الرسالة")}
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className={styles.siteFooter}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoWrap}>
                <Image src={brandLogo} alt="samarammar logo" className={styles.footerLogo} quality={100} />
              </div>
              <p className={styles.footerTagline}>Dare to be different.</p>
            </div>

            <div className={styles.footerGrid}>
              <nav className={styles.footerNav} aria-label="Footer navigation">
              <p className={styles.footerBlockTitle}>{tr("Explore", "استكشف")}</p>
                <a href="#hero">{tr("Home", "الرئيسية")}</a>
                <a href="#about">{tr("About", "من نحن")}</a>
                <a href="#services">{tr("Services", "الخدمات")}</a>
                <a href="#location">{tr("Location", "الموقع")}</a>
                <a href="#contact">{tr("Contact", "تواصل")}</a>
              </nav>

              <div className={styles.footerMeta}>
                <p className={styles.footerBlockTitle}>{tr("Contact", "تواصل")}</p>
                <p>Ramallah, Palestine</p>
                <p><a href="tel:+972569126200">+972 56-912-6200</a></p>
                <p><a href="mailto:sam.ammar1992@gmail.com">sam.ammar1992@gmail.com</a></p>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>{tr("Interior • Landscape • Architectural • Commercial", "داخلي • لاندسكيب • معماري • تجاري")}</p>
            <p className={styles.footerCopy}>© {new Date().getFullYear()} samarammar. {tr("All rights reserved.", "جميع الحقوق محفوظة.")}</p>
          </div>
        </footer>
        </div>

      </main>
    </div>
  );
}
