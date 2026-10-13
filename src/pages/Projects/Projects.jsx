import { useEffect } from "react";
import EmailButton from "../../components/EmailButton/EmailButton";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { projects } from "../../data/projects";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";
import { formatNumber } from "../../utils/format";
import "./Projects.css";

export default function Projects() {
  const { t, lang } = useTranslation();

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("projects.eyebrow")} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [t]);

  return (
    <>
      <section className="container projects-head">
        <span className="eyebrow fade-up">{t("projects.eyebrow")}</span>
        <h1 className="section-title gradient-text fade-up delay-1">{t("projects.title")}</h1>
        <p className="section-subtitle fade-up delay-2">{t("projects.subtitle")}</p>
        <p className="projects-count fade-up delay-2">
          {formatNumber(projects.length, lang)} {t("projects.count")}
        </p>
      </section>

      <section className="container projects-grid">
        {projects.map((project, i) => (
          <div key={project.id} className="fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
            <ProjectCard project={project} />
          </div>
        ))}
      </section>

      <section className="container projects-cta-wrap">
        <div className="projects-cta neon-border">
          <h2>{t("projects.ctaTitle")}</h2>
          <p>{t("projects.ctaText")}</p>
          <EmailButton />
        </div>
      </section>
    </>
  );
}