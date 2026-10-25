import { useProfile } from "../../hooks/useProfile";
import EmailButton from "../EmailButton/EmailButton";
import { GithubIcon, LinkedinIcon, TelegramIcon } from "../Icons";
import "./SocialLinks.css";

export default function SocialLinks({ showEmail = true }) {
  const { social } = useProfile();

  const items = [
    { key: "github", label: "GitHub", href: social.github, Icon: GithubIcon },
    { key: "linkedin", label: "LinkedIn", href: social.linkedin, Icon: LinkedinIcon },
    { key: "telegram", label: "Telegram", href: social.telegram, Icon: TelegramIcon },
  ];

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