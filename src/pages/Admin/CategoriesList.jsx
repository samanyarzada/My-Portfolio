import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import { ArrowDownIcon, ArrowUpIcon, EditIcon, PlusIcon, TrashIcon } from "../../components/Icons";
import AdminField from "./AdminField";
import ConfirmDialog from "./ConfirmDialog";
import { supabase } from "../../lib/supabase";
import { useContent } from "../../hooks/useContent";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../hooks/useTranslation";
import { formatNumber } from "../../utils/format";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMPTY = { id: "", name_en: "", name_fa: "", symbol: "" };

// RLS does not throw when it blocks a change, it just touches 0 rows. We treat that as a failure.
async function updateRow(id, changes) {
  const { data, error } = await supabase.from("categories").update(changes).eq("id", id).select("id");
  if (error || !data?.length) throw new Error("failed");
}

export default function CategoriesList() {
  const { t, lang } = useTranslation();
  const toast = useToast();
  const { reload } = useContent();

  const [state, setState] = useState({ status: "loading", rows: [] });
  const [attempt, setAttempt] = useState(0);
  const [form, setForm] = useState(null); // null | { mode: "new" | "edit", values }
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .then(({ data, error }) => {
        if (cancelled) return;
        setState(error ? { status: "error", rows: [] } : { status: "ready", rows: data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", rows: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: "loading", rows: [] });
    setAttempt((n) => n + 1);
  };

  const refreshSite = () => {
    reload().catch(() => {});
  };

  const nameOf = (row) => (lang === "fa" && row.name_fa ? row.name_fa : row.name_en);

  const openNew = () => {
    setErrors({});
    setForm({ mode: "new", values: EMPTY });
  };

  const openEdit = (row) => {
    setErrors({});
    setForm({
      mode: "edit",
      values: { id: row.id, name_en: row.name_en, name_fa: row.name_fa, symbol: row.symbol },
    });
  };

  const handleChange = (e) => {
    const { name } = e.target;
    const value = name === "id" ? e.target.value.toLowerCase() : e.target.value;
    setForm((f) => ({ ...f, values: { ...f.values, [name]: value } }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const v = form.values;
    const id = v.id.trim();
    const found = {};
    if (!id) found.id = "required";
    else if (!SLUG_RE.test(id)) found.id = "idInvalid";
    if (!v.name_en.trim()) found.name_en = "required";

    setErrors(found);
    const firstInvalid = ["id", "name_en"].find((f) => found[f]);
    if (firstInvalid) {
      document.getElementById(`category-${firstInvalid}`)?.focus();
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name_en: v.name_en.trim(),
        name_fa: v.name_fa.trim(),
        symbol: v.symbol.trim() || "</>",
      };

      let result;
      if (form.mode === "edit") {
        result = await supabase.from("categories").update(payload).eq("id", id).select("id");
      } else {
        const sortOrder = state.rows.reduce((max, r) => Math.max(max, r.sort_order), -1) + 1;
        result = await supabase
          .from("categories")
          .insert({ id, ...payload, sort_order: sortOrder })
          .select("id");
      }

      const { data, error } = result;

      // 23505 = this id already exists
      if (error?.code === "23505") {
        setErrors({ id: "idTaken" });
        document.getElementById("category-id")?.focus();
        return;
      }
      if (error || !data?.length) throw error ?? new Error("no-permission");

      toast.success(form.mode === "edit" ? t("admin.categories.updated") : t("admin.categories.created"));
      setForm(null);
      setAttempt((n) => n + 1);
      refreshSite();
    } catch (err) {
      toast.error(
        err?.message === "no-permission" ? t("admin.common.noPermission") : t("admin.common.saveError")
      );
    } finally {
      setSaving(false);
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    const { rows } = state;
    if (busy || target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    const ordered = next.map((row, i) => ({ ...row, sort_order: i }));
    const changed = ordered.filter((row) => rows.find((r) => r.id === row.id).sort_order !== row.sort_order);

    setBusy(true);
    try {
      await Promise.all(changed.map((row) => updateRow(row.id, { sort_order: row.sort_order })));
      setState({ status: "ready", rows: ordered });
      refreshSite();
    } catch {
      toast.error(t("admin.common.noPermission"));
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    const row = pendingDelete;
    if (!row) return;

    setDeleting(true);
    try {
      // A category that still has articles must not be deleted
      const { count, error: countError } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", row.id);
      if (countError) throw countError;

      if (count > 0) {
        toast.error(`${t("admin.categories.inUse")} (${formatNumber(count, lang)})`);
        return;
      }

      const { data, error } = await supabase.from("categories").delete().eq("id", row.id).select("id");
      if (error?.code === "23503") {
        toast.error(t("admin.categories.inUse"));
        return;
      }
      if (error || !data?.length) throw new Error("failed");

      setState((s) => ({ ...s, rows: s.rows.filter((r) => r.id !== row.id) }));
      toast.success(t("admin.categories.deleted"));
      refreshSite();
    } catch {
      toast.error(t("admin.common.noPermission"));
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const err = (field) => (errors[field] ? t(`admin.categories.errors.${errors[field]}`) : "");

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{t("admin.categories.title")}</h1>
          <p className="admin-lead">{t("admin.categories.lead")}</p>
        </div>
        {!form && (
          <button type="button" className="btn btn-primary" onClick={openNew}>
            <PlusIcon className="btn-icon" /> {t("admin.categories.add")}
          </button>
        )}
      </div>

      {/* ---------- Add / edit form ---------- */}
      {form && (
        <form className="admin-form" onSubmit={handleSubmit} noValidate style={{ marginBlockEnd: "2rem" }}>
          <section className="admin-section glass">
            <h2>{form.mode === "edit" ? t("admin.categories.editTitle") : t("admin.categories.newTitle")}</h2>

            <AdminField
              id="category-id"
              name="id"
              label={t("admin.categories.id")}
              hint={t("admin.categories.idHint")}
              error={err("id")}
              value={form.values.id}
              onChange={handleChange}
              disabled={form.mode === "edit"}
              required
              dir="ltr"
              autoComplete="off"
              spellCheck={false}
            />

            <div className="admin-grid-2">
              <AdminField
                id="category-name_en"
                name="name_en"
                label={t("admin.categories.nameEn")}
                error={err("name_en")}
                value={form.values.name_en}
                onChange={handleChange}
                required
                dir="ltr"
                lang="en"
                autoComplete="off"
              />
              <AdminField
                id="category-name_fa"
                name="name_fa"
                label={t("admin.categories.nameFa")}
                hint={t("admin.categories.nameFaHint")}
                value={form.values.name_fa}
                onChange={handleChange}
                dir="rtl"
                lang="fa"
                autoComplete="off"
              />
            </div>

            <AdminField
              id="category-symbol"
              name="symbol"
              label={t("admin.categories.symbol")}
              hint={t("admin.categories.symbolHint")}
              value={form.values.symbol}
              onChange={handleChange}
              dir="ltr"
              maxLength={20}
              autoComplete="off"
            />

            <div className="confirm-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setForm(null)} disabled={saving}>
                {t("admin.common.cancel")}
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving} aria-busy={saving}>
                {saving && <span className="spinner" aria-hidden="true" />}
                <span>{saving ? t("admin.common.saving") : t("admin.common.save")}</span>
              </button>
            </div>
          </section>
        </form>
      )}

      {/* ---------- List ---------- */}
      {state.status === "loading" && <Loader compact />}

      {state.status === "error" && (
        <div className="admin-error-box" role="alert">
          <p>{t("admin.common.loadError")}</p>
          <button type="button" className="btn btn-ghost" onClick={retry}>
            {t("admin.retry")}
          </button>
        </div>
      )}

      {state.status === "ready" && state.rows.length === 0 && !form && (
        <div className="admin-empty glass">
          <p>{t("admin.categories.empty")}</p>
          <button type="button" className="btn btn-primary" onClick={openNew}>
            {t("admin.categories.add")}
          </button>
        </div>
      )}

      {state.status === "ready" && state.rows.length > 0 && (
        <ul className="admin-list">
          {state.rows.map((row, index) => (
            <li key={row.id} className="admin-row glass">
              <div className="admin-thumb" aria-hidden="true">
                <span dir="ltr" style={{ fontSize: "1rem", fontFamily: "var(--font-mono)" }}>
                  {row.symbol}
                </span>
              </div>

              <div className="admin-row-main">
                <h2 className="admin-row-title">{nameOf(row)}</h2>
                <div className="admin-row-meta">
                  <span className="admin-slug">{row.id}</span>
                </div>
              </div>

              <div className="admin-actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => move(index, -1)}
                  disabled={busy || index === 0}
                  aria-label={t("admin.common.moveUp")}
                  title={t("admin.common.moveUp")}
                >
                  <ArrowUpIcon />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => move(index, 1)}
                  disabled={busy || index === state.rows.length - 1}
                  aria-label={t("admin.common.moveDown")}
                  title={t("admin.common.moveDown")}
                >
                  <ArrowDownIcon />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => openEdit(row)}
                  disabled={busy}
                  aria-label={t("admin.common.edit")}
                  title={t("admin.common.edit")}
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => setPendingDelete(row)}
                  disabled={busy}
                  aria-label={t("admin.common.delete")}
                  title={t("admin.common.delete")}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("admin.categories.deleteTitle")}
        confirmLabel={deleting ? t("admin.common.deleting") : t("admin.common.delete")}
        cancelLabel={t("admin.common.cancel")}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <strong>{pendingDelete ? nameOf(pendingDelete) : ""}</strong>
        {t("admin.categories.deleteText")}
      </ConfirmDialog>
    </>
  );
}