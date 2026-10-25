import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { categories, coverSymbols, posts } from "../src/data/posts.js";
import { projects } from "../src/data/projects.js";
import { profile } from "../src/data/profile.js";

const {
  VITE_SUPABASE_URL: url,
  VITE_SUPABASE_ANON_KEY: key,
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD: password,
} = process.env;

const force = process.argv.includes("--force");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (!url || !key) fail("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Run with --env-file=.env");
if (!email || !password) fail("Set ADMIN_EMAIL and ADMIN_PASSWORD in this terminal session first.");

const supabase = createClient(url, key, { auth: { persistSession: false } });

// ---------- 1. Sign in as the admin ----------
const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
if (signInError) fail(`Sign-in failed: ${signInError.message}`);
console.log("Signed in as admin.");

// ---------- 2. Do not overwrite data that already exists ----------
async function count(table) {
  const { count: n, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) fail(`Could not read ${table}: ${error.message}`);
  return n ?? 0;
}

const existing = {
  categories: await count("categories"),
  projects: await count("projects"),
  posts: await count("posts"),
  profile: await count("profile"),
};

if (!force && Object.values(existing).some((n) => n > 0)) {
  console.log("Existing rows:", existing);
  fail("The database already has data. Running again would overwrite changes made in the panel. Use --force only if you are sure.");
}

// ---------- 3. Map the old data files to table rows ----------
const categoryRows = categories.map((c, i) => ({
  id: c.id,
  name_en: c.name.en,
  name_fa: c.name.fa,
  symbol: coverSymbols[c.id] ?? "</>",
  sort_order: i,
}));

const projectRows = projects.map((p, i) => ({
  slug: p.id,
  title_en: p.title.en,
  title_fa: p.title.fa,
  summary_en: p.summary.en,
  summary_fa: p.summary.fa,
  highlights_en: p.highlights.en,
  highlights_fa: p.highlights.fa,
  image: p.image ?? "",
  alt_en: p.alt.en,
  alt_fa: p.alt.fa,
  tech: p.tech,
  live_url: p.liveUrl ?? "",
  repo_url: p.repoUrl ?? "",
  sort_order: i,
  published: true,
}));

// Old content was an array of paragraphs. Markdown paragraphs are separated by a blank line.
const postRows = posts.map((p) => ({
  slug: p.slug,
  category_id: p.category,
  tags: p.tags,
  published_at: p.date,
  read_time: p.readTime,
  featured: Boolean(p.featured),
  image: p.image ?? "",
  title_en: p.title.en,
  title_fa: p.title.fa,
  excerpt_en: p.excerpt.en,
  excerpt_fa: p.excerpt.fa,
  content_en: p.content.en.join("\n\n"),
  content_fa: p.content.fa.join("\n\n"),
  status: "published",
}));

// ---------- 4. Write (categories first, because posts point to them) ----------
async function write(table, rows, onConflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) fail(`Writing ${table} failed: ${error.message}`);
  console.log(`${table}: ${rows.length} row(s) written.`);
}

await write("categories", categoryRows, "id");
await write("posts", postRows, "slug");
await write("projects", projectRows, "slug");
await write("profile", [{ id: 1, data: profile }], "id");

console.log("Done. Check the Table Editor in Supabase.");
await supabase.auth.signOut();