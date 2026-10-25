// A labelled field for the admin forms. "error" and "hint" are already translated texts.
export default function AdminField({
  id,
  label,
  error,
  hint,
  required = false,
  as: Control = "input",
  ...rest
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="field-required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <Control
        id={id}
        className="input field-control"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy || undefined}
        aria-required={required || undefined}
        {...rest}
      />

      {hint && (
        <p id={hintId} className="admin-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}