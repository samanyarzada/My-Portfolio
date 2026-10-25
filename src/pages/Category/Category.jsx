import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import PostsListPage from "../../components/PostsListPage/PostsListPage";
import { SearchIcon } from "../../components/Icons";
import { useProfile } from "../../hooks/useProfile";
import { useContent } from "../../hooks/useContent";
import { useTranslation } from "../../hooks/useTranslation";
import "../PostDetail/PostDetail.css";

export default function Category() {
  const { name } = useParams();
  const { t, l } = useTranslation();
  const { loading, categoryById, sortedPosts } = useContent();
  const category = categoryById[name];
  const profile = useProfile();
  useEffect(() => {
    if (loading) return;
    const previous = document.title;
    document.title = `${category ? l(category.name) : t("filterPage.unknownCategory")} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [loading, category, l, t, profile.brand]);

  if (loading) return <Loader />;

  if (!category) {
    return (
      <section className="container section">
        <div className="detail-missing glass">
          <SearchIcon className="missing-icon" />
          <h1>{t("filterPage.unknownCategory")}</h1>
          <Link to="/blog" className="btn btn-primary">
            {t("filterPage.allArticles")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <PostsListPage
      eyebrow={t("filterPage.categoryEyebrow")}
      title={l(category.name)}
      posts={sortedPosts.filter((p) => p.category === category.id)}
      activeCategory={category.id}
    />
  );
}