import { useEffect, useRef, useState } from "react";
import { ExternalIcon, GithubIcon } from "../Icons";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { lightSrc } from "../../utils/themedImage";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { t, l } = useTranslation();
  const { isLight } = useTheme();
  const imgRef = useRef(null);
  const [imgState, setImgState] = useState("loading"); // loading | loaded | error
  const [lightFailed, setLightFailed] = useState(false);

  // Light theme uses the "-light" image, with the dark one as a fallback
  const src = isLight && !lightFailed ? lightSrc(project.image) : project.image;

  // A cached image can finish loading before React attaches onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setImgState("loaded");
  }, []);

  const handleError = () => {
    if (isLight && !lightFailed) setLightFailed(true);
    else setImgState("error");
  };

  const title = l(project.title);

  return (
    <article className="project-card glass glass-hover">
      <div className="project-media" data-state={imgState}>
        {imgState === "loading" && (
          <div className="project-skeleton" role="status" aria-label={t("projects.imageLoading")} />
        )}

        {imgState === "error" ? (
          <div className="project-fallback" role="img" aria-label={t("projects.imageError")}>
            <span className="project-fallback-letter">{title.charAt(0)}</span>
            <span>{t("projects.imageError")}</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt={l(project.alt)}
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            onLoad={() => setImgState("loaded")}
            onError={handleError}
          />
        )}
      </div>

      <div className="project-body">
        <h3 className="project-title">{title}</h3>
        <p className="project-summary">{l(project.summary)}</p>

        <div>
          <h4 className="project-subtitle">{t("projects.features")}</h4>
          <ul className="check-list project-features">
            {l(project.highlights).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <ul className="project-tech">
          {project.tech.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>

        <div className="project-actions">
          <a
            className="btn btn-primary"
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("projects.liveDemo")}: ${title}`}
          >
            {t("projects.liveDemo")} <ExternalIcon className="btn-icon" />
          </a>
          <a
            className="btn btn-ghost"
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("projects.sourceCode")}: ${title}`}
          >
            <GithubIcon className="btn-icon" /> {t("projects.sourceCode")}
          </a>
        </div>
      </div>
    </article>
  );
}