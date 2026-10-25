import { useTranslation } from "../../hooks/useTranslation";
import "./Loader.css";

export default function Loader({ compact = false }) {
  const { t } = useTranslation();

  return (
    <div className={`loader ${compact ? "compact" : ""}`} role="status" aria-live="polite">
      <span className="loader-ring" aria-hidden="true" />
      <span className="loader-text">{t("loader.loading")}</span>
    </div>
  );
}