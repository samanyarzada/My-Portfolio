import { useEffect, useState } from "react";
import EmailButton from "../../components/EmailButton/EmailButton";
import SocialLinks from "../../components/SocialLinks/SocialLinks";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";
import profileImg from "../../assets/images/profile.png";
import Journey from "./sections/Journey";
import Goals from "./sections/Goals";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Certificates from "./sections/Certificates";
import "./About.css";

export default function About() {
  const { t, l } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("about.eyebrow")} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [t]);

  return (
    <>
      {/* ---------- Header + intro ---------- */}
      <section className="container about-head">
        <span className="eyebrow fade-up">{t("about.eyebrow")}</span>
        <h1 className="section-title gradient-text fade-up delay-1">{t("about.title")}</h1>
        <p className="section-subtitle fade-up delay-2">{t("about.subtitle")}</p>
      </section>

      <section className="container about-intro fade-up delay-2">
        <div className="about-photo">
          <div className="about-photo-frame">
            {imgFailed ? (
              <div className="about-photo-fallback">SY</div>
            ) : (
              <img
                src={profileImg}
                alt={l(profile.name)}
                width="320"
                height="320"
                onError={() => setImgFailed(true)}
              />
            )}
          </div>
        </div>

        <div className="about-bio glass">
          <h2>{l(profile.name)}</h2>
          <span className="about-role">{l(profile.title)}</span>
          <p>{l(profile.bio)}</p>

          <dl className="facts">
            <div>
              <dt>{t("about.location")}</dt>
              <dd>{l(profile.location)}</dd>
            </div>
            <div>
              <dt>{t("about.studying")}</dt>
              <dd>{l(profile.education)}</dd>
            </div>
            <div>
              <dt>{t("about.languages")}</dt>
              <dd>{l(profile.languages).join(" · ")}</dd>
            </div>
          </dl>

          <SocialLinks />
        </div>
      </section>

      <Journey />
      <Goals />
      <Education />
      <Experience />
      <Certificates />

      {/* ---------- CTA ---------- */}
      <section className="container about-section">
        <div className="about-cta neon-border">
          <h2>{t("about.ctaTitle")}</h2>
          <p>{t("about.ctaText")}</p>
          <EmailButton />
        </div>
      </section>
    </>
  );
}