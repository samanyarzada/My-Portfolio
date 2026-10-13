import { MoonIcon, SunIcon } from "../Icons";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";

export default function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme();
  const { t } = useTranslation();

  // The icon shows what you will get after the click
  const label = isLight ? t("theme.toDark") : t("theme.toLight");

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}