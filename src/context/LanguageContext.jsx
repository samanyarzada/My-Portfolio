import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "../i18n";
import { LanguageContext } from "./languageContext";

const STORAGE_KEY = "saman-dev-lang";

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(saved)) return saved;
  } catch {
    // localStorage may be blocked, so we fall back to the default
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);
  const dir = lang === "fa" ? "rtl" : "ltr";

  // Keep <html lang dir> in sync, and remember the choice
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang, dir]);

  const toggleLanguage = useCallback(
    () => setLang((prev) => (prev === "en" ? "fa" : "en")),
    []
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLanguage, dir, isRTL: dir === "rtl" }),
    [lang, dir, toggleLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}