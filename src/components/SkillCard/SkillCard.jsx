import { useTranslation } from "../../hooks/useTranslation";
import "./SkillCard.css";

const LEVEL_STEPS = { learning: 1, comfortable: 2, confident: 3 };

export default function SkillCard({ skill }) {
  const { t, l } = useTranslation();
  const steps = LEVEL_STEPS[skill.level] ?? 1;

  return (
    <article className="skill-card glass glass-hover">
      <div className="skill-top">
        <h3 className="skill-name">{skill.name}</h3>
        <span className={`skill-level level-${skill.level}`}>
          {t(`skills.levels.${skill.level}`)}
        </span>
      </div>

      <p className="skill-desc">{l(skill.description)}</p>

      <div className="skill-meter" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`meter-bar ${n <= steps ? "on" : ""}`} />
        ))}
      </div>
    </article>
  );
}