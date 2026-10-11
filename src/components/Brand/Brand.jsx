import { Link } from "react-router-dom";
import { profile } from "../../data/profile";
import "./Brand.css";

export default function Brand({ onClick }) {
  const [first, rest] = profile.brand.split("."); // "Saman" + "dev"

  return (
    <Link to="/" className="brand" onClick={onClick} aria-label={profile.brand}>
      <span className="brand-mark">SY</span>
      <span className="brand-name">
        {first}
        <span>.{rest}</span>
      </span>
    </Link>
  );
}