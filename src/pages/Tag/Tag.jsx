import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PostsListPage from "../../components/PostsListPage/PostsListPage";
import { getPostsByTag } from "../../data/posts";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";

export default function Tag() {
  // React Router already decodes the URL, so Persian tags work too
  const { name } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const previous = document.title;
    document.title = `#${name} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [name]);

  return (
    <PostsListPage
      eyebrow={t("filterPage.tagEyebrow")}
      title={`#${name}`}
      posts={getPostsByTag(name)}
      activeTag={name}
    />
  );
}