import { Link } from "react-router-dom";
import "./TagBadge.css";

export default function TagBadge({ tag }) {
  return (
    <Link to={`/tag/${tag}`} className="tag-badge">
      #{tag}
    </Link>
  );
}