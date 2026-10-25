import { categories, coverSymbols, posts } from "./posts";
import { projects } from "./projects";
import { profile } from "./profile";

export const fallbackContent = {
  categories: categories.map((c) => ({ ...c, symbol: coverSymbols[c.id] ?? "</>" })),
  projects,
  profile,
  posts: posts.map((p) => ({
    ...p,
    content: { en: p.content.en.join("\n\n"), fa: p.content.fa.join("\n\n") },
  })),
};  