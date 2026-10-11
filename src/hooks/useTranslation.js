import { useCallback, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "../i18n";

const resolve = (obj, key) => key.split(".").reduce((o, k) => o?.[k], obj);

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used inside <LanguageProvider>");
  }

  const { lang } = ctx;

  // t("nav.home") -> text from i18n files (falls back to English, then to the key)
  const t = useCallback(
    (key) => resolve(translations[lang], key) ?? resolve(translations.en, key) ?? key,
    [lang]
  );

  // l(profile.name) -> picks the current language from { en, fa } objects
  const l = useCallback((obj) => obj?.[lang] ?? obj?.en, [lang]);

  return { t, l, ...ctx };
}