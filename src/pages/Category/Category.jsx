import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PostsListPage from "../../components/PostsListPage/PostsListPage";
import { SearchIcon } from "../../components/Icons";
import { getCategoryById, getPostsByCategory } from "../../data/posts";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";
import "../PostDetail/PostDetail.css";

export default function Category() {
  const { name } = useParams();
  const { t, l } = useTranslation();
  const category = getCategoryById(name);

  useEffect(() => {
    const previous = document.title;
    document.title = `${category ? l(category.name) : t("filterPage.unknownCategory")} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [category, l, t]);

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
      posts={getPostsByCategory(category.id)}
      activeCategory={category.id}
    />
  );
}
