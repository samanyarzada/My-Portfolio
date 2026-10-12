import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import Blog from "./pages/Blog/Blog";
import PostDetail from "./pages/PostDetail/PostDetail";
import Category from "./pages/Category/Category";
import Tag from "./pages/Tag/Tag";
import About from "./pages/About/About";
import Skills from "./pages/Skills/Skills";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";
import { useTranslation } from "./hooks/useTranslation";

// Temporary page. It will be replaced by the real Projects page in the next step.
function ProjectsPlaceholder() {
  const { t } = useTranslation();
  return (
    <section className="container section">
      <h1 className="section-title gradient-text">{t("nav.projects")}</h1>
      <p className="section-subtitle">Coming soon.</p>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<ProjectsPlaceholder />} />
        <Route path="skills" element={<Skills />} />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<PostDetail />} />
        <Route path="category/:name" element={<Category />} />
        <Route path="tag/:name" element={<Tag />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}