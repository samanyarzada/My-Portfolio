import { supabase } from "./supabase";
import { mapCategory, mapPost, mapProject } from "./mappers";
import { profile as fallbackProfile } from "../data/profile";

const TIMEOUT_MS = 8000;

export async function fetchContent() {
  if (!supabase) throw new Error("Supabase is not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const [categories, projects, posts, profileRes] = await Promise.all([
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
      supabase.from("profile").select("data").eq("id", 1).maybeSingle().abortSignal(controller.signal),
    ]);

    for (const result of [categories, projects, posts]) {
      if (result.error) throw new Error(result.error.message);
    }

    // The profile is optional: if it is missing or fails, the built-in one is used.
    // Merging keeps any key that the database row does not have yet.
    const stored = profileRes.error ? null : profileRes.data?.data;

    return {
      categories: categories.data.map(mapCategory),
      projects: projects.data.map(mapProject),
      posts: posts.data.map(mapPost),
      profile: { ...fallbackProfile, ...(stored ?? {}) },
    };
  } finally {
    clearTimeout(timer);
  }
}