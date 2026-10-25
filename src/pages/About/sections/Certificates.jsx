import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { useProfile } from "../../../hooks/useProfile";
import { useTranslation } from "../../../hooks/useTranslation";

export default function Certificates() {
  const { t } = useTranslation();
  const profile = useProfile();

  return (
    <section className="container about-section">
      <SectionHeader title={t("about.certificatesTitle")} text={t("about.certificatesText")} />

      <div className="certificates-grid">
        {profile.certificates.map((cert) => (
          <article key={cert.title} className="certificate-card neon-border">
            <span className="certificate-issuer">{cert.issuer}</span>
            <h3>{cert.title}</h3>
            {cert.url && (
              <a className="link-arrow" href={cert.url} target="_blank" rel="noopener noreferrer">
                {t("about.viewCertificate")} <span className="arrow">→</span>
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}