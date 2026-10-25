import { useCallback, useContext } from "react";
import { LanguageContext } from "../context/languageContext";
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

   // l(profile.name) -> picks the current language from { en, fa } objects.
  // An empty translation falls back to English.
  const l = useCallback(
    (obj) => {
      const value = obj?.[lang];
      const empty = Array.isArray(value) ? value.length === 0 : !value;
      return empty ? obj?.en : value;
    },
    [lang]
  );

  return { t, l, ...ctx };
}