import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from "../../components/Icons";
import AdminField from "./AdminField";
import { supabase } from "../../lib/supabase";
import { profile as fallbackProfile } from "../../data/profile";
import { useContent } from "../../hooks/useContent";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../hooks/useTranslation";

const URL_RE = /^https?:\/\/\S+$/i;
const GROUPS = ["frontend", "tools", "languages"];
const LEVELS = ["learning", "comfortable", "confident"];

const toLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const move = (list, index, direction) => {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};

// Database data -> form values (arrays of lines become text)
function toForm(data) {
  const p = { ...fallbackProfile, ...data };
  return {
    brand: p.brand ?? "",
    name: { en: p.name?.en ?? "", fa: p.name?.fa ?? "" },
    firstName: { en: p.firstName?.en ?? "", fa: p.firstName?.fa ?? "" },
    title: { en: p.title?.en ?? "", fa: p.title?.fa ?? "" },
    tagline: { en: p.tagline?.en ?? "", fa: p.tagline?.fa ?? "" },
    location: { en: p.location?.en ?? "", fa: p.location?.fa ?? "" },
    bio: { en: p.bio?.en ?? "", fa: p.bio?.fa ?? "" },
    education: { en: p.education?.en ?? "", fa: p.education?.fa ?? "" },
    achievements: {
      en: (p.achievements?.en ?? []).join("\n"),
      fa: (p.achievements?.fa ?? []).join("\n"),
    },
    languages: {
      en: (p.languages?.en ?? []).join("\n"),
      fa: (p.languages?.fa ?? []).join("\n"),
    },
    contact: {
      emailUser: p.contact?.emailUser ?? "",
      emailDomain: p.contact?.emailDomain ?? "",
    },
    social: {
      github: p.social?.github ?? "",
      linkedin: p.social?.linkedin ?? "",
      telegram: p.social?.telegram ?? "",
    },
    skills: (p.skills ?? []).map((s) => ({
      name: s.name ?? "",
      group: s.group ?? "frontend",
      level: s.level ?? "learning",
      description: { en: s.description?.en ?? "", fa: s.description?.fa ?? "" },
    })),
    journey: (p.journey ?? []).map((s) => ({
      title: { en: s.title?.en ?? "", fa: s.title?.fa ?? "" },
      text: { en: s.text?.en ?? "", fa: s.text?.fa ?? "" },
    })),
    goals: (p.goals ?? []).map((s) => ({
      title: { en: s.title?.en ?? "", fa: s.title?.fa ?? "" },
      text: { en: s.text?.en ?? "", fa: s.text?.fa ?? "" },
    })),
    experience: (p.experience ?? []).map((s) => ({
      role: { en: s.role?.en ?? "", fa: s.role?.fa ?? "" },
      text: { en: s.text?.en ?? "", fa: s.text?.fa ?? "" },
    })),
    certificates: (p.certificates ?? []).map((c) => ({
      title: c.title ?? "",
      issuer: c.issuer ?? "",
      url: c.url ?? "",
    })),
    // Keys that have no form yet are kept, so saving never deletes them
    reactConcepts: p.reactConcepts ?? [],
  };
}

// Form values -> the object that is stored in the database
function toData(f) {
  return {
    brand: f.brand.trim(),
    name: { en: f.name.en.trim(), fa: f.name.fa.trim() },
    firstName: { en: f.firstName.en.trim(), fa: f.firstName.fa.trim() },
    title: { en: f.title.en.trim(), fa: f.title.fa.trim() },
    tagline: { en: f.tagline.en.trim(), fa: f.tagline.fa.trim() },
    location: { en: f.location.en.trim(), fa: f.location.fa.trim() },
    bio: { en: f.bio.en.trim(), fa: f.bio.fa.trim() },
    education: { en: f.education.en.trim(), fa: f.education.fa.trim() },
    achievements: { en: toLines(f.achievements.en), fa: toLines(f.achievements.fa) },
    languages: { en: toLines(f.languages.en), fa: toLines(f.languages.fa) },
    contact: {
      emailUser: f.contact.emailUser.trim(),
      emailDomain: f.contact.emailDomain.trim(),
    },
    social: {
      github: f.social.github.trim(),
      linkedin: f.social.linkedin.trim(),
      telegram: f.social.telegram.trim(),
    },
    skills: f.skills
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        group: s.group,
        level: s.level,
        description: { en: s.description.en.trim(), fa: s.description.fa.trim() },
      })),
    journey: f.journey
      .filter((s) => s.title.en.trim())
      .map((s) => ({
        title: { en: s.title.en.trim(), fa: s.title.fa.trim() },
        text: { en: s.text.en.trim(), fa: s.text.fa.trim() },
      })),
    goals: f.goals
      .filter((s) => s.title.en.trim())
      .map((s) => ({
        title: { en: s.title.en.trim(), fa: s.title.fa.trim() },
        text: { en: s.text.en.trim(), fa: s.text.fa.trim() },
      })),
    experience: f.experience
      .filter((s) => s.role.en.trim())
      .map((s) => ({
        role: { en: s.role.en.trim(), fa: s.role.fa.trim() },
        text: { en: s.text.en.trim(), fa: s.text.fa.trim() },
      })),
    certificates: f.certificates
      .filter((c) => c.title.trim())
      .map((c) => ({ title: c.title.trim(), issuer: c.issuer.trim(), url: c.url.trim() })),
    reactConcepts: f.reactConcepts,
  };
}

function validate(f) {
  const errors = {};
  if (!f.brand.trim()) errors.brand = "required";
  if (!f.name.en.trim()) errors.name_en = "required";
  if (!f.title.en.trim()) errors.title_en = "required";

  ["github", "linkedin", "telegram"].forEach((key) => {
    const v = f.social[key].trim();
    if (v && !URL_RE.test(v)) errors[`social_${key}`] = "urlInvalid";
  });

  f.certificates.forEach((c, i) => {
    const v = c.url.trim();
    if (v && !URL_RE.test(v)) errors[`cert_${i}`] = "urlInvalid";
  });
  return errors;
}

// Two fields side by side: English and Persian
function BilingualField({ id, label, value, onChange, as, rows, error }) {
  return (
    <div className="admin-grid-2">
      <AdminField
        id={`${id}_en`}
        label={label}
        value={value.en}
        onChange={(e) => onChange("en", e.target.value)}
        as={as}
        rows={rows}
        error={error}
        dir="ltr"
        lang="en"
        autoComplete="off"
      />
      <AdminField
        id={`${id}_fa`}
        label={label}
        value={value.fa}
        onChange={(e) => onChange("fa", e.target.value)}
        as={as}
        rows={rows}
        dir="rtl"
        lang="fa"
        autoComplete="off"
      />
    </div>
  );
}

// Add / move / remove buttons for one item of a list
function RowTools({ index, total, onMove, onRemove, t }) {
  return (
    <div className="admin-actions" style={{ justifyContent: "flex-start" }}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => onMove(index, -1)}
        disabled={index === 0}
        aria-label={t("admin.profile.moveUp")}
        title={t("admin.profile.moveUp")}
      >
        <ArrowUpIcon />
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={() => onMove(index, 1)}
        disabled={index === total - 1}
        aria-label={t("admin.profile.moveDown")}
        title={t("admin.profile.moveDown")}
      >
        <ArrowDownIcon />
      </button>
      <button
        type="button"
        className="icon-btn danger"
        onClick={() => onRemove(index)}
        aria-label={t("admin.profile.remove")}
        title={t("admin.profile.remove")}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

export default function ProfileForm() {
  const { t } = useTranslation();
  const toast = useToast();
  const { reload } = useContent();

  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [attempt, setAttempt] = useState(0);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("profile")
      .select("data")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadState("error");
          return;
        }
        // No row yet: start from the built-in profile
        setForm(toForm(data?.data ?? {}));
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

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

  const retry = () => {
    setLoadState("loading");
    setAttempt((n) => n + 1);
  };

  const touch = () => setDirty(true);

  // Plain value: setValue("brand", "x")
  const setValue = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    touch();
  };

  // { en, fa } value: setLang("name", "en", "x")
  const setLang = (key, lang, value) => {
    setForm((f) => ({ ...f, [key]: { ...f[key], [lang]: value } }));
    touch();
  };

  // Nested object: setIn("social", "github", "x")
  const setIn = (key, field, value) => {
    setForm((f) => ({ ...f, [key]: { ...f[key], [field]: value } }));
    touch();
  };

  // Lists: update, add, remove and reorder items
  const updateItem = (key, index, changes) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].map((item, i) => (i === index ? { ...item, ...changes } : item)),
    }));
    touch();
  };

  const updateItemLang = (key, index, field, lang, value) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].map((item, i) =>
        i === index ? { ...item, [field]: { ...item[field], [lang]: value } } : item
      ),
    }));
    touch();
  };

  const addItem = (key, empty) => {
    setForm((f) => ({ ...f, [key]: [...f[key], empty] }));
    touch();
  };

  const removeItem = (key, index) => {
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));
    touch();
  };

  const moveItem = (key, index, direction) => {
    setForm((f) => ({ ...f, [key]: move(f[key], index, direction) }));
    touch();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const found = validate(form);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`profile-${firstInvalid}`)?.focus();
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("profile")
        .upsert({ id: 1, data: toData(form) })
        .select("id");

      if (error || !data?.length) throw error ?? new Error("no-permission");

      setDirty(false);
      reload().catch(() => {});
      toast.success(t("admin.profile.saved"));
    } catch (err) {
      toast.error(
        err?.message === "no-permission" ? t("admin.common.noPermission") : t("admin.common.saveError")
      );
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

  const err = (field) => (errors[field] ? t(`admin.profile.errors.${errors[field]}`) : "");
  const f = form;

  return (
    <>
      <h1 className="admin-title">{t("admin.profile.title")}</h1>
      <p className="admin-lead">{t("admin.profile.lead")}</p>

      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        {/* ---------- General ---------- */}
        <section className="admin-section glass">
          <h2>{t("admin.profile.sections.general")}</h2>
          <p className="admin-hint">{t("admin.profile.persianHint")}</p>

          <AdminField
            id="profile-brand"
            label={t("admin.profile.fields.brand")}
            hint={t("admin.profile.fields.brandHint")}
            error={err("brand")}
            value={f.brand}
            onChange={(e) => setValue("brand", e.target.value)}
            required
            dir="ltr"
            autoComplete="off"
          />

          <BilingualField
            id="profile-name"
            label={t("admin.profile.fields.name")}
            value={f.name}
            onChange={(lang, v) => setLang("name", lang, v)}
            error={err("name_en")}
          />
          <BilingualField
            id="profile-firstName"
            label="First name"
            value={f.firstName}
            onChange={(lang, v) => setLang("firstName", lang, v)}
          />
          <BilingualField
            id="profile-title"
            label={t("admin.profile.fields.title")}
            value={f.title}
            onChange={(lang, v) => setLang("title", lang, v)}
            error={err("title_en")}
          />
          <BilingualField
            id="profile-tagline"
            label={t("admin.profile.fields.tagline")}
            value={f.tagline}
            onChange={(lang, v) => setLang("tagline", lang, v)}
            as="textarea"
            rows={2}
          />
          <BilingualField
            id="profile-location"
            label={t("admin.profile.fields.location")}
            value={f.location}
            onChange={(lang, v) => setLang("location", lang, v)}
          />
        </section>

        {/* ---------- About ---------- */}
        <section className="admin-section glass">
          <h2>{t("admin.profile.sections.about")}</h2>

          <BilingualField
            id="profile-bio"
            label={t("admin.profile.fields.bio")}
            value={f.bio}
            onChange={(lang, v) => setLang("bio", lang, v)}
            as="textarea"
            rows={4}
          />
          <BilingualField
            id="profile-education"
            label={t("admin.profile.fields.education")}
            value={f.education}
            onChange={(lang, v) => setLang("education", lang, v)}
          />

          <p className="admin-hint">{t("admin.profile.fields.achievementsHint")}</p>
          <BilingualField
            id="profile-achievements"
            label={t("admin.profile.fields.achievements")}
            value={f.achievements}
            onChange={(lang, v) => setLang("achievements", lang, v)}
            as="textarea"
            rows={4}
          />

          <p className="admin-hint">{t("admin.profile.fields.languagesHint")}</p>
          <BilingualField
            id="profile-languages"
            label={t("admin.profile.fields.languages")}
            value={f.languages}
            onChange={(lang, v) => setLang("languages", lang, v)}
            as="textarea"
            rows={3}
          />
        </section>

        {/* ---------- Links and contact ---------- */}
        <section className="admin-section glass">
          <h2>{t("admin.profile.sections.links")}</h2>

          <div className="admin-grid-2">
            <AdminField
              id="profile-emailUser"
              label={t("admin.profile.fields.emailUser")}
              value={f.contact.emailUser}
              onChange={(e) => setIn("contact", "emailUser", e.target.value)}
              dir="ltr"
              autoComplete="off"
            />
            <AdminField
              id="profile-emailDomain"
              label={t("admin.profile.fields.emailDomain")}
              value={f.contact.emailDomain}
              onChange={(e) => setIn("contact", "emailDomain", e.target.value)}
              dir="ltr"
              autoComplete="off"
            />
          </div>

          {["github", "linkedin", "telegram"].map((key) => (
            <AdminField
              key={key}
              id={`profile-social_${key}`}
              label={t(`admin.profile.fields.${key}`)}
              error={err(`social_${key}`)}
              value={f.social[key]}
              onChange={(e) => setIn("social", key, e.target.value)}
              inputMode="url"
              placeholder="https://"
              dir="ltr"
              autoComplete="off"
            />
          ))}
        </section>

        {/* ---------- Skills ---------- */}
        <section className="admin-section glass">
          <div className="admin-section-head">
            <h2>{t("admin.profile.sections.skills")}</h2>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                addItem("skills", {
                  name: "",
                  group: "frontend",
                  level: "learning",
                  description: { en: "", fa: "" },
                })
              }
            >
              <PlusIcon className="btn-icon" /> {t("admin.profile.add")}
            </button>
          </div>

          {f.skills.map((skill, i) => (
            <div key={i} className="admin-section glass">
              <div className="admin-grid-2">
                <AdminField
                  id={`profile-skill_${i}_name`}
                  label={t("admin.profile.fields.skillName")}
                  value={skill.name}
                  onChange={(e) => updateItem("skills", i, { name: e.target.value })}
                  dir="ltr"
                  autoComplete="off"
                />
                <div className="admin-grid-2">
                  <AdminField
                    id={`profile-skill_${i}_group`}
                    as="select"
                    label={t("admin.profile.fields.skillGroup")}
                    value={skill.group}
                    onChange={(e) => updateItem("skills", i, { group: e.target.value })}
                  >
                    {GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {t(`admin.profile.groups.${g}`)}
                      </option>
                    ))}
                  </AdminField>
                  <AdminField
                    id={`profile-skill_${i}_level`}
                    as="select"
                    label={t("admin.profile.fields.skillLevel")}
                    value={skill.level}
                    onChange={(e) => updateItem("skills", i, { level: e.target.value })}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {t(`admin.profile.levels.${l}`)}
                      </option>
                    ))}
                  </AdminField>
                </div>
              </div>

              <BilingualField
                id={`profile-skill_${i}_description`}
                label={t("admin.profile.fields.skillDescription")}
                value={skill.description}
                onChange={(lang, v) => updateItemLang("skills", i, "description", lang, v)}
              />

              <RowTools
                index={i}
                total={f.skills.length}
                onMove={(idx, dir) => moveItem("skills", idx, dir)}
                onRemove={(idx) => removeItem("skills", idx)}
                t={t}
              />
            </div>
          ))}
        </section>

        {/* ---------- Journey ---------- */}
        <section className="admin-section glass">
          <div className="admin-section-head">
            <h2>{t("admin.profile.sections.journey")}</h2>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                addItem("journey", { title: { en: "", fa: "" }, text: { en: "", fa: "" } })
              }
            >
              <PlusIcon className="btn-icon" /> {t("admin.profile.add")}
            </button>
          </div>

          {f.journey.map((step, i) => (
            <div key={i} className="admin-section glass">
              <BilingualField
                id={`profile-journey_${i}_title`}
                label={t("admin.profile.fields.itemTitle")}
                value={step.title}
                onChange={(lang, v) => updateItemLang("journey", i, "title", lang, v)}
              />
              <BilingualField
                id={`profile-journey_${i}_text`}
                label={t("admin.profile.fields.itemText")}
                value={step.text}
                onChange={(lang, v) => updateItemLang("journey", i, "text", lang, v)}
                as="textarea"
                rows={3}
              />
              <RowTools
                index={i}
                total={f.journey.length}
                onMove={(idx, dir) => moveItem("journey", idx, dir)}
                onRemove={(idx) => removeItem("journey", idx)}
                t={t}
              />
            </div>
          ))}
        </section>

        {/* ---------- Goals ---------- */}
        <section className="admin-section glass">
          <div className="admin-section-head">
            <h2>{t("admin.profile.sections.goals")}</h2>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                addItem("goals", { title: { en: "", fa: "" }, text: { en: "", fa: "" } })
              }
            >
              <PlusIcon className="btn-icon" /> {t("admin.profile.add")}
            </button>
          </div>

          {f.goals.map((goal, i) => (
            <div key={i} className="admin-section glass">
              <BilingualField
                id={`profile-goal_${i}_title`}
                label={t("admin.profile.fields.itemTitle")}
                value={goal.title}
                onChange={(lang, v) => updateItemLang("goals", i, "title", lang, v)}
              />
              <BilingualField
                id={`profile-goal_${i}_text`}
                label={t("admin.profile.fields.itemText")}
                value={goal.text}
                onChange={(lang, v) => updateItemLang("goals", i, "text", lang, v)}
                as="textarea"
                rows={3}
              />
              <RowTools
                index={i}
                total={f.goals.length}
                onMove={(idx, dir) => moveItem("goals", idx, dir)}
                onRemove={(idx) => removeItem("goals", idx)}
                t={t}
              />
            </div>
          ))}
        </section>

        {/* ---------- Experience ---------- */}
        <section className="admin-section glass">
          <div className="admin-section-head">
            <h2>{t("admin.profile.sections.experience")}</h2>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                addItem("experience", { role: { en: "", fa: "" }, text: { en: "", fa: "" } })
              }
            >
              <PlusIcon className="btn-icon" /> {t("admin.profile.add")}
            </button>
          </div>

          {f.experience.map((item, i) => (
            <div key={i} className="admin-section glass">
              <BilingualField
                id={`profile-experience_${i}_role`}
                label={t("admin.profile.fields.role")}
                value={item.role}
                onChange={(lang, v) => updateItemLang("experience", i, "role", lang, v)}
              />
              <BilingualField
                id={`profile-experience_${i}_text`}
                label={t("admin.profile.fields.itemText")}
                value={item.text}
                onChange={(lang, v) => updateItemLang("experience", i, "text", lang, v)}
                as="textarea"
                rows={3}
              />
              <RowTools
                index={i}
                total={f.experience.length}
                onMove={(idx, dir) => moveItem("experience", idx, dir)}
                onRemove={(idx) => removeItem("experience", idx)}
                t={t}
              />
            </div>
          ))}
        </section>

        {/* ---------- Certificates ---------- */}
        <section className="admin-section glass">
          <div className="admin-section-head">
            <h2>{t("admin.profile.sections.certificates")}</h2>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => addItem("certificates", { title: "", issuer: "", url: "" })}
            >
              <PlusIcon className="btn-icon" /> {t("admin.profile.add")}
            </button>
          </div>

          {f.certificates.map((cert, i) => (
            <div key={i} className="admin-section glass">
              <div className="admin-grid-2">
                <AdminField
                  id={`profile-cert_${i}_title`}
                  label={t("admin.profile.fields.certTitle")}
                  value={cert.title}
                  onChange={(e) => updateItem("certificates", i, { title: e.target.value })}
                  dir="ltr"
                  autoComplete="off"
                />
                <AdminField
                  id={`profile-cert_${i}_issuer`}
                  label={t("admin.profile.fields.certIssuer")}
                  value={cert.issuer}
                  onChange={(e) => updateItem("certificates", i, { issuer: e.target.value })}
                  dir="ltr"
                  autoComplete="off"
                />
              </div>
              <AdminField
                id={`profile-cert_${i}`}
                label={t("admin.profile.fields.certUrl")}
                error={err(`cert_${i}`)}
                value={cert.url}
                onChange={(e) => updateItem("certificates", i, { url: e.target.value })}
                inputMode="url"
                placeholder="https://"
                dir="ltr"
                autoComplete="off"
              />
              <RowTools
                index={i}
                total={f.certificates.length}
                onMove={(idx, dir) => moveItem("certificates", idx, dir)}
                onRemove={(idx) => removeItem("certificates", idx)}
                t={t}
              />
            </div>
          ))}
        </section>

        <div className="admin-form-actions glass">
          <button type="submit" className="btn btn-primary" disabled={saving} aria-busy={saving}>
            {saving && <span className="spinner" aria-hidden="true" />}
            <span>{saving ? t("admin.common.saving") : t("admin.common.save")}</span>
          </button>
          {dirty && !saving && <span className="admin-unsaved">{t("admin.profile.unsaved")}</span>}
        </div>
      </form>
    </>
  );
}