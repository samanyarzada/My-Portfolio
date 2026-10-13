import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthorBox from "../../components/AuthorBox/AuthorBox";
import PostCard from "../../components/PostCard/PostCard";
import ReadingProgress from "../../components/ReadingProgress/ReadingProgress";
import TagBadge from "../../components/TagBadge/TagBadge";
import { CheckIcon, LinkIcon, SearchIcon } from "../../components/Icons";
import { getCategoryById, getPostBySlug, posts } from "../../data/posts";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";
import { formatDate, formatNumber } from "../../utils/format";
import PostCover from "../../components/PostCover/PostCover";
import "./PostDetail.css";

// Newest first
const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

function getRelated(post, limit = 3) {
  return sorted
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      post: p,
      score:
        (p.category === post.category ? 2 : 0) +
        p.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score) // stable sort keeps "newest first" for equal scores
    .slice(0, limit)
    .map((item) => item.post);
}

export default function PostDetail() {
  const { slug } = useParams();
  const { t, l, lang } = useTranslation();
  const articleRef = useRef(null);
   // Stores the slug that was copied, so it resets by itself when the article changes
  const [copiedSlug, setCopiedSlug] = useState(null);
  const copied = copiedSlug === slug;

  const post = getPostBySlug(slug);

  // Page title in the browser tab
  useEffect(() => {
    const previous = document.title;
    document.title = post
      ? `${l(post.title)} | ${profile.brand}`
      : `${t("postDetail.notFoundTitle")} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [post, l, t]);



  const related = useMemo(() => (post ? getRelated(post) : []), [post]);

  const { newer, older } = useMemo(() => {
    if (!post) return {};
    const i = sorted.findIndex((p) => p.id === post.id);
    return { newer: sorted[i - 1], older: sorted[i + 1] };
  }, [post]);

   const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      // Clipboard can be blocked (for example on non-HTTPS pages), so we do nothing
    }
  };

  // ----- Article not found -----
  if (!post) {
    return (
      <section className="container section">
        <div className="detail-missing glass">
          <SearchIcon className="missing-icon" />
          <h1>{t("postDetail.notFoundTitle")}</h1>
          <p>{t("postDetail.notFoundText")}</p>
          <Link to="/blog" className="btn btn-primary">
            {t("postDetail.back")}
          </Link>
        </div>
      </section>
    );
  }

  const category = getCategoryById(post.category);
  const paragraphs = post.content[lang] ?? post.content.en;

  return (
    <>
      <ReadingProgress targetRef={articleRef} />

      <article ref={articleRef}>
        {/* ---------- Header ---------- */}
        <header className="container-narrow detail-head">
          <Link to="/blog" className="detail-back link-arrow">
            <span className="arrow back-arrow">→</span> {t("postDetail.back")}
          </Link>

          <div className="detail-meta fade-up">
            <Link to={`/blog?category=${post.category}`} className="detail-category">
              {l(category.name)}
            </Link>
            <span className="post-dot" />
            <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
            <span className="post-dot" />
            <span>
              {formatNumber(post.readTime, lang)} {t("post.minRead")}
            </span>
          </div>

          <h1 className="detail-title fade-up delay-1">{l(post.title)}</h1>
          <p className="detail-excerpt fade-up delay-2">{l(post.excerpt)}</p>

          <div className="detail-author fade-up delay-2">
            <span>
              {t("postDetail.by")} <strong>{l(profile.name)}</strong>
            </span>
          </div>
        </header>

        {/* ---------- Cover ---------- */}
          <div className="container detail-cover-wrap fade-up delay-3">
          <PostCover post={post} alt={l(post.title)} className="detail-cover" />
        </div>

        {/* ---------- Body ---------- */}
        <div className="container-narrow article-body">
          {paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        {/* ---------- Tags + share ---------- */}
        <div className="container-narrow detail-actions">
          <ul className="post-tags">
            {post.tags.map((tag) => (
              <li key={tag}>
                <TagBadge tag={tag} />
              </li>
            ))}
          </ul>

          <button type="button" className="btn btn-ghost copy-btn" onClick={copyLink}>
            {copied ? <CheckIcon /> : <LinkIcon />}
            <span aria-live="polite">
              {copied ? t("postDetail.copied") : t("postDetail.copyLink")}
            </span>
          </button>
        </div>
      </article>

      {/* ---------- Author ---------- */}
      <div className="container-narrow detail-author-box">
        <AuthorBox />
      </div>

      {/* ---------- Newer / older ---------- */}
      <nav className="container-narrow post-nav" aria-label="Article navigation">
        {newer ? (
          <Link to={`/blog/${newer.slug}`} className="post-nav-item glass glass-hover">
            <span className="post-nav-label">
              <span className="arrow back-arrow">→</span> {t("postDetail.newer")}
            </span>
            <strong>{l(newer.title)}</strong>
          </Link>
        ) : (
          <span />
        )}

        {older ? (
          <Link to={`/blog/${older.slug}`} className="post-nav-item glass glass-hover is-older">
            <span className="post-nav-label">
              {t("postDetail.older")} <span className="arrow">→</span>
            </span>
            <strong>{l(older.title)}</strong>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="container detail-related">
          <h2 className="section-title">{t("postDetail.related")}</h2>
          <div className="related-grid">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}