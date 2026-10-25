import { useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PostCard from "../../components/PostCard/PostCard";
import CategoryList from "../../components/CategoryList/CategoryList";
import Pagination from "../../components/Pagination/Pagination";
import Loader from "../../components/Loader/Loader";
import { CloseIcon, SearchIcon } from "../../components/Icons";
import { useContent } from "../../hooks/useContent";
import { usePagination } from "../../hooks/usePagination";
import { useTranslation } from "../../hooks/useTranslation";
import { formatNumber } from "../../utils/format";
import "./Blog.css";

const PER_PAGE = 6;

export default function Blog() {
  const { t, lang } = useTranslation();
  const { loading, categories, sortedPosts } = useContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsRef = useRef(null);

  // ----- Read state from the URL (the URL is the single source of truth) -----
  const urlQuery = searchParams.get("q") ?? "";
  const rawCategory = searchParams.get("category");
  const category = categories.some((c) => c.id === rawCategory) ? rawCategory : "all";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10) || 1;

  const counts = useMemo(
    () =>
      sortedPosts.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
      }, {}),
    [sortedPosts]
  );

  // ----- Write state to the URL -----
  const updateParams = (changes, { replace = false } = {}) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      const isEmpty =
        value === "" ||
        value == null ||
        value === "all" ||
        (key === "page" && Number(value) === 1);

      if (isEmpty) next.delete(key);
      else next.set(key, String(value));
    });

    setSearchParams(next, { replace });
  };

  // replace: typing should not fill the browser history
  const handleSearch = (value) => updateParams({ q: value, page: 1 }, { replace: true });

  const handleCategory = (id) => updateParams({ category: id, page: 1 });

  const handlePage = (page) => {
    updateParams({ page });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearAll = () => setSearchParams({});

  // ----- Filter + paginate -----
  const filtered = useMemo(() => {
    const q = urlQuery.trim().toLowerCase();

    return sortedPosts.filter((post) => {
      if (category !== "all" && post.category !== category) return false;
      if (!q) return true;

      // Search in both languages, so "react" or "ری‌اکت" both work
      const haystack = [
        post.title.en,
        post.title.fa,
        post.excerpt.en,
        post.excerpt.fa,
        ...post.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [sortedPosts, urlQuery, category]);

  const { pageItems, currentPage, totalPages, total } = usePagination(
    filtered,
    pageParam,
    PER_PAGE
  );

  if (loading) return <Loader />;

  return (
    <>
      {/* ---------- Header ---------- */}
      <section className="container blog-head">
        <span className="eyebrow fade-up">{t("blog.eyebrow")}</span>
        <h1 className="section-title gradient-text fade-up delay-1">{t("blog.title")}</h1>
        <p className="section-subtitle fade-up delay-2">{t("blog.subtitle")}</p>
      </section>

      {/* ---------- Search + filter ---------- */}
      <section className="container blog-toolbar fade-up delay-2">
        <form className="search-field" role="search" onSubmit={(e) => e.preventDefault()}>
          <SearchIcon className="search-icon" />
          <input
            className="input search-input"
            type="text"
            dir="auto"
            inputMode="search"
            autoComplete="off"
            value={urlQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("blog.searchPlaceholder")}
            aria-label={t("blog.searchLabel")}
          />
          {urlQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => handleSearch("")}
              aria-label={t("blog.clearSearch")}
            >
              <CloseIcon />
            </button>
          )}
        </form>

        <CategoryList
          categories={categories}
          counts={counts}
          total={sortedPosts.length}
          active={category}
          onSelect={handleCategory}
        />
      </section>

      {/* ---------- Results ---------- */}
      <section className="container blog-results" ref={resultsRef}>
        <p className="results-count" aria-live="polite">
          {formatNumber(total, lang)} {t("blog.articles")}
        </p>

        {pageItems.length > 0 ? (
          <>
            <div className="blog-grid">
              {pageItems.map((post, i) => (
                <div key={post.id} className="fade-up" style={{ animationDelay: `${0.07 * i}s` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={handlePage}
            />
          </>
        ) : (
          <div className="blog-empty glass">
            <SearchIcon className="empty-icon" />
            <h3>{t("blog.emptyTitle")}</h3>
            <p>{t("blog.emptyText")}</p>
            <button type="button" className="btn btn-ghost" onClick={clearAll}>
              {t("blog.clearFilters")}
            </button>
          </div>
        )}
      </section>
    </>
  );
}