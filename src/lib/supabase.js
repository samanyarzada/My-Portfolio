import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the keys are missing the site must still work (it will use the built-in data)
export const supabaseConfigured = Boolean(url && key);

export const supabase = supabaseConfigured ? createClient(url, key) : null;