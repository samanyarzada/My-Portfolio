import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import PostsListPage from "../../components/PostsListPage/PostsListPage";
import { useProfile } from "../../hooks/useProfile";import { useContent } from "../../hooks/useContent";
import { useTranslation } from "../../hooks/useTranslation";

export default function Tag() {
  // React Router already decodes the URL, so Persian tags work too
  const { name } = useParams();
  const profile = useProfile(); 
  const { t } = useTranslation();
  const { loading, sortedPosts } = useContent();

  useEffect(() => {
    const previous = document.title;
    document.title = `#${name} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [name, profile.brand]);

  if (loading) return <Loader />;

  return (
    <PostsListPage
      eyebrow={t("filterPage.tagEyebrow")}
      title={`#${name}`}
      posts={sortedPosts.filter((p) => p.tags.includes(name))}
      activeTag={name}
    />
  );
}