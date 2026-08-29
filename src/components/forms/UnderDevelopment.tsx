import Image from "next/image";
import Link from "next/link";
import brandLogo from "@/assets/brand/white-logo.png";
import styles from "./UnderDevelopment.module.css";

const CONTACT_EMAIL = "sam.ammar1992@gmail.com";
const CONTACT_PHONE = "+972569126200";
const CONTACT_PHONE_DISPLAY = "+972 56-912-6200";

export function UnderDevelopment() {
  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden />

      <header className={styles.logoStage}>
        <div className={styles.logoLink} aria-label="samarammar">
          <Image
            src={brandLogo}
            alt=""
            className={styles.logo}
            width={720}
            height={220}
            priority
            sizes="(max-width: 768px) 92vw, 48rem"
          />
        </div>
        <p className={styles.motto}>Dare to be different.</p>
      </header>

      <section className={styles.content} aria-labelledby="under-dev-heading">
        <p className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden />
          Website in development
        </p>

        <h1 id="under-dev-heading" className={styles.title}>
          A refined experience
          <span className={styles.titleAccent}>is on the way.</span>
        </h1>

        <p className={styles.lead}>
          We are crafting the samarammar digital presence with the same precision as our interior,
          landscape, architectural, and commercial work. Thank you for your patience.
        </p>

        <div className={styles.progressWrap} aria-hidden>
          <div className={styles.progressTrack}>
            <span className={styles.progressFill} />
          </div>
          <span className={styles.progressLabel}>Launch in progress</span>
        </div>

        <div className={styles.contactCard}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Studio</span>
            <span className={styles.contactValue}>Samar Ammar · Ramallah, Palestine</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Email</span>
            <a className={styles.link} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Phone</span>
            <a className={styles.link} href={`tel:${CONTACT_PHONE}`}>
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <div className={styles.actions}>
          <a className={`${styles.button} ${styles.buttonPrimary}`} href={`mailto:${CONTACT_EMAIL}`}>
            Get in touch
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/preview" className={styles.teamAccess}>
          Team access
        </Link>
        <span className={styles.footerCopy}>
          © {new Date().getFullYear()} samarammar. All rights reserved.
        </span>
      </footer>
    </main>
  );
}
