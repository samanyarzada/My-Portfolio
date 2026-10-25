import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import AdminField from "./AdminField";
import ImagePicker from "./ImagePicker";
import MarkdownEditor from "./MarkdownEditor";
import { supabase } from "../../lib/supabase";
import { removeStoredImages, removeUploaded, uploadImage } from "../../lib/media";
import { useContent } from "../../hooks/useContent";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../hooks/useTranslation";
import { formatNumber } from "../../utils/format";
import { slugify } from "../../utils/slugify";
import { lightSrc } from "../../utils/themedImage";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const FENCE = "`".repeat(3);

// Same order as on the screen, so focus goes to the first invalid field
const FIELD_ORDER = [
  "slug",
  "category_id",
  "published_at",
  "read_time",
  "title_en",
  "excerpt_en",
  "content_en",
  "image_light",
];

// [what you type, translation key]
const CHEAT = [
  ["**text**", "bold"],
  ["*text*", "italic"],
  ["## Heading", "heading"],
  ["[text](https://...)", "link"],
  ["![alt](https://...)", "image"],
  ["- item", "list"],
  ["1. item", "orderedList"],
  ["> quote", "quote"],
  ["`code`", "code"],
  [`${FENCE} (on its own line)`, "codeBlock"],
];

const toSlug = (text) =>
  slugify(text)
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// "React, #CSS, my tag" -> ["react", "css", "my-tag"]
const toTags = (text) => [
  ...new Set(
    text
      .split(",")
      .map((tag) => slugify(tag.replace(/^#/, "")))
      .filter(Boolean)
  ),
];

const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const estimateMinutes = (text) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const makeEmpty = () => ({
  slug: "",
  category_id: "",
  tags: "",
  published_at: today(),
  read_time: "5",
  featured: false,
  status: "draft",
  title_en: "",
  title_fa: "",
  excerpt_en: "",
  excerpt_fa: "",
  content_en: "",
  content_fa: "",
});

const toForm = (row) => ({
  slug: row.slug,
  category_id: row.category_id,
  tags: row.tags.join(", "),
  published_at: row.published_at,
  read_time: String(row.read_time),
  featured: row.featured,
  status: row.status,
  title_en: row.title_en,
  title_fa: row.title_fa,
  excerpt_en: row.excerpt_en,
  excerpt_fa: row.excerpt_fa,
  content_en: row.content_en,
  content_fa: row.content_fa,
});

function validate(form, darkBlob, lightBlob) {
  const errors = {};

  if (!form.slug.trim()) errors.slug = "required";
  else if (!SLUG_RE.test(form.slug.trim())) errors.slug = "slugInvalid";

  if (!form.category_id) errors.category_id = "required";
  if (!DATE_RE.test(form.published_at)) errors.published_at = "dateInvalid";

  const minutes = Number(form.read_time);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 240) errors.read_time = "readTimeInvalid";

  if (!form.title_en.trim()) errors.title_en = "required";

  // A published article must be readable, a draft may be unfinished
  if (form.status === "published") {
    if (!form.excerpt_en.trim()) errors.excerpt_en = "needForPublish";
    if (!form.content_en.trim()) errors.content_en = "needForPublish";
  }

  // The light image is stored next to the dark one, so they are uploaded as a pair
  if (lightBlob && !darkBlob) errors.image_light = "lightNeedsDark";
  return errors;
}

// The key resets the form when the address changes (new <-> edit)
export default function PostForm() {
  const { id } = useParams();
  return <PostFormInner key={id ?? "new"} id={id} />;
}

function PostFormInner({ id }) {
  const isEdit = Boolean(id);
  const { t, lang } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { reload } = useContent();

  const [loadState, setLoadState] = useState("loading"); // loading | ready | error | missing
  const [attempt, setAttempt] = useState(0);
  const [original, setOriginal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(makeEmpty);
  const [errors, setErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [contentLang, setContentLang] = useState("en");
  const [darkBlob, setDarkBlob] = useState(null);
  const [lightBlob, setLightBlob] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const postRequest = isEdit
      ? supabase.from("posts").select("*").eq("id", id).maybeSingle()
      : Promise.resolve({ data: null, error: null });

    Promise.all([
      supabase.from("categories").select("id, name_en, name_fa").order("sort_order"),
      postRequest,
    ])
      .then(([cats, postResult]) => {
        if (cancelled) return;
        if (cats.error || postResult.error) {
          setLoadState("error");
          return;
        }

        setCategories(cats.data);

        if (isEdit) {
          if (!postResult.data) {
            setLoadState("missing");
            return;
          }
          setOriginal(postResult.data);
          setForm(toForm(postResult.data));
        } else {
          setForm((prev) => ({ ...prev, category_id: cats.data[0]?.id ?? "" }));
        }
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEdit, attempt]);

  // Warn before the tab is closed with unsaved work
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const estimate = useMemo(
    () => estimateMinutes(form.content_en || form.content_fa),
    [form.content_en, form.content_fa]
  );

  const retry = () => {
    setLoadState("loading");
    setAttempt((n) => n + 1);
  };

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setDirty(true);
    setErrors((prev) => {
      if (!prev[name] && name !== "status") return prev;
      const next = { ...prev, [name]: undefined };
      // Switching back to a draft removes the "needed to publish" errors
      if (name === "status" && value === "draft") {
        next.excerpt_en = undefined;
        next.content_en = undefined;
      }
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    let value = type === "checkbox" ? checked : e.target.value;

    if (name === "slug") {
      value = value.toLowerCase();
      setSlugTouched(true);
    }

    // While creating, the address follows the English title until it is edited by hand
    if (name === "title_en" && !isEdit && !slugTouched) {
      setForm((prev) => ({ ...prev, title_en: value, slug: toSlug(value) }));
      setDirty(true);
      setErrors((prev) => ({ ...prev, title_en: undefined, slug: undefined }));
      return;
    }

    update(name, value);
  };

  const handleDark = (blob) => {
    setDarkBlob(blob);
    setDirty(true);
    setErrors((prev) => ({ ...prev, image_light: undefined }));
  };

  const handleLight = (blob) => {
    setLightBlob(blob);
    setDirty(true);
    setErrors((prev) => ({ ...prev, image_light: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const found = validate(form, darkBlob, lightBlob);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      if (firstInvalid === "content_en") setContentLang("en");
      requestAnimationFrame(() => document.getElementById(`post-${firstInvalid}`)?.focus());
      return;
    }

    setSaving(true);
    const uploaded = []; // paths to clean up if saving fails
    try {
      const slug = form.slug.trim();
      const oldImage = original?.image ?? "";
      let image = removeImage ? "" : oldImage;

      if (darkBlob) {
        const base = `posts/${slug}-${Date.now()}`;
        image = await uploadImage(`${base}.webp`, darkBlob);
        uploaded.push(`${base}.webp`);
        if (lightBlob) {
          await uploadImage(`${base}-light.webp`, lightBlob);
          uploaded.push(`${base}-light.webp`);
        }
      }

      const payload = {
        slug,
        category_id: form.category_id,
        tags: toTags(form.tags),
        published_at: form.published_at,
        read_time: Number(form.read_time),
        featured: form.featured,
        status: form.status,
        image,
        title_en: form.title_en.trim(),
        title_fa: form.title_fa.trim(),
        excerpt_en: form.excerpt_en.trim(),
        excerpt_fa: form.excerpt_fa.trim(),
        content_en: form.content_en,
        content_fa: form.content_fa,
      };

      const query = isEdit
        ? supabase.from("posts").update(payload).eq("id", id)
        : supabase.from("posts").insert(payload);
      const { data, error } = await query.select("id");

      // 23505 = the unique address (slug) exists, 23503 = the category does not exist
      if (error?.code === "23505" || error?.code === "23503") {
        await removeUploaded(uploaded);
        const field = error.code === "23505" ? "slug" : "category_id";
        setErrors({ [field]: error.code === "23505" ? "slugTaken" : "categoryMissing" });
        requestAnimationFrame(() => document.getElementById(`post-${field}`)?.focus());
        return;
      }
      if (error || !data?.length) throw error ?? new Error("no-permission");

      // The old files are removed only after the new data is safely saved
      if (image !== oldImage) await removeStoredImages(oldImage);

      setDirty(false);
      reload().catch(() => {});
      toast.success(isEdit ? t("admin.posts.updated") : t("admin.posts.created"));
      navigate("/admin/posts");
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
        <p>{t("admin.posts.notFound")}</p>
        <Link to="/admin/posts" className="btn btn-primary">
          {t("admin.common.back")}
        </Link>
      </div>
    );
  }

  const err = (field) => (errors[field] ? t(`admin.posts.errors.${errors[field]}`) : "");
  const currentImage = removeImage ? "" : original?.image ?? "";
  const categoryName = (c) => (lang === "fa" && c.name_fa ? c.name_fa : c.name_en);

  return (
    <>
      <Link to="/admin/posts" className="link-arrow admin-back">
        <span className="arrow back-arrow">→</span> {t("admin.common.back")}
      </Link>

      <h1 className="admin-title">{isEdit ? t("admin.posts.editTitle") : t("admin.posts.newTitle")}</h1>

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        {/* ---------- General ---------- */}
        <section className="admin-section glass">
          <h2>{t("admin.posts.general")}</h2>

          {categories.length === 0 && (
            <p className="admin-error" role="alert">
              {t("admin.posts.noCategories")}
            </p>
          )}

          <AdminField
            id="post-slug"
            name="slug"
            label={t("admin.posts.slug")}
            hint={t("admin.posts.slugHint")}
            error={err("slug")}
            value={form.slug}
            onChange={handleChange}
            required
            dir="ltr"
            autoComplete="off"
            spellCheck={false}
          />

          <div className="admin-grid-2">
            <AdminField
              id="post-category_id"
              name="category_id"
              as="select"
              label={t("admin.posts.category")}
              error={err("category_id")}
              value={form.category_id}
              onChange={handleChange}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {categoryName(c)}
                </option>
              ))}
            </AdminField>

            <AdminField
              id="post-status"
              name="status"
              as="select"
              label={t("admin.posts.status")}
              value={form.status}
              onChange={handleChange}
            >
              <option value="draft">{t("admin.posts.statusDraft")}</option>
              <option value="published">{t("admin.posts.statusPublished")}</option>
            </AdminField>
          </div>

          <div className="admin-grid-2">
            <AdminField
              id="post-published_at"
              name="published_at"
              type="date"
              label={t("admin.posts.date")}
              error={err("published_at")}
              value={form.published_at}
              onChange={handleChange}
              required
              dir="ltr"
            />

            <div className="admin-stack">
              <AdminField
                id="post-read_time"
                name="read_time"
                type="number"
                min="1"
                max="240"
                inputMode="numeric"
                label={t("admin.posts.readTime")}
                hint={`${t("admin.posts.estimate")}: ${formatNumber(estimate, lang)}`}
                error={err("read_time")}
                value={form.read_time}
                onChange={handleChange}
                required
                dir="ltr"
              />
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => update("read_time", String(estimate))}
              >
                {t("admin.posts.useEstimate")}
              </button>
            </div>
          </div>

          <AdminField
            id="post-tags"
            name="tags"
            label={t("admin.posts.tags")}
            hint={t("admin.posts.tagsHint")}
            value={form.tags}
            onChange={handleChange}
            autoComplete="off"
            dir="auto"
          />

          <label className="admin-switch">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            <span>{t("admin.posts.featuredSwitch")}</span>
          </label>
          <p className="admin-hint">{t("admin.posts.featuredHint")}</p>
        </section>

        {/* ---------- Title and summary in two languages ---------- */}
        <div className="admin-two-col">
          <section className="admin-section glass">
            <h2>{t("admin.posts.english")}</h2>
            <AdminField
              id="post-title_en"
              name="title_en"
              label={t("admin.posts.titleField")}
              error={err("title_en")}
              value={form.title_en}
              onChange={handleChange}
              required
              dir="ltr"
              lang="en"
              autoComplete="off"
            />
            <AdminField
              id="post-excerpt_en"
              name="excerpt_en"
              as="textarea"
              rows={4}
              label={t("admin.posts.excerpt")}
              hint={t("admin.posts.excerptHint")}
              error={err("excerpt_en")}
              value={form.excerpt_en}
              onChange={handleChange}
              dir="ltr"
              lang="en"
            />
          </section>

          <section className="admin-section glass">
            <h2>{t("admin.posts.persian")}</h2>
            <p className="admin-hint">{t("admin.posts.persianHint")}</p>
            <AdminField
              id="post-title_fa"
              name="title_fa"
              label={t("admin.posts.titleField")}
              value={form.title_fa}
              onChange={handleChange}
              dir="rtl"
              lang="fa"
              autoComplete="off"
            />
            <AdminField
              id="post-excerpt_fa"
              name="excerpt_fa"
              as="textarea"
              rows={4}
              label={t("admin.posts.excerpt")}
              hint={t("admin.posts.excerptHint")}
              value={form.excerpt_fa}
              onChange={handleChange}
              dir="rtl"
              lang="fa"
            />
          </section>
        </div>

        {/* ---------- Content (Markdown) ---------- */}
        <section className="admin-section glass">
          <div className="admin-section-head">
            <h2>{t("admin.posts.content")}</h2>
            <div className="admin-tabs" role="group" aria-label={t("admin.posts.contentLang")}>
              {[
                ["en", t("admin.posts.english")],
                ["fa", t("admin.posts.persian")],
              ].map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  className={`admin-tab ${contentLang === code ? "active" : ""}`}
                  aria-pressed={contentLang === code}
                  onClick={() => setContentLang(code)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="admin-hint">{t("admin.posts.contentHint")}</p>

          <MarkdownEditor
            key={contentLang}
            id={`post-content_${contentLang}`}
            lang={contentLang}
            value={form[`content_${contentLang}`]}
            onChange={(value) => update(`content_${contentLang}`, value)}
            invalid={contentLang === "en" && Boolean(errors.content_en)}
            describedBy={errors.content_en ? "post-content-error" : undefined}
          />

          {errors.content_en && contentLang === "en" && (
            <p id="post-content-error" className="field-error" role="alert">
              {err("content_en")}
            </p>
          )}

          <details className="md-cheat">
            <summary>{t("admin.posts.cheat.title")}</summary>
            <table>
              <tbody>
                {CHEAT.map(([syntax, key]) => (
                  <tr key={key}>
                    <td>
                      <code dir="ltr">{syntax}</code>
                    </td>
                    <td>{t(`admin.posts.editor.${key}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>

        {/* ---------- Cover images ---------- */}
        <section className="admin-section glass">
          <h2>{t("admin.posts.images")}</h2>
          <p className="admin-hint">{t("admin.posts.imagesHint")}</p>

          <div className="admin-grid-2">
            <ImagePicker
              id="post-image_dark"
              label={t("admin.projects.darkImage")}
              currentUrl={currentImage}
              blob={darkBlob}
              onBlob={handleDark}
              aspect="2 / 1"
              maxWidth={1600}
            />
            <ImagePicker
              id="post-image_light"
              label={t("admin.projects.lightImage")}
              currentUrl={currentImage ? lightSrc(currentImage) : ""}
              blob={lightBlob}
              onBlob={handleLight}
              error={err("image_light")}
              hint={darkBlob && !lightBlob ? t("admin.projects.noLightHint") : ""}
              aspect="2 / 1"
              maxWidth={1600}
              light
            />
          </div>

          {original?.image && !darkBlob && (
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={removeImage}
                onChange={(e) => {
                  setRemoveImage(e.target.checked);
                  setDirty(true);
                }}
              />
              <span>{t("admin.posts.removeImage")}</span>
            </label>
          )}
        </section>

        <div className="admin-form-actions glass">
          <button type="submit" className="btn btn-primary" disabled={saving} aria-busy={saving}>
            {saving && <span className="spinner" aria-hidden="true" />}
            <span>{saving ? t("admin.common.saving") : t("admin.common.save")}</span>
          </button>
          <Link to="/admin/posts" className="btn btn-ghost">
            {t("admin.common.cancel")}
          </Link>
          {dirty && !saving && <span className="admin-unsaved">{t("admin.posts.unsaved")}</span>}
        </div>
      </form>
    </>
  );
}