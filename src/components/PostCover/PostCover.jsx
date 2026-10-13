import { useState } from "react";
import { coverSymbols } from "../../data/posts";
import { useTheme } from "../../hooks/useTheme";
import { lightSrc } from "../../utils/themedImage";
import "./PostCover.css";

// Shows the article image for the current theme.
// Light theme: "-light" image first, then the dark image, then the gradient cover.
export default function PostCover({ post, alt = "", className = "", children }) {
  const { isLight } = useTheme();
  const [lightFailed, setLightFailed] = useState(false);
  const [failed, setFailed] = useState(false);

  const useLight = isLight && !lightFailed;
  const showImage = Boolean(post.image) && !failed;
  const src = useLight ? lightSrc(post.image) : post.image;

  const handleError = () => {
    if (useLight) setLightFailed(true);
    else setFailed(true);
  };

  return (
    <div
      className={`post-cover ${showImage ? "has-image" : ""} ${className}`}
      data-category={post.category}
    >
      {showImage ? (
        <img
          className="post-cover-img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={handleError}
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