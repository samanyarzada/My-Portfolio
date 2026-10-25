import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import {
  EditIcon,
  ExternalIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  TrashIcon,
} from "../../components/Icons";
import AdminThumb from "./AdminThumb";
import ConfirmDialog from "./ConfirmDialog";
import { supabase } from "../../lib/supabase";
import { removeStoredImages } from "../../lib/media";
import { useContent } from "../../hooks/useContent";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../hooks/useTranslation";
import { formatDate, formatNumber } from "../../utils/format";

// The list does not need the article text, so it is not downloaded here
const COLUMNS = "id, slug, category_id, status, featured, published_at, image, title_en, title_fa";

// RLS does not throw when it blocks a change, it just touches 0 rows. We treat that as a failure.
async function updateRow(id, changes) {
  const { data, error } = await supabase.from("posts").update(changes).eq("id", id).select("id");
  if (error || !data?.length) throw new Error("failed");
}

export default function PostsList() {
  const { t, lang } = useTranslation();
  const toast = useToast();
  const { reload } = useContent();

  const [state, setState] = useState({ status: "loading", rows: [], cats: {} });
  const [attempt, setAttempt] = useState(0);
  const [filter, setFilter] = useState("all"); // all | published | draft
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      supabase
        .from("posts")
        .select(COLUMNS)
        .order("published_at", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name_en, name_fa"),
    ])
      .then(([posts, cats]) => {
        if (cancelled) return;
        if (posts.error || cats.error) {
          setState({ status: "error", rows: [], cats: {} });
          return;
        }
        setState({
          status: "ready",
          rows: posts.data,
          cats: Object.fromEntries(cats.data.map((c) => [c.id, c])),
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", rows: [], cats: {} });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: "loading", rows: [], cats: {} });
    setAttempt((n) => n + 1);
  };

  // Makes the public site show the change right away
  const refreshSite = () => {
    reload().catch(() => {});
  };

  const titleOf = (row) => (lang === "fa" && row.title_fa ? row.title_fa : row.title_en);
  const categoryOf = (row) => {
    const cat = state.cats[row.category_id];
    if (!cat) return row.category_id;
    return lang === "fa" && cat.name_fa ? cat.name_fa : cat.name_en;
  };

  const counts = useMemo(
    () => ({
      all: state.rows.length,
      published: state.rows.filter((r) => r.status === "published").length,
      draft: state.rows.filter((r) => r.status === "draft").length,
    }),
    [state.rows]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.rows.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!q) return true;
      return [row.title_en, row.title_fa, row.slug].join(" ").toLowerCase().includes(q);
    });
  }, [state.rows, filter, query]);

  const busy = busyId !== null;

  const changeRow = async (row, changes) => {
    if (busy) return;
    setBusyId(row.id);
    try {
      await updateRow(row.id, changes);
      setState((s) => ({
        ...s,
        rows: s.rows.map((r) => (r.id === row.id ? { ...r, ...changes } : r)),
      }));
      refreshSite();
    } catch {
      toast.error(t("admin.common.noPermission"));
    } finally {
      setBusyId(null);
    }
  };

  const togglePublished = (row) =>
    changeRow(row, { status: row.status === "published" ? "draft" : "published" });

  const toggleFeatured = (row) => changeRow(row, { featured: !row.featured });

  const confirmDelete = async () => {
    const row = pendingDelete;
    if (!row) return;

    setDeleting(true);
    try {
      const { data, error } = await supabase.from("posts").delete().eq("id", row.id).select("id");
      if (error || !data?.length) throw new Error("failed");

      await removeStoredImages(row.image);
      setState((s) => ({ ...s, rows: s.rows.filter((r) => r.id !== row.id) }));
      toast.success(t("admin.posts.deleted"));
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
          <h1 className="admin-title">{t("admin.posts.title")}</h1>
          <p className="admin-lead">{t("admin.posts.lead")}</p>
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary">
          <PlusIcon className="btn-icon" /> {t("admin.posts.add")}
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
          <p>{t("admin.posts.empty")}</p>
          <Link to="/admin/posts/new" className="btn btn-primary">
            {t("admin.posts.emptyAction")}
          </Link>
        </div>
      )}

      {state.status === "ready" && state.rows.length > 0 && (
        <>
          <div className="admin-toolbar">
            <div className="admin-tabs" role="group" aria-label={t("admin.posts.filterLabel")}>
              {["all", "published", "draft"].map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`admin-tab ${filter === name ? "active" : ""}`}
                  aria-pressed={filter === name}
                  onClick={() => setFilter(name)}
                >
                  {t(`admin.posts.filters.${name}`)}
                  <span className="admin-tab-count">{formatNumber(counts[name], lang)}</span>
                </button>
              ))}
            </div>

            <div className="admin-search">
              <SearchIcon className="admin-search-icon" />
              <input
                className="input"
                type="search"
                dir="auto"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("admin.posts.searchPlaceholder")}
                aria-label={t("admin.posts.searchLabel")}
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="admin-empty glass">
              <p>{t("admin.posts.noResults")}</p>
            </div>
          ) : (
            <ul className="admin-list">
              {visible.map((row) => {
                const title = titleOf(row);
                const published = row.status === "published";

                return (
                  <li key={row.id} className={`admin-row glass ${published ? "" : "is-hidden"}`}>
                    <AdminThumb key={row.image} src={row.image} name={title} />

                    <div className="admin-row-main">
                      <h2 className="admin-row-title">{title}</h2>
                      <div className="admin-row-meta">
                        <span className={`status-badge ${published ? "on" : "draft"}`}>
                          {published ? t("admin.posts.published") : t("admin.posts.draft")}
                        </span>
                        {row.featured && (
                          <span className="status-badge featured">{t("admin.posts.featured")}</span>
                        )}
                        <span>{categoryOf(row)}</span>
                        <time dateTime={row.published_at}>{formatDate(row.published_at, lang)}</time>
                        <span className="admin-slug">{row.slug}</span>
                      </div>
                    </div>

                    <div className="admin-actions">
                      <button
                        type="button"
                        className={`icon-btn ${row.featured ? "is-on" : ""}`}
                        onClick={() => toggleFeatured(row)}
                        disabled={busy}
                        aria-pressed={row.featured}
                        aria-label={row.featured ? t("admin.posts.unfeature") : t("admin.posts.feature")}
                        title={row.featured ? t("admin.posts.unfeature") : t("admin.posts.feature")}
                      >
                        <StarIcon filled={row.featured} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => togglePublished(row)}
                        disabled={busy}
                        aria-label={published ? t("admin.posts.unpublish") : t("admin.posts.publish")}
                        title={published ? t("admin.posts.unpublish") : t("admin.posts.publish")}
                      >
                        {published ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                      {published && (
                        <a
                          className="icon-btn"
                          href={`/blog/${row.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t("admin.posts.viewOnSite")}
                          title={t("admin.posts.viewOnSite")}
                        >
                          <ExternalIcon />
                        </a>
                      )}
                      <Link
                        to={`/admin/posts/${row.id}/edit`}
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
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("admin.posts.deleteTitle")}
        confirmLabel={deleting ? t("admin.common.deleting") : t("admin.common.delete")}
        cancelLabel={t("admin.common.cancel")}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <strong>{pendingDelete ? titleOf(pendingDelete) : ""}</strong>
        {t("admin.posts.deleteText")}
      </ConfirmDialog>
    </>
  );
}