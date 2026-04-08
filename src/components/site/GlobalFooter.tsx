import Link from "next/link";

export function GlobalFooter() {
  return (
    <footer className="border-t border-black/10 bg-[var(--surface-secondary)] px-8 py-5 sm:px-12 md:px-16">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4">
        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]"
          aria-label="Footer navigation"
        >
          <Link href="/" className="transition-colors hover:text-[var(--text-primary)]">
            Home
          </Link>
          <Link href="/gallery" className="transition-colors hover:text-[var(--text-primary)]">
            Gallery
          </Link>
          <Link href="/#services" className="transition-colors hover:text-[var(--text-primary)]">
            Services
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-[var(--text-primary)]">
            Contact
          </Link>
        </nav>
        <p className="text-[0.66rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          © {new Date().getFullYear()} samarammar
        </p>
      </div>
    </footer>
  );
}
