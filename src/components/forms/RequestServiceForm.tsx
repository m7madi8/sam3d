"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import FullscreenMenu from "@/components/navigation/FullscreenMenu";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getSiteMenuItems } from "@/content/navigation";
import { IMAGE_QUALITY, IMAGE_SIZES } from "@/lib/imageConfig";
import styles from "./RequestServiceForm.module.css";
import brandLogo from "@/assets/brand/white-logo.png";
import serviceImageInterior from "@/assets/services/interior.jpg";
import serviceImageLandscape from "@/assets/services/landscape.jpg";
import serviceImageExterior from "@/assets/services/exterior.jpg";

const THEME_STORAGE_KEY = "sam3d-theme";

const BUILDING_OPTIONS = [
  { value: "empty_land", label: "Empty plot" },
  { value: "renovation", label: "Renovation" },
  { value: "from_scratch", label: "From scratch" },
  { value: "concrete_structure", label: "Concrete structure (shell)" },
] as const;

const PROJECT_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
] as const;

const SERVICE_IMAGES: Record<string, string> = {
  interior: serviceImageInterior.src,
  landscape: serviceImageLandscape.src,
  architectural: serviceImageExterior.src,
  commercial: "/Commercial%20Design.jpg",
};

const SERVICE_INDEX: Record<string, string> = {
  interior: "01",
  landscape: "02",
  architectural: "03",
  commercial: "04",
};

const SERVICE_TITLE_AR: Record<string, string> = {
  interior: "التصميم الداخلي",
  landscape: "اللاندسكيب",
  architectural: "التصميم المعماري",
  commercial: "التصميم التجاري",
};

const SERVICE_DESCRIPTION_AR: Record<string, string> = {
  interior:
    "مساحات داخلية دافئة ومصقولة بهوية معاصرة، توازن بين البساطة والفخامة العملية.",
  landscape: "بيئات خارجية هادئة بمزيج من النباتات المحلية والحجر والتدفق الطبيعي.",
  architectural: "عمارة جريئة ومتزنة تركز على الضوء والظل والارتباط بالمكان.",
  commercial: "مساحات تجارية عملية تعزز تجربة العميل وتدفق العمل.",
};

type RequestServiceFormProps = {
  serviceId: string;
  serviceTitle: string;
  serviceDescription: string;
};

export function RequestServiceForm({
  serviceId,
  serviceTitle,
  serviceDescription,
}: RequestServiceFormProps) {
  const { tr } = useLanguage();
  const EMAIL_RECIPIENT = "sam.ammar1992@gmail.com";
  const WHATSAPP_RECIPIENT = "972569126200";

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [buildingStatus, setBuildingStatus] = useState("");
  const [area, setArea] = useState("");
  const [projectType, setProjectType] = useState("");
  const [notes, setNotes] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const title = tr(serviceTitle, SERVICE_TITLE_AR[serviceId] ?? serviceTitle);
  const description = tr(serviceDescription, SERVICE_DESCRIPTION_AR[serviceId] ?? serviceDescription);
  const serviceImage = SERVICE_IMAGES[serviceId] ?? serviceImageInterior.src;
  const serviceIndex = SERVICE_INDEX[serviceId] ?? "00";

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
    if (!root) return;
    gsap.set(root.querySelectorAll("[data-request-entry]"), { opacity: 0, y: 18 });
  }, [sent]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll("[data-request-entry]");
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: "power3.out",
      delay: 0.08,
    });
  }, [sent]);

  const buildRequestMessage = () =>
    [
      `Service request: ${serviceTitle}`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Location: ${location}`,
      `Building status: ${buildingStatus}`,
      `Approx. area (m²): ${area}`,
      `Project type: ${projectType}`,
      `Service ID: ${serviceId}`,
      `Notes: ${notes || "-"}`,
    ].join("\n");

  const canSend = () => {
    const form = formRef.current;
    if (!form) return false;
    return form.reportValidity();
  };

  const sendViaEmail = () => {
    if (!canSend()) return;
    const subject = encodeURIComponent(`Request ${serviceTitle}`);
    const body = encodeURIComponent(buildRequestMessage());
    window.location.href = `mailto:${EMAIL_RECIPIENT}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const sendViaWhatsApp = () => {
    if (!canSend()) return;
    const text = encodeURIComponent(buildRequestMessage());
    window.open(`https://wa.me/${WHATSAPP_RECIPIENT}?text=${text}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendViaEmail();
  };

  const menuItems = getSiteMenuItems(tr);

  if (sent) {
    return (
      <div className={styles.pageShell} ref={rootRef}>
        <FullscreenMenu
          brand="SAMARAMMAR"
          logoSrc={brandLogo}
          logoAlt="samarammar"
          items={menuItems}
          showThemeToggle
          theme={theme}
          setTheme={setTheme}
        />
        <main className={styles.requestRoot}>
          <div className={styles.successBlock} data-request-entry>
            <p className={styles.successKicker}>{tr("Request received", "تم استلام الطلب")}</p>
            <h1 className={styles.successTitle}>{tr("Thank you.", "شكرًا لك.")}</h1>
            <p className={styles.successText}>
              {tr("We will review your brief and get back to you soon.", "سنراجع طلبك ونعود إليك قريبًا.")}
            </p>
            <div className={styles.successActions}>
              <Link href="/" className={styles.primaryLink}>
                <span>{tr("Back to home", "العودة للرئيسية")}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/gallery" className={styles.secondaryLink}>
                <span>{tr("View gallery", "عرض المعرض")}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.pageShell} ref={rootRef}>
      <FullscreenMenu
        brand="SAMARAMMAR"
        logoSrc={brandLogo}
        logoAlt="samarammar"
        items={menuItems}
        showThemeToggle
        theme={theme}
        setTheme={setTheme}
      />

      <main className={styles.requestRoot}>
        <div className={styles.requestStage} data-request-entry>
          <div className={styles.requestIntro}>
            <span className={styles.requestIndex} aria-hidden>
              {serviceIndex}
            </span>
            <p className={styles.requestKicker}>{tr("Request service", "طلب خدمة")}</p>
            <h1 className={styles.requestTitle}>{title}</h1>
            <p className={styles.requestLead}>{description}</p>
            <Link href="/#services" className={styles.backLink}>
              <span>{tr("← All services", "← كل الخدمات")}</span>
            </Link>
          </div>

          <figure className={styles.requestVisual} aria-hidden>
            <div className={styles.requestMat}>
              <div className={styles.requestImageWrap}>
                <Image
                  src={serviceImage}
                  alt=""
                  className={styles.requestImage}
                  fill
                  sizes={IMAGE_SIZES.desktopOnlyColumn}
                  priority
                  quality={IMAGE_QUALITY.editorial}
                />
              </div>
              <figcaption className={styles.requestCaption}>{title}</figcaption>
            </div>
          </figure>

          <div className={styles.requestFormPanel} data-request-entry>
            <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
              <p className={styles.formSectionLabel}>{tr("Project details", "تفاصيل المشروع")}</p>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="name">{tr("Name", "الاسم")}</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={tr("Full name", "الاسم الكامل")}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone">{tr("Phone", "الهاتف")}</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={tr("Mobile number", "رقم الجوال")}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="location">{tr("Location", "الموقع")}</label>
                  <input
                    id="location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={tr("City or area", "المدينة أو المنطقة")}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="buildingStatus">{tr("Building status", "حالة المبنى")}</label>
                  <select
                    id="buildingStatus"
                    required
                    value={buildingStatus}
                    onChange={(e) => setBuildingStatus(e.target.value)}
                  >
                    <option value="">{tr("Select status", "اختر الحالة")}</option>
                    {BUILDING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {tr(
                          opt.label,
                          opt.value === "empty_land"
                            ? "أرض فارغة"
                            : opt.value === "renovation"
                              ? "ترميم"
                              : opt.value === "from_scratch"
                                ? "من الصفر"
                                : "هيكل خرساني (عظم)",
                        )}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="area">{tr("Approx. area (m²)", "المساحة التقريبية (م²)")}</label>
                  <input
                    id="area"
                    type="number"
                    required
                    min={1}
                    step={1}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder={tr("Square meters", "متر مربع")}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="projectType">{tr("Project type", "نوع المشروع")}</label>
                  <select
                    id="projectType"
                    required
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                  >
                    <option value="">{tr("Select type", "اختر النوع")}</option>
                    {PROJECT_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {tr(opt.label, opt.value === "residential" ? "سكني" : "تجاري")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="notes">{tr("Additional notes", "ملاحظات إضافية")}</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={tr(
                    "Timeline, budget range, style references…",
                    "الجدول الزمني، الميزانية، مراجع أسلوبية…",
                  )}
                  rows={4}
                />
              </div>

              <input type="hidden" name="service" value={serviceId} />

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {tr("Send by email", "إرسال بالبريد")}
                </button>
                <button type="button" className={styles.whatsappButton} onClick={sendViaWhatsApp}>
                  {tr("Send by WhatsApp", "إرسال بواتساب")}
                </button>
                <Link href="/" className={styles.cancelLink}>
                  {tr("Cancel", "إلغاء")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
