"use client";

import { useLayoutEffect } from "react";

const STORAGE_KEY = "sam3d-theme";

/** Backup sync if inline script did not run (e.g. strict CSP). */
export function ThemeSync() {
  useLayoutEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const theme = stored === "dark" || stored === "light" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  return null;
}
