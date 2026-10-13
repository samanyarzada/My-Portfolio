import { useState } from "react";
import { coverSymbols } from "../../data/posts";
import "./PostCover.css";

// Shows the article image. If there is no image, or it fails to load,
// the gradient cover with a symbol is shown instead.
export default function PostCover({ post, alt = "", className = "", children }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(post.image) && !failed;

  return (
    <div
      className={`post-cover ${showImage ? "has-image" : ""} ${className}`}
      data-category={post.category}
    >
      {showImage ? (
        <img
          className="post-cover-img"
          src={post.image}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="post-cover-symbol" aria-hidden="true">
          {coverSymbols[post.category] ?? "</>"}
        </span>
      )}
      {children}
    </div>
  );
}