import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useTranslation } from "../../hooks/useTranslation";
import { formatNumber } from "../../utils/format";

const head = { count: "exact", head: true };

export default function Dashboard() {
  const { t, lang } = useTranslation();
  const [state, setState] = useState({ status: "loading", counts: null });

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      supabase.from("projects").select("*", head),
      supabase.from("projects").select("*", head).eq("published", false),
      supabase.from("posts").select("*", head),
      supabase.from("posts").select("*", head).eq("status", "draft"),
      supabase.from("categories").select("*", head),
    ])
      .then((results) => {
        if (cancelled) return;
        if (results.some((r) => r.error)) {
          setState({ status: "error", counts: null });
          return;
        }
        setState({
          status: "ready",
          counts: {
            projects: results[0].count,
            hiddenProjects: results[1].count,
            posts: results[2].count,
            draftPosts: results[3].count,
            categories: results[4].count,
          },
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", counts: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const { status, counts } = state;

  const cards = counts && [
    { label: t("admin.stats.projects"), value: counts.projects, note: `${formatNumber(counts.hiddenProjects, lang)} ${t("admin.stats.hidden")}` },
    { label: t("admin.stats.posts"), value: counts.posts, note: `${formatNumber(counts.draftPosts, lang)} ${t("admin.stats.drafts")}` },
    { label: t("admin.stats.categories"), value: counts.categories, note: "" },
  ];

  return (
    <>
      <h1 className="admin-title">{t("admin.dashboardTitle")}</h1>
      <p className="admin-lead">{t("admin.dashboardText")}</p>

      {status === "loading" && (
        <p className="admin-muted" role="status">
          {t("loader.loading")}
        </p>
      )}

      {status === "error" && (
        <div className="admin-error-box" role="alert">
          <p>{t("admin.loadError")}</p>
          <button type="button" className="btn btn-ghost" onClick={() => window.location.reload()}>
            {t("admin.retry")}
          </button>
        </div>
      )}

      {status === "ready" && (
        <div className="admin-stats">
          {cards.map((card) => (
            <article key={card.label} className="stat-card glass">
              <span className="stat-label">{card.label}</span>
              <strong className="stat-value">{formatNumber(card.value, lang)}</strong>
              {card.note && <span className="stat-note">{card.note}</span>}
            </article>
          ))}
        </div>
      )}
    </>
  );
}