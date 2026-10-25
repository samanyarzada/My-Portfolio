import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import "./Markdown.css";

const components = {
  // The page already has one h1 (the article title), so "#" becomes h2
  h1: ({ children }) => <h2>{children}</h2>,

  a: ({ href = "", children }) => {
    if (/^https?:\/\//.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    if (href.startsWith("/")) return <Link to={href}>{children}</Link>;
    return <a href={href}>{children}</a>;
  },

  img: ({ src, alt }) => <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />,

  // A wide table scrolls inside its box instead of widening the whole page
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
};

export default function Markdown({ children }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}