import { supabase } from "./supabase";
import { mapCategory, mapPost, mapProject } from "./mappers";

const TIMEOUT_MS = 8000;

export async function fetchContent() {
  if (!supabase) throw new Error("Supabase is not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const [categories, projects, posts] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order").abortSignal(controller.signal),
        supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("sort_order")
        .abortSignal(controller.signal),
      supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .abortSignal(controller.signal),
    ]);

    for (const result of [categories, projects, posts]) {
      if (result.error) throw new Error(result.error.message);
    }

    return {
      categories: categories.data.map(mapCategory),
      projects: projects.data.map(mapProject),
      posts: posts.data.map(mapPost),
    };
  } finally {
    clearTimeout(timer);
  }
}