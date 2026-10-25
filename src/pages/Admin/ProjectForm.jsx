import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import AdminField from "./AdminField";
import ImagePicker from "./ImagePicker";
import { supabase } from "../../lib/supabase";
import { removeStoredImages, removeUploaded, uploadImage } from "../../lib/media";
import { useContent } from "../../hooks/useContent";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../hooks/useTranslation";
import { slugify } from "../../utils/slugify";
import { lightSrc } from "../../utils/themedImage";

const EMPTY = {
  slug: "",
  tech: "",
  live_url: "",
  repo_url: "",
  published: true,
  title_en: "",
  title_fa: "",
  summary_en: "",
  summary_fa: "",
  highlights_en: "",
  highlights_fa: "",
  alt_en: "",
  alt_fa: "",
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_RE = /^https?:\/\/\S+$/i;

// Same order as on the screen, so focus goes to the first invalid field
const FIELD_ORDER = ["slug", "live_url", "repo_url", "title_en", "summary_en", "image_light"];

const toSlug = (text) =>
  slugify(text)
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const toLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const toList = (text) => [
  ...new Set(
    text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  ),
];

const toForm = (row) => ({
  slug: row.slug,
  tech: row.tech.join(", "),
  live_url: row.live_url,
  repo_url: row.repo_url,
  published: row.published,
  title_en: row.title_en,
  title_fa: row.title_fa,
  summary_en: row.summary_en,
  summary_fa: row.summary_fa,
  highlights_en: row.highlights_en.join("\n"),
  highlights_fa: row.highlights_fa.join("\n"),
  alt_en: row.alt_en,
  alt_fa: row.alt_fa,
});

function validate(form, darkBlob, lightBlob) {
  const errors = {};
  if (!form.slug.trim()) errors.slug = "required";
  else if (!SLUG_RE.test(form.slug.trim())) errors.slug = "slugInvalid";

  if (form.live_url.trim() && !URL_RE.test(form.live_url.trim())) errors.live_url = "urlInvalid";
  if (form.repo_url.trim() && !URL_RE.test(form.repo_url.trim())) errors.repo_url = "urlInvalid";

  if (!form.title_en.trim()) errors.title_en = "required";
  if (!form.summary_en.trim()) errors.summary_en = "required";

  // The light image is stored next to the dark one, so they are uploaded as a pair
  if (lightBlob && !darkBlob) errors.image_light = "lightNeedsDark";
  return errors;
}

// The key resets the form when the address changes (new <-> edit)
export default function ProjectForm() {
  const { id } = useParams();
  return <ProjectFormInner key={id ?? "new"} id={id} />;
}

function ProjectFormInner({ id }) {
  const isEdit = Boolean(id);
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { reload } = useContent();

  const [loadState, setLoadState] = useState(isEdit ? "loading" : "ready"); // loading | ready | error | missing
  const [attempt, setAttempt] = useState(0);
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [darkBlob, setDarkBlob] = useState(null);
  const [lightBlob, setLightBlob] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;

    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadState("error");
        } else if (!data) {
          setLoadState("missing");
        } else {
          setOriginal(data);
          setForm(toForm(data));
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, attempt]);

  const retry = () => {
    setLoadState("loading");
    setAttempt((n) => n + 1);
  };

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    const value = name === "slug" ? e.target.value.toLowerCase() : e.target.value;

    setForm((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      // While creating, the address follows the English title until it is edited by hand
      if (name === "title_en" && !isEdit && !slugTouched) next.slug = toSlug(value);
      return next;
    });

    if (name === "slug") setSlugTouched(true);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDark = (blob) => {
    setDarkBlob(blob);
    if (errors.image_light) setErrors((prev) => ({ ...prev, image_light: undefined }));
  };

  const handleLight = (blob) => {
    setLightBlob(blob);
    if (errors.image_light) setErrors((prev) => ({ ...prev, image_light: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const found = validate(form, darkBlob, lightBlob);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(`project-${firstInvalid}`)?.focus();
      return;
    }

    setSaving(true);
    const uploaded = []; // paths to clean up if saving fails
    try {
      const slug = form.slug.trim();
      const oldImage = original?.image ?? "";
      let image = removeImage ? "" : oldImage;

      if (darkBlob) {
        const base = `projects/${slug}-${Date.now()}`;
        image = await uploadImage(`${base}.webp`, darkBlob);
        uploaded.push(`${base}.webp`);
        if (lightBlob) {
          await uploadImage(`${base}-light.webp`, lightBlob);
          uploaded.push(`${base}-light.webp`);
        }
      }

      const payload = {
        slug,
        title_en: form.title_en.trim(),
        title_fa: form.title_fa.trim(),
        summary_en: form.summary_en.trim(),
        summary_fa: form.summary_fa.trim(),
        highlights_en: toLines(form.highlights_en),
        highlights_fa: toLines(form.highlights_fa),
        image,
        alt_en: form.alt_en.trim(),
        alt_fa: form.alt_fa.trim(),
        tech: toList(form.tech),
        live_url: form.live_url.trim(),
        repo_url: form.repo_url.trim(),
        published: form.published,
      };

      let result;
      if (isEdit) {
        result = await supabase.from("projects").update(payload).eq("id", id).select("id");
      } else {
        const { data: last, error: lastError } = await supabase
          .from("projects")
          .select("sort_order")
          .order("sort_order", { ascending: false })
          .limit(1);
        if (lastError) throw lastError;

        const sortOrder = (last?.[0]?.sort_order ?? -1) + 1;
        result = await supabase
          .from("projects")
          .insert({ ...payload, sort_order: sortOrder })
          .select("id");
      }

      const { data, error } = result;

      // 23505 = the unique address (slug) already exists
      if (error?.code === "23505") {
        await removeUploaded(uploaded);
        setErrors({ slug: "slugTaken" });
        document.getElementById("project-slug")?.focus();
        return;
      }
      if (error || !data?.length) throw error ?? new Error("no-permission");

      // The old files are removed only after the new data is safely saved
      if (image !== oldImage) await removeStoredImages(oldImage);

      reload().catch(() => {});
      toast.success(isEdit ? t("admin.projects.updated") : t("admin.projects.created"));
      navigate("/admin/projects");
    } catch (err) {
      await removeUploaded(uploaded);
      if (err?.message === "upload") toast.error(t("admin.projects.errors.uploadFailed"));
      else if (err?.message === "no-permission") toast.error(t("admin.common.noPermission"));
      else toast.error(t("admin.common.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (loadState === "loading") return <Loader compact />;

  if (loadState === "error") {
    return (
      <div className="admin-error-box" role="alert">
        <p>{t("admin.common.loadError")}</p>
        <button type="button" className="btn btn-ghost" onClick={retry}>
          {t("admin.retry")}
        </button>
      </div>
    );
  }

  if (loadState === "missing") {
    return (
      <div className="admin-empty glass">
        <p>{t("admin.projects.notFound")}</p>
        <Link to="/admin/projects" className="btn btn-primary">
          {t("admin.common.back")}
        </Link>
      </div>
    );
  }

  const err = (field) => (errors[field] ? t(`admin.projects.errors.${errors[field]}`) : "");
  const currentImage = removeImage ? "" : original?.image ?? "";

  return (
    <>
      <Link to="/admin/projects" className="link-arrow admin-back">
        <span className="arrow back-arrow">→</span> {t("admin.common.back")}
      </Link>

      <h1 className="admin-title">
        {isEdit ? t("admin.projects.editTitle") : t("admin.projects.newTitle")}
      </h1>

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        {/* ---------- General ---------- */}
        <section className="admin-section glass">
          <h2>{t("admin.projects.general")}</h2>

          <AdminField
            id="project-slug"
            name="slug"
            label={t("admin.projects.slug")}
            hint={t("admin.projects.slugHint")}
            error={err("slug")}
            value={form.slug}
            onChange={handleChange}
            required
            dir="ltr"
            autoComplete="off"
            spellCheck={false}
          />

          <AdminField
            id="project-tech"
            name="tech"
            label={t("admin.projects.tech")}
            hint={t("admin.projects.techHint")}
            value={form.tech}
            onChange={handleChange}
            dir="ltr"
            autoComplete="off"
          />

          <div className="admin-grid-2">
            <AdminField
              id="project-live_url"
              name="live_url"
              label={t("admin.projects.liveUrl")}
              error={err("live_url")}
              value={form.live_url}
              onChange={handleChange}
              inputMode="url"
              dir="ltr"
              autoComplete="off"
              placeholder="https://"
            />
            <AdminField
              id="project-repo_url"
              name="repo_url"
              label={t("admin.projects.repoUrl")}
              error={err("repo_url")}
              value={form.repo_url}
              onChange={handleChange}
              inputMode="url"
              dir="ltr"
              autoComplete="off"
              placeholder="https://"
            />
          </div>

          <label className="admin-switch">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            <span>{t("admin.projects.visibility")}</span>
          </label>
        </section>

        {/* ---------- Texts in two languages ---------- */}
        <div className="admin-two-col">
          <section className="admin-section glass">
            <h2>{t("admin.projects.english")}</h2>
            <AdminField
              id="project-title_en"
              name="title_en"
              label={t("admin.projects.titleField")}
              error={err("title_en")}
              value={form.title_en}
              onChange={handleChange}
              required
              dir="ltr"
              lang="en"
              autoComplete="off"
            />
            <AdminField
              id="project-summary_en"
              name="summary_en"
              as="textarea"
              rows={5}
              label={t("admin.projects.summary")}
              error={err("summary_en")}
              value={form.summary_en}
              onChange={handleChange}
              required
              dir="ltr"
              lang="en"
            />
            <AdminField
              id="project-highlights_en"
              name="highlights_en"
              as="textarea"
              rows={6}
              label={t("admin.projects.highlights")}
              hint={t("admin.projects.highlightsHint")}
              value={form.highlights_en}
              onChange={handleChange}
              dir="ltr"
              lang="en"
            />
            <AdminField
              id="project-alt_en"
              name="alt_en"
              label={t("admin.projects.alt")}
              hint={t("admin.projects.altHint")}
              value={form.alt_en}
              onChange={handleChange}
              dir="ltr"
              lang="en"
              autoComplete="off"
            />
          </section>

          <section className="admin-section glass">
            <h2>{t("admin.projects.persian")}</h2>
            <p className="admin-hint">{t("admin.projects.persianHint")}</p>
            <AdminField
              id="project-title_fa"
              name="title_fa"
              label={t("admin.projects.titleField")}
              value={form.title_fa}
              onChange={handleChange}
              dir="rtl"
              lang="fa"
              autoComplete="off"
            />
            <AdminField
              id="project-summary_fa"
              name="summary_fa"
              as="textarea"
              rows={5}
              label={t("admin.projects.summary")}
              value={form.summary_fa}
              onChange={handleChange}
              dir="rtl"
              lang="fa"
            />
            <AdminField
              id="project-highlights_fa"
              name="highlights_fa"
              as="textarea"
              rows={6}
              label={t("admin.projects.highlights")}
              hint={t("admin.projects.highlightsHint")}
              value={form.highlights_fa}
              onChange={handleChange}
              dir="rtl"
              lang="fa"
            />
            <AdminField
              id="project-alt_fa"
              name="alt_fa"
              label={t("admin.projects.alt")}
              hint={t("admin.projects.altHint")}
              value={form.alt_fa}
              onChange={handleChange}
              dir="rtl"
              lang="fa"
              autoComplete="off"
            />
          </section>
        </div>

        {/* ---------- Screenshots ---------- */}
        <section className="admin-section glass">
          <h2>{t("admin.projects.images")}</h2>
          <p className="admin-hint">{t("admin.projects.imagesHint")}</p>

          <div className="admin-grid-2">
            <ImagePicker
              id="project-image_dark"
              label={t("admin.projects.darkImage")}
              currentUrl={currentImage}
              blob={darkBlob}
              onBlob={handleDark}
            />
            <ImagePicker
              id="project-image_light"
              label={t("admin.projects.lightImage")}
              currentUrl={currentImage ? lightSrc(currentImage) : ""}
              blob={lightBlob}
              onBlob={handleLight}
              error={err("image_light")}
              hint={darkBlob && !lightBlob ? t("admin.projects.noLightHint") : ""}
              light
            />
          </div>

          {original?.image && !darkBlob && (
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={removeImage}
                onChange={(e) => setRemoveImage(e.target.checked)}
              />
              <span>{t("admin.projects.removeImage")}</span>
            </label>
          )}
        </section>

        <div className="admin-form-actions glass">
          <button type="submit" className="btn btn-primary" disabled={saving} aria-busy={saving}>
            {saving && <span className="spinner" aria-hidden="true" />}
            <span>{saving ? t("admin.common.saving") : t("admin.common.save")}</span>
          </button>
          <Link to="/admin/projects" className="btn btn-ghost">
            {t("admin.common.cancel")}
          </Link>
        </div>
      </form>
    </>
  );
}