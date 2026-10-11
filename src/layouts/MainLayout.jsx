import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
import "./MainLayout.css";

export default function MainLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      {/* key makes the fade-in play on every page change */}
      <main key={pathname} className="main-content fade-in">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}