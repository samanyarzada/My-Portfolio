import { useEffect } from "react";
import ContactForm from "../../components/ContactForm/ContactForm";
import EmailButton from "../../components/EmailButton/EmailButton";
import SocialLinks from "../../components/SocialLinks/SocialLinks";
import { useProfile } from "../../hooks/useProfile";
import { useTranslation } from "../../hooks/useTranslation";
import "./Contact.css";

export default function Contact() {
  const { t, l } = useTranslation();
  const profile = useProfile();

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("contact.eyebrow")} | ${profile.brand}`;
    return () => {
      document.title = previous;
    };
  }, [t, profile.brand]);

  return (
    <>
      <section className="container contact-head">
        <span className="eyebrow fade-up">{t("contact.eyebrow")}</span>
        <h1 className="section-title gradient-text fade-up delay-1">{t("contact.title")}</h1>
        <p className="section-subtitle fade-up delay-2">{t("contact.subtitle")}</p>
      </section>

      <section className="container contact-grid fade-up delay-2">
        <ContactForm />

        <aside className="contact-info glass">
          <h2>{t("contact.infoTitle")}</h2>

          <EmailButton />

          <div className="info-block">
            <span className="info-label">{t("contact.location")}</span>
            <p>{l(profile.location)}</p>
          </div>

          <div className="info-block">
            <span className="info-label">{l(profile.name)}</span>
            <SocialLinks showEmail={false} />
          </div>
        </aside>
      </section>
    </>
  );
}