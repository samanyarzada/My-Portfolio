import { useTranslation } from "../../hooks/useTranslation";
import "./FormField.css";

export default function FormField({
  id,
  name,
  label,
  value,
  error,
  onChange,
  onBlur,
  as = "input",
  type = "text",
  hint,
  ...rest
}) {
  const { t } = useTranslation();
  const Control = as;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label htmlFor={id} className="field-label">
        {label}
        <span className="field-required" title={t("contact.required")}>
          *
        </span>
      </label>

      <Control
        id={id}
        name={name}
        type={as === "input" ? type : undefined}
        className="input field-control"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy || undefined}
        {...rest}
      />

      <div className="field-footer">
        {error ? (
          <p id={errorId} className="field-error" role="alert">
            {t(`contact.errors.${error}`)}
          </p>
        ) : (
          <span />
        )}
        {hint && (
          <span id={hintId} className="field-hint">
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}