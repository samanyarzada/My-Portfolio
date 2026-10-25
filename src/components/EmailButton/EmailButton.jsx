import { useProfile } from "../../hooks/useProfile";
import { useTranslation } from "../../hooks/useTranslation";
import { MailIcon } from "../Icons";
import "./EmailButton.css";

/**
 * The address never appears as text in the page.
 * It is joined from two parts only when the user clicks.
 */
export default function EmailButton({ variant = "primary", iconOnly = false, className = "" }) {
  const { t } = useTranslation();
  const profile = useProfile();
  const handleClick = () => {
    const { emailUser, emailDomain } = profile.contact;
    const subject = encodeURIComponent(t("email.subject"));
    window.location.href = `mailto:${emailUser}@${emailDomain}?subject=${subject}`;
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        className={`icon-btn ${className}`}
        onClick={handleClick}
        aria-label={t("email.send")}
        title={t("email.send")}
      >
        <MailIcon />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`btn btn-${variant} email-btn ${className}`}
      onClick={handleClick}
    >
      <MailIcon />
      <span>{t("email.send")}</span>
    </button>
  );
}