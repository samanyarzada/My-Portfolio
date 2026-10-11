const locale = (lang) => (lang === "fa" ? "fa-AF" : "en-US");

// "2026-09-28" -> "September 28, 2026" (fa: Afghan Solar Hijri date)
export function formatDate(dateString, lang) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat(locale(lang), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// 6 -> "6" (fa: Persian digits)
export function formatNumber(value, lang) {
  return new Intl.NumberFormat(locale(lang)).format(value);
}