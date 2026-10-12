import "./SectionHeader.css";

export default function SectionHeader({ eyebrow, title, text }) {
  return (
    <header className="section-header">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-header-title">{title}</h2>
      {text && <p className="section-subtitle">{text}</p>}
    </header>
  );
}