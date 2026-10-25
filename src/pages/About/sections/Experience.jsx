import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { useProfile } from "../../../hooks/useProfile";
import { useTranslation } from "../../../hooks/useTranslation";

export default function Experience() {
  const { t, l } = useTranslation();
  const profile = useProfile();

  return (
    <section className="container about-section">
      <SectionHeader title={t("about.experienceTitle")} text={t("about.experienceText")} />

      <div className="experience-grid">
        {profile.experience.map((item, i) => (
          <article key={i} className="experience-card glass glass-hover">
            <h3>{l(item.role)}</h3>
            <p>{l(item.text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}