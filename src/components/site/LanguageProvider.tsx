"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";

type Lang = "en" | "ar";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  tr: (en: string, ar: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANGUAGE_STORAGE_KEY = "sam3d-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default "en" matches SSR; useLayoutEffect applies stored lang before paint to avoid hydration mismatch.
  const [lang, setLang] = useState<Lang>("en");

  useLayoutEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "ar" || stored === "en") {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const tr = useCallback(
    (en: string, ar: string) => (lang === "ar" ? ar : en),
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, tr }), [lang, toggleLang, tr]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

