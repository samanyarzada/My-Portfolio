import { useState } from "react";
import { Link } from "react-router-dom";
import EmailButton from "../../components/EmailButton/EmailButton";
import SocialLinks from "../../components/SocialLinks/SocialLinks";
import PostCard from "../../components/PostCard/PostCard";
import { posts } from "../../data/posts";
import { profile } from "../../data/profile";
import { useTranslation } from "../../hooks/useTranslation";
import { useProfileImage } from "../../hooks/useProfileImage";
import "./Home.css";

// Newest first
const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
const featuredPost = sorted.find((p) => p.featured) ?? sorted[0];
const latestPosts = sorted.filter((p) => p.id !== featuredPost.id).slice(0, 3);

const floatingSkills = ["React", "JavaScript", "CSS"];

export default function Home() {
  const { t, l } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);
  const profileImg = useProfileImage();

  return (
    <>
      {/* ================= Hero ================= */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="eyebrow fade-up">
              <span className="pulse-dot" />
              {l(profile.location)}
            </span>

            <p className="hero-hello fade-up delay-1">{t("home.hello")}</p>
            <h1 className="hero-name gradient-text fade-up delay-1">
              {l(profile.name)}
            </h1>
            <p className="hero-role fade-up delay-2">{l(profile.title)}</p>
            <p className="hero-tagline fade-up delay-2">{l(profile.tagline)}</p>

            <div className="hero-actions fade-up delay-3">
              <Link to="/projects" className="btn btn-primary">
                {t("home.viewProjects")} <span className="arrow">→</span>
              </Link>
              <EmailButton variant="ghost" />
            </div>

            <div className="fade-up delay-4">
              <SocialLinks showEmail={false} />
            </div>
          </div>

          <div className="hero-photo fade-up delay-2">
            <div className="photo-glow" aria-hidden="true" />
            <div className="photo-frame">
              {imgFailed ? (
                <div className="photo-fallback">SY</div>
              ) : (
                <img
                  src={profileImg}
                  alt={l(profile.name)}
                  width="420"
                  height="420"
                  fetchPriority="high"
                  decoding="async"
                  onError={() => setImgFailed(true)}
                />
              )}
            </div>

            {floatingSkills.map((skill, i) => (
              <span
                key={skill}
                className={`float-chip chip-${i + 1}`}
                aria-hidden="true"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Highlights ================= */}
      <section className="container highlights">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="highlight glass glass-hover fade-up"
            style={{ animationDelay: `${0.15 * i}s` }}
          >
            <span className="highlight-label">
              {t(`home.highlights.${i}.label`)}
            </span>
            <h3>{t(`home.highlights.${i}.title`)}</h3>
            <p>{t(`home.highlights.${i}.text`)}</p>
          </div>
        ))}
      </section>

      {/* ================= Featured ================= */}
      <section className="container section home-featured">
        <span className="eyebrow">{t("home.featuredLabel")}</span>
        <div style={{ marginBlockStart: "1.5rem" }}>
          <PostCard post={featuredPost} featured />
        </div>
      </section>

      {/* ================= Latest ================= */}
      <section className="container home-latest">
        <div className="section-head">
          <div>
            <h2 className="section-title">{t("home.latestTitle")}</h2>
            <p className="section-subtitle">{t("home.latestText")}</p>
          </div>
          <Link to="/blog" className="link-arrow">
            {t("home.viewAll")} <span className="arrow">→</span>
          </Link>
        </div>

        <div className="posts-grid">
          {latestPosts.map((post, i) => (
            <div
              key={post.id}
              className="fade-up"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="container section">
        <div className="cta neon-border">
          <h2>{t("home.ctaTitle")}</h2>
          <p>{t("home.ctaText")}</p>
          <EmailButton />
        </div>
      </section>
    </>
  );
}
