import { useDeferredValue, useEffect, useRef, useState } from "react";
import Markdown from "../../components/Markdown/Markdown";
import { useTranslation } from "../../hooks/useTranslation";

// Built here so the source does not contain a literal triple backtick
const FENCE = "`".repeat(3);

export default function MarkdownEditor({ id, value, onChange, lang, invalid = false, describedBy }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const pending = useRef(null); // selection to restore after a toolbar action
  const [mode, setMode] = useState("write"); // used on small screens only
  const deferred = useDeferredValue(value); // typing stays smooth while the preview catches up
  const dir = lang === "fa" ? "rtl" : "ltr";

  // A toolbar action changes the text, React re-renders, and then we restore the selection
  useEffect(() => {
    const textarea = ref.current;
    const selection = pending.current;
    if (!textarea || !selection) return;
    pending.current = null;
    textarea.focus();
    textarea.setSelectionRange(selection.start, selection.end);
  }, [value]);

  // **bold**, *italic*, `code`, [link](url)
  const wrap = (before, after, fallback) => {
    const textarea = ref.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value: text } = textarea;
    const selected = text.slice(start, end) || fallback;

    pending.current = {
      start: start + before.length,
      end: start + before.length + selected.length,
    };
    onChange(text.slice(0, start) + before + selected + after + text.slice(end));
  };

  // Adds something at the start of every selected line: "## ", "> ", "- ", "1. "
  const prefixLines = (prefix) => {
    const textarea = ref.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value: text } = textarea;

    const lineStart = start === 0 ? 0 : text.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = text.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = text.length;

    const lines = text.slice(lineStart, lineEnd).split("\n");
    const changed = lines
      .map((line, i) => (typeof prefix === "function" ? prefix(i) : prefix) + line)
      .join("\n");

    pending.current = { start: lineStart, end: lineStart + changed.length };
    onChange(text.slice(0, lineStart) + changed + text.slice(lineEnd));
  };


  const TOOLS = [
  { key: "bold", label: "B" },
  { key: "italic", label: "I" },
  { key: "h2", label: "H2" },
  { key: "h3", label: "H3" },
  { key: "link", label: "Link" },
  { key: "list", label: "•" },
  { key: "orderedList", label: "1." },
  { key: "quote", label: "”" },
  { key: "code", label: "</>" },
  { key: "codeBlock", label: "{ }" },
];
  const runTool = (key) => {
    switch (key) {
      case "bold":
        return wrap("**", "**", t("admin.posts.editor.sampleBold"));
      case "italic":
        return wrap("*", "*", t("admin.posts.editor.sampleItalic"));
      case "h2":
        return prefixLines("## ");
      case "h3":
        return prefixLines("### ");
      case "link":
        return wrap("[", "](https://)", t("admin.posts.editor.sampleLink"));
      case "list":
        return prefixLines("- ");
      case "orderedList":
        return prefixLines((i) => `${i + 1}. `);
      case "quote":
        return prefixLines("> ");
      case "code":
        return wrap("`", "`", "code");
      case "codeBlock":
        return wrap(`\n${FENCE}\n`, `\n${FENCE}\n`, "code");
      default:
        return undefined;
    }
  };

   const handleKeyDown = (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      runTool("bold");
    } else if (key === "i") {
      e.preventDefault();
      runTool("italic");
    }
  };

  return (
    <div className="md-editor" data-mode={mode}>
      {/* Tabs: only visible on small screens, where the two panes do not fit side by side */}
      <div className="md-tabs" role="group" aria-label={t("admin.posts.editor.view")}>
        {["write", "preview"].map((name) => (
          <button
            key={name}
            type="button"
            className={`md-tab ${mode === name ? "active" : ""}`}
            aria-pressed={mode === name}
            onClick={() => setMode(name)}
          >
            {t(`admin.posts.editor.${name}`)}
          </button>
        ))}
      </div>

      <div className="md-panes">
        <div className="md-pane md-write">
          <div className="md-toolbar" role="toolbar" aria-label={t("admin.posts.editor.toolbar")}>
                        {TOOLS.map((tool) => (
              <button
                key={tool.key}
                type="button"
                className="md-tool"
                onClick={() => runTool(tool.key)}
                title={t(`admin.posts.editor.${tool.key}`)}
                aria-label={t(`admin.posts.editor.${tool.key}`)}
              >
                {tool.label}
              </button>
            ))}
          </div>

          <textarea
            ref={ref}
            id={id}
            className="input field-control md-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            dir={dir}
            lang={lang}
            spellCheck={lang === "en"}
            placeholder={t("admin.posts.editor.placeholder")}
            aria-invalid={invalid ? "true" : "false"}
            aria-describedby={describedBy}
          />
        </div>

        <div className="md-pane md-preview-pane">
          <p className="md-preview-label">{t("admin.posts.editor.preview")}</p>
          <div className="md-preview" dir={dir} lang={lang}>
            {deferred.trim() ? (
              <Markdown>{deferred}</Markdown>
            ) : (
              <p className="admin-hint">{t("admin.posts.editor.emptyPreview")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}