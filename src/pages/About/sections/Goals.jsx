import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { useProfile } from "../../../hooks/useProfile";
import { useTranslation } from "../../../hooks/useTranslation";

export default function Goals() {
  const { t, l } = useTranslation();
  const profile = useProfile();

  return (
    <section className="container about-section">
      <SectionHeader title={t("about.goalsTitle")} text={t("about.goalsText")} />

      <div className="goals-grid">
        {profile.goals.map((goal, i) => (
          <article key={i} className="goal-card glass glass-hover">
            <span className="goal-bar" aria-hidden="true" />
            <h3>{l(goal.title)}</h3>
            <p>{l(goal.text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}