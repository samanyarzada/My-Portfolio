import { useTranslation } from "../../hooks/useTranslation";
import { SUPPORTED_LANGS } from "../../i18n";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { t, lang, setLang } = useTranslation();

  return (
    <div className="lang-switch" role="group" aria-label={t("language.label")}>
      {SUPPORTED_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-btn ${lang === code ? "active" : ""}`}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
