"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import styles from "./RequestServiceForm.module.css";
import brandLogo from "../../../white-logo.png";

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
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [buildingStatus, setBuildingStatus] = useState("");
  const [area, setArea] = useState("");
  const [projectType, setProjectType] = useState("");
  const [notes, setNotes] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.pageShell} ref={rootRef}>
        <main className={styles.formRoot}>
          <div className={styles.successBlock} data-request-entry>
            <h1 className={styles.successTitle}>Request sent</h1>
            <p className={styles.successText}>We will get back to you soon.</p>
            <Link href="/" className={styles.successLink}>
              ← Back to home
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
          ← Home
        </Link>

        <Link href="/" className={styles.pageLogo} aria-label="samarammar home" data-request-entry>
          <Image
            src={brandLogo}
            alt=""
            width={130}
            height={52}
            className={styles.pageLogoImg}
            quality={100}
          />
        </Link>

        <header className={styles.formHeader} data-request-entry>
          <p className={styles.formKicker}>Request service</p>
          <h1 className={styles.formTitle}>{serviceTitle}</h1>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} data-request-entry>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Phone *</label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile or phone number"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or area"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="buildingStatus">Building status *</label>
              <select
                id="buildingStatus"
                required
                value={buildingStatus}
                onChange={(e) => setBuildingStatus(e.target.value)}
              >
                <option value="">Select status</option>
                {BUILDING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="area">Approx. area (m²) *</label>
              <input
                id="area"
                type="number"
                required
                min={1}
                step={1}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Square meters"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="projectType">Project type *</label>
              <select
                id="projectType"
                required
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              >
                <option value="">Select type</option>
                {PROJECT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="notes">Additional notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra details you’d like to share"
              rows={4}
            />
          </div>

          <input type="hidden" name="service" value={serviceId} />

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Submit request
            </button>
            <Link href="/" className={styles.cancelLink}>
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
