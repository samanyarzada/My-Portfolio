import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { useProfile } from "../../../hooks/useProfile";
import { useTranslation } from "../../../hooks/useTranslation";

export default function Education() {
  const { t, l } = useTranslation();
  const profile = useProfile();

  return (
    <section className="container about-section">
      <SectionHeader title={t("about.educationTitle")} />

      <div className="education-card glass">
        <h3>{l(profile.education)}</h3>
        <ul className="check-list">
          {l(profile.achievements).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}