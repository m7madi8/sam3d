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
import dynamic from "next/dynamic";
import FullscreenMenu from "../navigation/FullscreenMenu";
import { Loader } from "./Loader";

const LocationMap = dynamic(() => import("./LocationMap").then((m) => m.LocationMap), {
  ssr: false,
  loading: () => (
    <div
      className={styles.locationMapFrame}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-secondary)" }}
    >
      <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading map…</span>
    </div>
  ),
});

gsap.registerPlugin(ScrollTrigger);

const THEME_STORAGE_KEY = "sam3d-theme";

const LOCATION_STATS = {
  total: 1000,
  completed: 1000,
  clients: 999,
  years: 10,
} as const;

export function NarrativeExperience() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [heroControlsVisible, setHeroControlsVisible] = useState(false);
  const [locationNums, setLocationNums] = useState({ total: 0, completed: 0, clients: 0, years: 0 });
  const locationStatsAnimatedRef = useRef(false);
  const locationStatsRef = useRef<HTMLDivElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicMutedRef = useRef(false);

  useEffect(() => {
    musicMutedRef.current = isMusicMuted;
  }, [isMusicMuted]);

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

  // تشغيل الموسيقى الخلفية (back.mp3) فور فتح الموقع (إلا إذا المستخدم أوقفها)
  useEffect(() => {
    if (musicMutedRef.current) return;
    const audio = backgroundAudioRef.current;
    if (!audio) return;
    audio.volume = 0.1;
    audio.loop = true;
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (musicMutedRef.current) return;
    const audio = backgroundAudioRef.current;
    if (!audio) return;
    audio.volume = 0.1;
    audio.loop = true;
    audio.play().catch(() => {});
  }, [isMusicMuted]);

  // إيقاف الموسيقى عند مغادرة الصفحة واستئنافها عند العودة (إلا إذا كانت موقوفة)
  useEffect(() => {
    const audio = backgroundAudioRef.current;
    if (!audio) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        audio.pause();
      } else if (!musicMutedRef.current) {
        audio.volume = 0.1;
        audio.loop = true;
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // ظهور زر الموسيقى فقط عندما قسم الهيرو ظاهر على الشاشة
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

  const toggleMusic = () => {
    const audio = backgroundAudioRef.current;
    setIsMusicMuted((prev) => {
      const next = !prev;
      if (audio) {
        if (next) audio.pause();
        else {
          audio.volume = 0.1;
          audio.loop = true;
          audio.play().catch(() => {});
        }
      }
      return next;
    });
  };

  const serviceImagesById: Record<string, string> = {
    interior: serviceImageInterior.src,
    landscape: serviceImageLandscape.src,
    architectural: serviceImageExterior.src,
    commercial: serviceImageExterior.src,
  };
  const menuItems = [
    { label: "Home", ariaLabel: "Go to home section", link: "#hero" },
    { label: "Gallery", ariaLabel: "Go to gallery page", link: "/gallery" },
    { label: "Services", ariaLabel: "Go to services section", link: "#services" },
    { label: "About", ariaLabel: "Go to about section", link: "#about" },
    { label: "Location", ariaLabel: "Go to location section", link: "#location" },
    { label: "Contact", ariaLabel: "Go to contact section", link: "#contact" },
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
      <audio
        ref={backgroundAudioRef}
        src="/back.mp3"
        loop
        preload="auto"
        className={styles.backgroundAudio}
        aria-hidden
      />
      <main className={styles.narrativeRoot}>
        <FullscreenMenu
          brand="SAMARAMMAR"
          items={menuItems}
          controlsVisible={heroControlsVisible}
          showThemeToggle={false}
          theme={theme}
          setTheme={setTheme}
        />
        <section id="hero" className={`${styles.panel} ${styles.heroPanel}`} ref={heroRef}>
          {heroInView && heroControlsVisible && (
            <button
              type="button"
              className={styles.heroMusicButton}
              onClick={toggleMusic}
              aria-label={isMusicMuted ? "Play music" : "Mute music"}
            >
              <span className={styles.heroMusicButtonIcon} aria-hidden="true">
                {isMusicMuted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="16" y2="15" />
                    <line x1="16" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </span>
              <span>{isMusicMuted ? "Unmute" : "Mute"}</span>
            </button>
          )}
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
            <span className={styles.heroScrollHintText}>Scroll to explore</span>
            <span className={styles.heroScrollHintArrow}>↓</span>
          </div>
          <div className={`${styles.panelContent} ${styles.heroContent}`}>
            <div className={styles.heroLogoWrap}>
              <Image src={brandLogo} alt="samarammar logo" className={styles.heroLogo} quality={100} />
            </div>
            <div className={styles.heroHeadingWrap} data-hero-reveal>
              <p className={`${styles.kicker} ${styles.heroKicker}`}>Dare To Different</p>
              <span className={styles.heroRule} aria-hidden="true" />
              <h1 className={`${styles.displayTitle} ${styles.heroTitle}`}>Timeless Design</h1>
            </div>
            <p className={`${styles.lead} ${styles.heroLead}`} data-hero-reveal>
              Interior, landscape, and architectural excellence.
            </p>
            <div className={styles.heroThemeWrap} data-hero-reveal>
              <button
                type="button"
                className={styles.heroThemeButton}
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
                <span>{theme === "dark" ? "Light" : "Night"}</span>
              </button>
            </div>
          </div>
        </section>

        <section id="about" className={`${styles.panel} ${styles.aboutPanel}`} ref={aboutRef}>
          <div className={styles.panelContent}>
            <div className={styles.aboutNeo}>
              <aside className={styles.aboutNeoRail} aria-label="About studio note">
                <p>About</p>
                <span>Dare To Different</span>
              </aside>

              <div className={styles.aboutNeoMain}>
                <header className={styles.aboutNeoHeader}>
                  <p className={styles.kicker}>Samarammar</p>
                  <h2 className={styles.sectionTitle}>
                    Unusual Calm.
                    <br />
                    Precise Interior Character.
                  </h2>
                  <p className={styles.lead}>
                    Samar leads a design language where softness meets geometry.
                    Every space is minimal, elegant, and emotionally memorable.
                  </p>
                </header>

                <div className={styles.aboutNeoGrid}>
                  <article className={styles.aboutNeoCard}>
                    <h3>Signature</h3>
                    <p>Interior concepts with a couture-like sense of composition.</p>
                  </article>
                  <article className={styles.aboutNeoCard}>
                    <h3>Material Mood</h3>
                    <p>Warm neutrals, curated textures, and controlled light rhythm.</p>
                  </article>
                  <article className={styles.aboutNeoCard}>
                    <h3>Client Story</h3>
                    <p>Every project feels personal, intentional, and unlike the expected.</p>
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
                  <span>Interior Design Engineer</span>
                  <p>Samar</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className={styles.servicesSection} ref={servicesRef}>
          <div className={styles.servicesStage} ref={servicesStageRef}>
            <div className={styles.servicesHeaderBlock}>
              <p className={styles.servicesHeading}>Services</p>
            </div>
            <div className={styles.servicesBackdrop} aria-hidden="true">
              <p className={styles.servicesBackdropLine}>
                DARE TO DIFFERENT • SAMAR AMMAR • INTERIOR • LANDSCAPE • ARCHITECTURE
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
                        alt={service.title}
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
                        <h3 className={styles.serviceTitle}>{service.title}</h3>
                        <p className={styles.serviceScrollHint}>(Scroll)</p>
                      </div>
                      <p className={styles.serviceDescription}>{service.description}</p>
                      <div className={styles.serviceActions}>
                        <a
                          href={`/gallery?category=${service.id}`}
                          className={styles.serviceGalleryButton}
                        >
                          Gallery
                        </a>
                        <a href={`/request-service/${service.id}`} className={styles.serviceRequestButton}>
                          Request {service.title}
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

        <section id="location" className={`${styles.panel} ${styles.locationPanel}`}>
          <div className={styles.panelContent}>
            <div className={styles.locationStats} ref={locationStatsRef}>
              <article className={styles.locationStatCard}>
                <span className={styles.locationStatNumber}>+{locationNums.total}</span>
                <span className={styles.locationStatLabel}>Total Projects</span>
              </article>
              <article className={styles.locationStatCard}>
                <span className={styles.locationStatNumber}>+{locationNums.completed}</span>
                <span className={styles.locationStatLabel}>Completed Projects</span>
              </article>
              <article className={styles.locationStatCard}>
                <span className={styles.locationStatNumber}>+{locationNums.clients}</span>
                <span className={styles.locationStatLabel}>Happy Clients</span>
              </article>
              <article className={styles.locationStatCard}>
                <span className={styles.locationStatNumber}>+{locationNums.years}</span>
                <span className={styles.locationStatLabel}>Years of Experience</span>
              </article>
            </div>
            <div className={styles.locationNeo}>
              <aside className={styles.locationNeoRail} aria-label="Location note">
                <p>Location</p>
                <span>Ramallah</span>
              </aside>

              <div className={styles.locationNeoMain}>
                <h2 className={styles.locationSectionTitle}>Our Location</h2>
                <span className={styles.locationTitleAccent} aria-hidden="true" />
                <p className={styles.locationAddressLine}>Al Kulliyah Al Ahliyah Street, Ramallah, Palestine</p>
                <div className={styles.locationActions}>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Al+Kulliyah+Al+Ahliyah+Street+Ramallah+Palestine"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Full Map
                  </a>
                  <a href="#contact">Request Site Consultation</a>
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
            <p className={styles.kicker}>Contact</p>
            <h2 className={styles.sectionTitle}>Start Your Project With Us</h2>
            <div className={styles.contactGrid}>
              <p>
                For inquiries and collaborations:
                <br />
                <a href="mailto:sam.ammar1992@gmail.com">sam.ammar1992@gmail.com</a>
                <br />
                <a href="tel:+972569126200">+972 56-912-6200</a>
              </p>

              <form className={styles.contactForm} aria-label="Contact form">
                <label className={styles.contactField}>
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    suppressHydrationWarning
                  />
                </label>

                <label className={styles.contactField}>
                  <span>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+972 56 000 0000"
                    required
                    suppressHydrationWarning
                  />
                </label>

                <label className={styles.contactField}>
                  <span>Message</span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project..."
                    required
                  />
                </label>

                <button
                  type="submit"
                  className={styles.contactButton}
                  suppressHydrationWarning
                >
                  Send Message
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
              <p className={styles.footerTagline}>Dare To Different.</p>
            </div>

            <div className={styles.footerGrid}>
              <nav className={styles.footerNav} aria-label="Footer navigation">
                <p className={styles.footerBlockTitle}>Explore</p>
                <a href="#hero">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#location">Location</a>
                <a href="#contact">Contact</a>
              </nav>

              <div className={styles.footerMeta}>
                <p className={styles.footerBlockTitle}>Contact</p>
                <p>Ramallah, Palestine</p>
                <p><a href="tel:+972569126200">+972 56-912-6200</a></p>
                <p><a href="mailto:sam.ammar1992@gmail.com">sam.ammar1992@gmail.com</a></p>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>Interior • Landscape • Architectural • Commercial</p>
            <p className={styles.footerCopy}>© {new Date().getFullYear()} samarammar. All rights reserved.</p>
          </div>
        </footer>

      </main>
    </div>
  );
}
