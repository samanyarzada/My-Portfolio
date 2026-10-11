import { Link } from "react-router-dom";
import PostCard from "../PostCard/PostCard";
import TagBadge from "../TagBadge/TagBadge";
import { SearchIcon } from "../Icons";
import { categories, getAllTags } from "../../data/posts";
import { useTranslation } from "../../hooks/useTranslation";
import { formatNumber } from "../../utils/format";
import "../CategoryList/CategoryList.css";
import "./PostsListPage.css";

const allTags = getAllTags();

export default function PostsListPage({ eyebrow, title, posts, activeCategory, activeTag }) {
  const { t, l, lang } = useTranslation();

  // Newest first
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section className="container list-head">
        <Link to="/blog" className="link-arrow list-back">
          <span className="arrow back-arrow">→</span> {t("filterPage.allArticles")}
        </Link>
        <span className="eyebrow fade-up">{eyebrow}</span>
        <h1 className="section-title gradient-text fade-up delay-1">{title}</h1>
        <p className="list-count fade-up delay-2">
          {formatNumber(sorted.length, lang)} {t("blog.articles")}
        </p>
      </section>

      <section className="container">
        {sorted.length > 0 ? (
          <div className="list-grid">
            {sorted.map((post, i) => (
              <div key={post.id} className="fade-up" style={{ animationDelay: `${0.07 * i}s` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="list-empty glass">
            <SearchIcon className="empty-icon" />
            <h3>{t("filterPage.emptyTitle")}</h3>
            <p>{t("filterPage.emptyText")}</p>
            <Link to="/blog" className="btn btn-ghost">
              {t("filterPage.allArticles")}
            </Link>
          </div>
        )}
      </section>

      <section className="container list-more">
        <div className="more-block">
          <h2>{t("filterPage.otherCategories")}</h2>
          <div className="more-chips">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className={`category-chip ${activeCategory === c.id ? "active" : ""}`}
              >
                {l(c.name)}
              </Link>
            ))}
          </div>
        </div>

        <div className="more-block">
          <h2>{t("filterPage.popularTags")}</h2>
          <ul className="more-chips">
            {allTags.map((tag) => (
              <li key={tag} className={activeTag === tag ? "tag-active" : ""}>
                <TagBadge tag={tag} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}