/** Coarse pointer or narrow viewport — prefer native scroll and lighter motion. */
export function isMobileLikeViewport(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 1023px)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const LOCALE_CHANGE_EVENT = "sam3d:locale";

export function notifyLocaleChange() {
  window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT));
}
