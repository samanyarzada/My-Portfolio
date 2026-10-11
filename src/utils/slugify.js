/**
 * Turns a title into a URL-friendly slug.
 * Works with English and Persian (Persian letters are kept).
 * "React Router Intro!" -> "react-router-intro"
 * "آموزش ری‌اکت"         -> "آموزش-ری-اکت"
 */
export function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u200c\u200f]/g, "-")                 // zero-width non-joiner and RTL mark
    .replace(/[^\p{L}\p{N}\s-]/gu, "")               // remove symbols, keep letters and numbers (any language)
    .replace(/[\s_]+/g, "-")                         // spaces and underscores -> dash
    .replace(/-+/g, "-")                             // collapse repeated dashes
    .replace(/^-+|-+$/g, "");                        // trim dashes from both ends
}

/**
 * Makes sure a slug is unique among existing slugs.
 * uniqueSlug("hello", ["hello"]) -> "hello-2"
 */
export function uniqueSlug(slug, existingSlugs = []) {
  if (!existingSlugs.includes(slug)) return slug;
  let i = 2;
  while (existingSlugs.includes(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}