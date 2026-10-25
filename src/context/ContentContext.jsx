import { useCallback, useEffect, useMemo, useState } from "react";
import { ContentContext } from "./content-context";
import { fetchContent } from "../lib/content";
import { supabaseConfigured } from "../lib/supabase";
import { fallbackContent } from "../data/fallback";

function initialState() {
  // No keys: the built-in data is used right away
  if (!supabaseConfigured) {
    return { status: "ready", source: "fallback", error: null, ...fallbackContent };
  }
  return { status: "loading", source: null, error: null, categories: [], projects: [], posts: [] };
}

export function ContentProvider({ children }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;

    fetchContent()
      .then((data) => {
        if (!cancelled) setState({ status: "ready", source: "database", error: null, ...data });
      })
      .catch((err) => {
        console.warn("Database unavailable, using the built-in content:", err.message);
        if (!cancelled) {
          setState({ status: "ready", source: "fallback", error: err.message, ...fallbackContent });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // The admin panel calls this after saving, so the public site shows the change
  const reload = useCallback(async () => {
    const data = await fetchContent();
    setState({ status: "ready", source: "database", error: null, ...data });
  }, []);

  const value = useMemo(() => {
    const sortedPosts = [...state.posts].sort((a, b) => b.date.localeCompare(a.date));
    const categoryById = Object.fromEntries(state.categories.map((c) => [c.id, c]));
    const allTags = [...new Set(sortedPosts.flatMap((p) => p.tags))].sort();

    return {
      ...state,
      loading: state.status === "loading",
      sortedPosts,
      categoryById,
      allTags,
      reload,
    };
  }, [state, reload]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}