export const mapCategory = (r) => ({
  id: r.id,
  name: { en: r.name_en, fa: r.name_fa },
  symbol: r.symbol,
});

export const mapProject = (r) => ({
  id: r.slug,
  title: { en: r.title_en, fa: r.title_fa },
  summary: { en: r.summary_en, fa: r.summary_fa },
  highlights: { en: r.highlights_en, fa: r.highlights_fa },
  image: r.image,
  alt: { en: r.alt_en, fa: r.alt_fa },
  tech: r.tech,
  liveUrl: r.live_url,
  repoUrl: r.repo_url,
});

export const mapPost = (r) => ({
  id: r.id,
  slug: r.slug,
  category: r.category_id,
  tags: r.tags,
  date: r.published_at,
  readTime: r.read_time,
  featured: r.featured,
  image: r.image,
  title: { en: r.title_en, fa: r.title_fa },
  excerpt: { en: r.excerpt_en, fa: r.excerpt_fa },
  content: { en: r.content_en, fa: r.content_fa }, // Markdown text
});