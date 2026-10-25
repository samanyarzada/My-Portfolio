import { useState } from "react";
import SocialLinks from "../SocialLinks/SocialLinks";
import { useProfile } from "../../hooks/useProfile";
import { useTranslation } from "../../hooks/useTranslation";
import { useProfileImage } from "../../hooks/useProfileImage";
import "./AuthorBox.css";

export default function AuthorBox() {
  const { t, l } = useTranslation();
  const profile = useProfile();
  const [imgFailed, setImgFailed] = useState(false);
const profileImg = useProfileImage();
  return (
    <aside className="author-box glass">
      <div className="author-avatar">
        {imgFailed ? (
          <span className="author-fallback">SY</span>
        ) : (
          <img
            src={profileImg}
            alt={l(profile.name)}
            width="84"
            height="84"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      <div className="author-info">
        <span className="author-label">{t("postDetail.aboutAuthor")}</span>
        <h3>{l(profile.name)}</h3>
        <span className="author-role">{l(profile.title)}</span>
        <p>{l(profile.bio)}</p>
        <SocialLinks />
      </div>
    </aside>
  );
}
