"use client";

import { useEffect } from "react";

const STORAGE_KEY = "sam3d-theme";

export function ThemeSync() {
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const theme =
      stored === "dark" || stored === "light"
        ? stored
        : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);
  return null;
}
