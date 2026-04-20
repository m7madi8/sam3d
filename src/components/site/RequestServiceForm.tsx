"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useLanguage } from "./LanguageProvider";
import styles from "./RequestServiceForm.module.css";

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

type RequestServiceFormProps = {
  serviceId: string;
  serviceTitle: string;
};

export function RequestServiceForm({ serviceId, serviceTitle }: RequestServiceFormProps) {
  const { tr } = useLanguage();
  const EMAIL_RECIPIENT = "sam.ammar1992@gmail.com";
  const WHATSAPP_RECIPIENT = "972569126200";
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

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.set(root.querySelectorAll("[data-request-entry]"), { opacity: 0, y: 18 });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll("[data-request-entry]");
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.out",
      delay: 0.1,
    });
  }, []);

  const buildRequestMessage = () => {
    return [
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
  };

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

  if (sent) {
    return (
      <div className={styles.pageShell} ref={rootRef}>
        <main className={styles.formRoot}>
          <div className={styles.successBlock} data-request-entry>
            <h1 className={styles.successTitle}>{tr("Request sent", "تم إرسال الطلب")}</h1>
            <p className={styles.successText}>{tr("We will get back to you soon.", "سنعود إليك قريبًا.")}</p>
            <Link href="/" className={styles.successLink}>
              {tr("← Back to home", "← العودة للرئيسية")}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.pageShell} ref={rootRef}>
      <main className={styles.formRoot}>
        <Link href="/" className={styles.backLink} data-request-entry>
          {tr("← Home", "← الرئيسية")}
        </Link>

        <header className={styles.formHeader} data-request-entry>
          <p className={styles.formKicker}>{tr("Request service", "طلب خدمة")}</p>
          <h1 className={styles.formTitle}>{serviceTitle}</h1>
        </header>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit} data-request-entry>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="name">{tr("Name *", "الاسم *")}</label>
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
              <label htmlFor="phone">{tr("Phone *", "الهاتف *")}</label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tr("Mobile or phone number", "رقم الجوال أو الهاتف")}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="location">{tr("Location *", "الموقع *")}</label>
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
              <label htmlFor="buildingStatus">{tr("Building status *", "حالة المبنى *")}</label>
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
              <label htmlFor="area">{tr("Approx. area (m²) *", "المساحة التقريبية (م²) *")}</label>
              <input
                id="area"
                type="number"
                required
                min={1}
                step={1}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={tr("Square meters", "عدد الأمتار")}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="projectType">{tr("Project type *", "نوع المشروع *")}</label>
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
              placeholder={tr("Any extra details you’d like to share", "أي تفاصيل إضافية تحب مشاركتها")}
              rows={4}
            />
          </div>

          <input type="hidden" name="service" value={serviceId} />

          <div className={styles.formActions}>
            <button type="button" className={styles.submitButton} onClick={sendViaEmail}>
              {tr("Send by email", "إرسال عبر البريد")}
            </button>
            <button type="button" className={styles.whatsappButton} onClick={sendViaWhatsApp}>
              {tr("Send by WhatsApp", "إرسال عبر واتساب")}
            </button>
            <Link href="/" className={styles.cancelLink}>
              {tr("Cancel", "إلغاء")}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
