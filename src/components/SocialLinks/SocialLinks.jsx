import { profile } from "../../data/profile";
import EmailButton from "../EmailButton/EmailButton";
import { GithubIcon, LinkedinIcon, TelegramIcon } from "../Icons";
import "./SocialLinks.css";

const items = [
  { key: "github", label: "GitHub", href: profile.social.github, Icon: GithubIcon },
  { key: "linkedin", label: "LinkedIn", href: profile.social.linkedin, Icon: LinkedinIcon },
  { key: "telegram", label: "Telegram", href: profile.social.telegram, Icon: TelegramIcon },
];

export default function SocialLinks({ showEmail = true }) {
  return (
    <ul className="social-links">
      {items.map(({ key, label, href, Icon }) => (
        <li key={key}>
          <a
            className="icon-btn"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
          >
            <Icon />
          </a>
        </li>
      ))}
      {showEmail && (
        <li>
          <EmailButton iconOnly />
        </li>
      )}
    </ul>
  );
}