import { useRef } from "react";
import FormField from "../FormField/FormField";
import EmailButton from "../EmailButton/EmailButton";
import { CheckIcon, CloseIcon } from "../Icons";
import { useContactForm } from "../../hooks/useContactForm";
import { useTranslation } from "../../hooks/useTranslation";
import { MESSAGE_MAX } from "../../utils/validators";
import { formatNumber } from "../../utils/format";
import "./ContactForm.css";

export default function ContactForm() {
  const { t, lang } = useTranslation();
  const formRef = useRef(null);
  const { values, errors, status, errorType, handleChange, handleBlur, submit } = useContactForm();

  const isSending = status === "submitting";

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Hidden trap field: real people never see it, bots fill it
    const honeypot = new FormData(e.currentTarget).get("botcheck");
    const result = await submit(honeypot);

    if (result.firstInvalid) {
      document.getElementById(`contact-${result.firstInvalid}`)?.focus();
    }
  };

  // ----- Success -----
  if (status === "success") {
    return (
      <div className="form-result success glass" role="status">
        <span className="result-icon ok">
          <CheckIcon />
        </span>
        <h3>{t("contact.successTitle")}</h3>
        <p>{t("contact.successText")}</p>
        <button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>
          {t("contact.sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="contact-form glass" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">{t("contact.formTitle")}</h2>

      <div className="form-row">
        <FormField
          id="contact-name"
          name="name"
          label={t("contact.fields.name")}
          placeholder={t("contact.placeholders.name")}
          value={values.name}
          error={errors.name}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
          dir="auto"
        />
        <FormField
          id="contact-email"
          name="email"
          type="email"
          label={t("contact.fields.email")}
          placeholder={t("contact.placeholders.email")}
          value={values.email}
          error={errors.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          inputMode="email"
          dir="ltr"
        />
      </div>

      <FormField
        id="contact-subject"
        name="subject"
        label={t("contact.fields.subject")}
        placeholder={t("contact.placeholders.subject")}
        value={values.subject}
        error={errors.subject}
        onChange={handleChange}
        onBlur={handleBlur}
        dir="auto"
      />

      <FormField
        id="contact-message"
        name="message"
        as="textarea"
        rows={6}
        label={t("contact.fields.message")}
        placeholder={t("contact.placeholders.message")}
        value={values.message}
        error={errors.message}
        onChange={handleChange}
        onBlur={handleBlur}
        hint={`${formatNumber(values.message.length, lang)} / ${formatNumber(MESSAGE_MAX, lang)}`}
        dir="auto"
      />

      {/* Honeypot (hidden from people and from screen readers) */}
      <div className="honeypot" aria-hidden="true">
        <label>
          {t("contact.honeypot")}
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* ----- Error ----- */}
      {status === "error" && (
        <div className="form-result error" role="alert">
          <span className="result-icon bad">
            <CloseIcon />
          </span>
          <div>
            <strong>{t("contact.errorTitle")}</strong>
            <p>{t(`contact.sendErrors.${errorType ?? "server"}`)}</p>
            <p className="fallback-line">{t("contact.fallback")}</p>
            <EmailButton variant="ghost" />
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary submit-btn" disabled={isSending} aria-busy={isSending}>
        {isSending && <span className="spinner" aria-hidden="true" />}
        <span>{isSending ? t("contact.sending") : t("contact.send")}</span>
      </button>
    </form>
  );
}