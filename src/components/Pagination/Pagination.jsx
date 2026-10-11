import { ChevronIcon } from "../Icons";
import { useTranslation } from "../../hooks/useTranslation";
import { formatNumber } from "../../utils/format";
import "./Pagination.css";

// [1, "…", 4, 5, 6, "…", 12]
function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

export default function Pagination({ currentPage, totalPages, onChange }) {
  const { t, lang } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label={t("blog.pageLabel")}>
      <button
        type="button"
        className="page-btn prev"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        aria-label={t("blog.prev")}
      >
        <ChevronIcon className="chev" />
      </button>

      {getPages(currentPage, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="page-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`page-btn ${p === currentPage ? "active" : ""}`}
            aria-current={p === currentPage ? "page" : undefined}
            aria-label={`${t("blog.page")} ${formatNumber(p, lang)}`}
            onClick={() => onChange(p)}
          >
            {formatNumber(p, lang)}
          </button>
        )
      )}

      <button
        type="button"
        className="page-btn next"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        aria-label={t("blog.next")}
      >
        <ChevronIcon className="chev" />
      </button>
    </nav>
  );
}