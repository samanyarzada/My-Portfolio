import { Link } from "react-router-dom";
import PostCover from "../PostCover/PostCover";
import TagBadge from "../TagBadge/TagBadge";
import { useContent } from "../../hooks/useContent";
import { useTranslation } from "../../hooks/useTranslation";
import { formatDate, formatNumber } from "../../utils/format";
import "./PostCard.css";

export default function PostCard({ post, featured = false }) {
  const { t, l, lang } = useTranslation();
  const { categoryById } = useContent();
  const category = categoryById[post.category];

  return (
    <article className={`post-card glass glass-hover ${featured ? "is-featured" : ""}`}>
      <PostCover post={post}>
        {featured && <span className="post-flag">{t("post.featured")}</span>}
      </PostCover>

      <div className="post-body">
        <div className="post-meta">
          <span className="post-category">{category ? l(category.name) : post.category}</span>
          <span className="post-dot" />
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          <span className="post-dot" />
          <span>
            {formatNumber(post.readTime, lang)} {t("post.minRead")}
          </span>
        </div>

        <h3 className="post-title">
          <Link to={`/blog/${post.slug}`}>{l(post.title)}</Link>
        </h3>

        <p className="post-excerpt">{l(post.excerpt)}</p>

        <div className="post-footer">
          <ul className="post-tags">
            {post.tags.map((tag) => (
              <li key={tag}>
                <TagBadge tag={tag} />
              </li>
            ))}
          </ul>
          <span className="post-more">
            {t("post.readMore")} <span className="arrow">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}