import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Brand from "../Brand/Brand";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { CloseIcon, MenuIcon } from "../Icons";
import { useTranslation } from "../../hooks/useTranslation";
import "./Navbar.css";

const links = [
  { to: "/", key: "nav.home", end: true },
  { to: "/blog", key: "nav.blog" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 12);

  // Stronger background after the user scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container navbar-inner">
        <Brand onClick={close} />

        <nav>
          <ul id="primary-nav" className={`nav-links ${open ? "open" : ""}`}>
            {links.map(({ to, key, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={close}
                >
                  {t(key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-actions">
          <LanguageSwitcher />
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-label={t("nav.menu")}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}