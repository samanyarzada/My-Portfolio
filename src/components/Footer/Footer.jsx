import { Link } from "react-router-dom";
import Brand from "../Brand/Brand";
import SocialLinks from "../SocialLinks/SocialLinks";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";
import "./Footer.css";

const links = [
  { to: "/", key: "nav.home" },
  { to: "/blog", key: "nav.blog" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

export default function Footer() {
  const { t, l } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>{l(profile.tagline)}</p>
        </div>

        <div>
          <h4 className="footer-title">{t("footer.explore")}</h4>
          <ul className="footer-links">
            {links.map(({ to, key }) => (
              <li key={to}>
                <Link to={to}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer-title">{t("footer.connect")}</h4>
          <SocialLinks />
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {year} {l(profile.name)}. {t("footer.rights")}
        </span>
        <span>{t("footer.builtWith")}</span>
      </div>
    </footer>
  );
}