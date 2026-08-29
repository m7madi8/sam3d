const HASH_SCROLL_OFFSET = -72;
const HASH_ALIASES: Record<string, string> = {
  location: "contact",
};

export function getHashId(hash: string): string | null {
  const id = hash.replace(/^#/, "").trim();
  if (!id) return null;
  return HASH_ALIASES[id] ?? id;
}

type LenisLike = {
  scrollTo: (
    target: HTMLElement | string | number,
    options?: { offset?: number; immediate?: boolean },
  ) => void;
};

export function scrollToHashTarget(
  hash: string,
  options?: { lenis?: LenisLike | null; immediate?: boolean },
): boolean {
  const id = getHashId(hash);
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  const { lenis, immediate = false } = options ?? {};

  if (lenis) {
    lenis.scrollTo(el, { offset: HASH_SCROLL_OFFSET, immediate });
    return true;
  }

  el.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  return true;
}

/** Retry scroll after home loader / layout (cross-page hash links). */
export function scheduleHashScroll(lenis?: LenisLike | null) {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  if (!hash) return () => {};

  const run = (immediate: boolean) => scrollToHashTarget(hash, { lenis, immediate });

  const timers = [350, 1200, 3400].map((ms) =>
    window.setTimeout(() => run(ms >= 3400), ms),
  );

  return () => timers.forEach((id) => window.clearTimeout(id));
}
