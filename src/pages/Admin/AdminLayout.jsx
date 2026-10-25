import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Brand from "../../components/Brand/Brand";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { useNoIndex } from "../../hooks/useNoIndex";
import { useTranslation } from "../../hooks/useTranslation";

// Pages that will be built in the next steps are listed but not clickable yet
const links = [
  { to: "/admin", key: "admin.nav.dashboard", end: true, ready: true },
  { to: "/admin/projects", key: "admin.nav.projects", ready: true },
  { to: "/admin/posts", key: "admin.nav.posts", ready: true },
  { to: "/admin/categories", key: "admin.nav.categories", ready: true },
  { to: "/admin/profile", key: "admin.nav.profile", ready: true },
];

export default function AdminLayout() {
  useNoIndex();
  const { t } = useTranslation();
  const { session, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar glass">
        <Brand />
        <span className="admin-badge">{t("admin.panel")}</span>

        <nav aria-label={t("admin.panel")}>
          <ul className="admin-nav">
            {links.map(({ to, key, end, ready }) => (
              <li key={to}>
                {ready ? (
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `admin-link ${isActive ? "active" : ""}`
                    }
                  >
                    {t(key)}
                  </NavLink>
                ) : (
                  <span className="admin-link is-soon" aria-disabled="true">
                    {t(key)}
                    <small>{t("admin.soon")}</small>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-user" dir="ltr">
            {session?.user?.email}
          </span>
          <div className="admin-topbar-actions">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link to="/" className="btn btn-ghost">
              {t("admin.viewSite")}
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {t("admin.signOut")}
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
