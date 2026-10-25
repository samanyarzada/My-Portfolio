import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import Loader from "../../components/Loader/Loader";
import { profile } from "../../data/profile";
import { useAuth } from "../../hooks/useAuth";
import { useNoIndex } from "../../hooks/useNoIndex";
import { useTranslation } from "../../hooks/useTranslation";

export default function Login() {
  useNoIndex();
  const { t } = useTranslation();
  const { status, session, signIn } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // "" | "empty" | "invalid" | "network"
  const [busy, setBusy] = useState(false);

  if (status === "loading") return <Loader />;

  // Already signed in: go where the user wanted to go
  if (session) {
    const from = location.state?.from;
    return <Navigate to={from && from.startsWith("/admin") ? from : "/admin"} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    if (!email.trim() || !password) {
      setError("empty");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const { error: signInError } = await signIn(email.trim(), password);
      if (signInError) {
        // Network problems are not a wrong password, so we say it differently
        setError(signInError.status === 400 ? "invalid" : "network");
      }
    } catch {
      setError("network");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-center">
      <div className="admin-login-tools">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <form className="admin-card glass" onSubmit={handleSubmit} noValidate>
        <span className="admin-badge">{profile.brand}</span>
        <h1>{t("admin.loginTitle")}</h1>
        <p>{t("admin.loginText")}</p>

        <div className="field">
          <label className="field-label" htmlFor="admin-email">
            {t("admin.email")}
          </label>
          <input
            id="admin-email"
            className="input field-control"
            type="email"
            dir="ltr"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "admin-login-error" : undefined}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="admin-password">
            {t("admin.password")}
          </label>
          <input
            id="admin-password"
            className="input field-control"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "admin-login-error" : undefined}
          />
        </div>

        {error && (
          <p id="admin-login-error" className="admin-error" role="alert">
            {t(`admin.errors.${error}`)}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={busy} aria-busy={busy}>
          {busy && <span className="spinner" aria-hidden="true" />}
          <span>{busy ? t("admin.signingIn") : t("admin.signIn")}</span>
        </button>

        <Link to="/" className="admin-back-link">
          {t("admin.viewSite")}
        </Link>
      </form>
    </section>
  );
}