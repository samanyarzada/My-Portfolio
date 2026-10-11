import { useTranslation } from "../../hooks/useTranslation";
import { formatNumber } from "../../utils/format";
import "./CategoryList.css";

export default function CategoryList({ categories, counts, total, active, onSelect }) {
  const { t, l, lang } = useTranslation();

  const items = [
    { id: "all", label: t("blog.all"), count: total },
    ...categories.map((c) => ({ id: c.id, label: l(c.name), count: counts[c.id] ?? 0 })),
  ];

  return (
    <div className="category-list" role="group" aria-label={t("blog.filterLabel")}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`category-chip ${active === item.id ? "active" : ""}`}
          aria-pressed={active === item.id}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
          <span className="category-count">{formatNumber(item.count, lang)}</span>
        </button>
      ))}
    </div>
  );
}