import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EditIcon,
  ExternalIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  TrashIcon,
} from "../../components/Icons";
import AdminThumb from "./AdminThumb";
import ConfirmDialog from "./ConfirmDialog";
import { supabase } from "../../lib/supabase";
import { removeStoredImages } from "../../lib/media";
import { useContent } from "../../hooks/useContent";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../hooks/useTranslation";

// RLS does not throw when it blocks a change, it just touches 0 rows. We treat that as a failure.
async function updateRow(id, changes) {
  const { data, error } = await supabase.from("projects").update(changes).eq("id", id).select("id");
  if (error || !data?.length) throw new Error("failed");
}

export default function ProjectsList() {
  const { t, lang } = useTranslation();
  const toast = useToast();
  const { reload } = useContent();

  const [state, setState] = useState({ status: "loading", rows: [] });
  const [attempt, setAttempt] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .order("created_at")
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

  // Makes the public site show the change right away
  const refreshSite = () => {
    reload().catch(() => {});
  };

  const titleOf = (row) => (lang === "fa" && row.title_fa ? row.title_fa : row.title_en);
  const busy = busyId !== null;

  const move = async (index, direction) => {
    const target = index + direction;
    const { rows } = state;
    if (busy || target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    const ordered = next.map((row, i) => ({ ...row, sort_order: i }));
    const changed = ordered.filter((row) => rows.find((r) => r.id === row.id).sort_order !== row.sort_order);

    setBusyId("order");
    try {
      await Promise.all(changed.map((row) => updateRow(row.id, { sort_order: row.sort_order })));
      setState({ status: "ready", rows: ordered });
      refreshSite();
    } catch {
      toast.error(t("admin.common.noPermission"));
    } finally {
      setBusyId(null);
    }
  };

  const togglePublished = async (row) => {
    if (busy) return;
    setBusyId(row.id);
    try {
      await updateRow(row.id, { published: !row.published });
      setState((s) => ({
        ...s,
        rows: s.rows.map((r) => (r.id === row.id ? { ...r, published: !row.published } : r)),
      }));
      refreshSite();
    } catch {
      toast.error(t("admin.common.noPermission"));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    const row = pendingDelete;
    if (!row) return;

    setDeleting(true);
    try {
      const { data, error } = await supabase.from("projects").delete().eq("id", row.id).select("id");
      if (error || !data?.length) throw new Error("failed");

      await removeStoredImages(row.image);
      setState((s) => ({ ...s, rows: s.rows.filter((r) => r.id !== row.id) }));
      toast.success(t("admin.projects.deleted"));
      refreshSite();
    } catch {
      toast.error(t("admin.common.noPermission"));
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{t("admin.projects.title")}</h1>
          <p className="admin-lead">{t("admin.projects.lead")}</p>
        </div>
        <Link to="/admin/projects/new" className="btn btn-primary">
          <PlusIcon className="btn-icon" /> {t("admin.projects.add")}
        </Link>
      </div>

      {state.status === "loading" && <Loader compact />}

      {state.status === "error" && (
        <div className="admin-error-box" role="alert">
          <p>{t("admin.common.loadError")}</p>
          <button type="button" className="btn btn-ghost" onClick={retry}>
            {t("admin.retry")}
          </button>
        </div>
      )}

      {state.status === "ready" && state.rows.length === 0 && (
        <div className="admin-empty glass">
          <p>{t("admin.projects.empty")}</p>
          <Link to="/admin/projects/new" className="btn btn-primary">
            {t("admin.projects.emptyAction")}
          </Link>
        </div>
      )}

      {state.status === "ready" && state.rows.length > 0 && (
        <ul className="admin-list">
          {state.rows.map((row, index) => {
            const title = titleOf(row);
            return (
              <li key={row.id} className={`admin-row glass ${row.published ? "" : "is-hidden"}`}>
                <AdminThumb key={row.image} src={row.image} name={title} />

                <div className="admin-row-main">
                  <h2 className="admin-row-title">{title}</h2>
                  <div className="admin-row-meta">
                    <span className={`status-badge ${row.published ? "on" : "off"}`}>
                      {row.published ? t("admin.projects.visible") : t("admin.projects.hidden")}
                    </span>
                    <span className="admin-slug">{row.slug}</span>
                    {row.tech.length > 0 && <span dir="ltr">{row.tech.join(" · ")}</span>}
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
                    onClick={() => togglePublished(row)}
                    disabled={busy}
                    aria-label={row.published ? t("admin.projects.hide") : t("admin.projects.show")}
                    title={row.published ? t("admin.projects.hide") : t("admin.projects.show")}
                  >
                    {row.published ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                  {row.live_url && (
                    <a
                      className="icon-btn"
                      href={row.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("admin.projects.viewLive")}
                      title={t("admin.projects.viewLive")}
                    >
                      <ExternalIcon />
                    </a>
                  )}
                  <Link
                    to={`/admin/projects/${row.id}/edit`}
                    className="icon-btn"
                    aria-label={t("admin.common.edit")}
                    title={t("admin.common.edit")}
                  >
                    <EditIcon />
                  </Link>
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
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("admin.projects.deleteTitle")}
        confirmLabel={deleting ? t("admin.common.deleting") : t("admin.common.delete")}
        cancelLabel={t("admin.common.cancel")}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <strong>{pendingDelete ? titleOf(pendingDelete) : ""}</strong>
        {t("admin.projects.deleteText")}
      </ConfirmDialog>
    </>
  );
}