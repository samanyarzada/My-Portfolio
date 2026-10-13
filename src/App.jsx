import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";

const Projects = lazy(() => import("./pages/Projects/Projects"));
const Skills = lazy(() => import("./pages/Skills/Skills"));
const About = lazy(() => import("./pages/About/About"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const PostDetail = lazy(() => import("./pages/PostDetail/PostDetail"));
const Category = lazy(() => import("./pages/Category/Category"));
const Tag = lazy(() => import("./pages/Tag/Tag"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
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