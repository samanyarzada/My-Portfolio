import { useEffect, useMemo, useState } from "react";
import { ACCEPTED_TYPES, compressToWebp } from "../../lib/media";
import { useTranslation } from "../../hooks/useTranslation";

const ERROR_KEYS = {
  type: "imageType",
  tooBig: "imageTooBig",
  tooHeavy: "imageTooHeavy",
  decode: "imageDecode",
  unsupported: "imageUnsupported",
};

function PreviewImage({ src, emptyText }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <span>{emptyText}</span>;
  return <img src={src} alt="" onError={() => setFailed(true)} />;
}

export default function ImagePicker({
  id,
  label,
  currentUrl = "",
  blob,
  onBlob,
  error,
  hint,
  light = false,
}) {
  const { t } = useTranslation();
  const [localError, setLocalError] = useState("");
  const [working, setWorking] = useState(false);

  const previewUrl = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const shown = previewUrl ?? currentUrl;
  const message = error || (localError ? t(`admin.projects.errors.${localError}`) : "");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the user choose the same file again
    if (!file) return;

    setLocalError("");
    setWorking(true);
    try {
      onBlob(await compressToWebp(file));
    } catch (err) {
      setLocalError(ERROR_KEYS[err.message] ?? "imageDecode");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="image-picker">
      <span className="field-label" id={`${id}-label`}>
        {label}
      </span>

      <div className={`image-preview ${light ? "is-light" : ""}`}>
        <PreviewImage key={shown} src={shown} emptyText={t("admin.projects.noImage")} />
      </div>

      {blob && (
        <p className="admin-hint">
          {t("admin.projects.newImage")}: {Math.round(blob.size / 1024)} KB (WebP)
        </p>
      )}

      <input
        id={id}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFile}
        disabled={working}
        aria-labelledby={`${id}-label`}
        aria-invalid={message ? "true" : "false"}
      />

      {working && (
        <p className="admin-hint" role="status">
          {t("admin.projects.converting")}
        </p>
      )}

      {blob && (
        <button type="button" className="btn btn-ghost" onClick={() => onBlob(null)}>
          {t("admin.projects.clearSelection")}
        </button>
      )}

      {hint && <p className="admin-hint">{hint}</p>}
      {message && (
        <p className="field-error" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}