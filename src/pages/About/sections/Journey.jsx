import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { useProfile } from "../../../hooks/useProfile";
import { useTranslation } from "../../../hooks/useTranslation";
import { formatNumber } from "../../../utils/format";

export default function Journey() {
  const { t, l, lang } = useTranslation();
  const profile = useProfile();

  return (
    <section className="container about-section">
      <SectionHeader title={t("about.journeyTitle")} text={t("about.journeyText")} />

      <ol className="timeline">
        {profile.journey.map((step, i) => (
          <li key={i} className="timeline-item fade-up" style={{ animationDelay: `${0.08 * i}s` }}>
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-card glass glass-hover">
              <span className="timeline-step">{formatNumber(i + 1, lang)}</span>
              <h3>{l(step.title)}</h3>
              <p>{l(step.text)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}