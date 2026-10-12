import { useEffect } from "react";
import EmailButton from "../../components/EmailButton/EmailButton";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import SkillCard from "../../components/SkillCard/SkillCard";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";
import "./Skills.css";

// Display order of the groups
const GROUPS = ["frontend", "tools", "languages"];

export default function Skills() {
  const { t, l } = useTranslation();

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("skills.eyebrow")} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [t]);

  const learning = profile.skills.filter((s) => s.level === "learning");

  return (
    <>
      {/* ---------- Header ---------- */}
      <section className="container skills-head">
        <span className="eyebrow fade-up">{t("skills.eyebrow")}</span>
        <h1 className="section-title gradient-text fade-up delay-1">{t("skills.title")}</h1>
        <p className="section-subtitle fade-up delay-2">{t("skills.subtitle")}</p>
      </section>

      {/* ---------- Skill groups ---------- */}
      {GROUPS.map((group) => {
        const items = profile.skills.filter((s) => s.group === group);
        if (items.length === 0) return null;

        return (
          <section key={group} className="container skills-group">
            <h2 className="group-title">{t(`skills.groups.${group}`)}</h2>
            <div className="skills-grid">
              {items.map((skill, i) => (
                <div key={skill.name} className="fade-up" style={{ animationDelay: `${0.07 * i}s` }}>
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* ---------- Currently learning ---------- */}
      {learning.length > 0 && (
        <section className="container skills-block">
          <SectionHeader title={t("skills.learningTitle")} text={t("skills.learningText")} />
          <ul className="learning-list">
            {learning.map((skill) => (
              <li key={skill.name} className="learning-chip">
                <span className="learning-dot" aria-hidden="true" />
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- React concepts ---------- */}
      <section className="container skills-block">
        <SectionHeader title={t("skills.conceptsTitle")} text={t("skills.conceptsText")} />
        <div className="concepts-grid">
          {profile.reactConcepts.map((concept) => (
            <article key={concept.name} className="concept-card glass">
              <h3 className="concept-name">{concept.name}</h3>
              <p>{l(concept.text)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container skills-block">
        <div className="skills-cta neon-border">
          <h2>{t("skills.ctaTitle")}</h2>
          <p>{t("skills.ctaText")}</p>
          <EmailButton />
        </div>
      </section>
    </>
  );
}