import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "../../hooks/useTranslation";
import { Link } from "react-router-dom";

// Guards every admin page. Only a signed-in admin sees the content.
export default function RequireAdmin() {
  const { status, session, isAdmin, signOut } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  if (status === "loading") return <Loader />;

  if (status === "disabled") {
    return (
      <section className="admin-center">
        <div className="admin-card glass">
          <h1>{t("admin.disabledTitle")}</h1>
          <p>{t("admin.disabledText")}</p>
          <Link to="/" className="btn btn-ghost">
            {t("admin.viewSite")}
          </Link>
        </div>
      </section>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <section className="admin-center">
        <div className="admin-card glass" role="alert">
          <h1>{t("admin.noAccessTitle")}</h1>
          <p>{t("admin.noAccessText")}</p>
          <button type="button" className="btn btn-primary" onClick={signOut}>
            {t("admin.signOut")}
          </button>
        </div>
      </section>
    );
  }

  return <Outlet />;
}