import { Link, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import Blog from "./pages/Blog/Blog";
import { useTranslation } from "./hooks/useTranslation";
import PostDetail from "./pages/PostDetail/PostDetail";
import Category from "./pages/Category/Category";
import Tag from "./pages/Tag/Tag";

function Placeholder({ title }) {
  return (
    <section className="container section">
      <h1 className="section-title gradient-text">{title}</h1>
      <p className="section-subtitle">
        This page will be built in the next steps.
      </p>
    </section>
  );
}

function NotFoundPlaceholder() {
  const { t } = useTranslation();
  return (
    <section className="container section">
      <h1 className="section-title gradient-text">404</h1>
      <p className="section-subtitle">{t("notFound.text")}</p>
      <Link
        to="/"
        className="btn btn-ghost"
        style={{ marginBlockStart: "1.5rem" }}
      >
        {t("notFound.back")}
      </Link>
    </section>
  );
}

export default function App() {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<PostDetail />} />
        <Route path="blog/:slug" element={<PostDetail />} />
        <Route path="category/:name" element={<Category />} />
        <Route path="tag/:name" element={<Tag />} />
        <Route path="about" element={<Placeholder title={t("nav.about")} />} />
        <Route
          path="contact"
          element={<Placeholder title={t("nav.contact")} />}
        />
        <Route path="*" element={<NotFoundPlaceholder />} />
      </Route>
    </Routes>
  );
}
