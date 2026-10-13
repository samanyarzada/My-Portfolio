import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
import Loader from "../components/Loader/Loader";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { useTranslation } from "../hooks/useTranslation";
import "./MainLayout.css";

export default function MainLayout() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t("nav.skip")}
      </a>

      <ScrollToTop />
      <Navbar />

      {/* key makes the fade-in play (and the error state reset) on every page change */}
      <main id="main-content" tabIndex={-1} key={pathname} className="main-content fade-in">
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </>
  );
}