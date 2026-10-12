import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";
import "./NotFound.css";

export default function NotFound() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const previous = document.title;
    document.title = `404 | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <section className="container notfound">
      <p className="notfound-code gradient-text" aria-hidden="true">
        404
      </p>
      <h1>{t("notFound.title")}</h1>
      <p className="notfound-text">{t("notFound.text")}</p>
      <code className="notfound-path">{pathname}</code>

      <div className="notfound-actions">
        <Link to="/" className="btn btn-primary">
          {t("notFound.back")}
        </Link>
        <Link to="/blog" className="btn btn-ghost">
          {t("notFound.blog")}
        </Link>
      </div>
    </section>
  );
}