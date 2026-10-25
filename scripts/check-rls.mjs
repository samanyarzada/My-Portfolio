import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key } = process.env;
if (!url || !key) {
  console.error("ERROR: run with --env-file=.env");
  process.exit(1);
}

// No sign-in: this is what any visitor can do
const anon = createClient(url, key, { auth: { persistSession: false } });

let failed = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!ok) failed += 1;
}

// ----- Reading must work -----
const projects = await anon.from("projects").select("slug");
check("visitor can read projects", !projects.error && projects.data.length > 0, `${projects.data?.length ?? 0} rows`);

const posts = await anon.from("posts").select("slug");
check("visitor can read published posts", !posts.error && posts.data.length > 0, `${posts.data?.length ?? 0} rows`);

const cats = await anon.from("categories").select("id");
check("visitor can read categories", !cats.error && cats.data.length > 0, `${cats.data?.length ?? 0} rows`);

const prof = await anon.from("profile").select("id");
check("visitor can read the profile", !prof.error && prof.data.length === 1);

// ----- Writing must be blocked -----
const insert = await anon.from("projects").insert({
  slug: "rls-test",
  title_en: "x",
  title_fa: "x",
  summary_en: "x",
  summary_fa: "x",
});
check("visitor cannot insert a project", Boolean(insert.error), insert.error?.message);

// With RLS, update and delete do not throw. They simply touch 0 rows.
const target = projects.data?.[0]?.slug;
if (target) {
  const update = await anon.from("projects").update({ title_en: "HACKED" }).eq("slug", target).select();
  check("visitor cannot update a project", !update.error && update.data.length === 0);

  const del = await anon.from("projects").delete().eq("slug", target).select();
  check("visitor cannot delete a project", !del.error && del.data.length === 0);
}

const profileWrite = await anon.from("profile").upsert({ id: 1, data: { hacked: true } });
check("visitor cannot change the profile", Boolean(profileWrite.error), profileWrite.error?.message);

const postWrite = await anon.from("posts").insert({
  slug: "rls-test",
  category_id: "react",
  title_en: "x",
  title_fa: "x",
});
check("visitor cannot insert a post", Boolean(postWrite.error), postWrite.error?.message);

// ----- Private table and storage -----
const admins = await anon.from("admins").select("*");
check("visitor cannot read the admins table", !admins.error && admins.data.length === 0);

const upload = await anon.storage
  .from("media")
  .upload("rls-test.png", new Blob(["x"], { type: "image/png" }));
check("visitor cannot upload files", Boolean(upload.error), upload.error?.message);

console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) FAILED. Do not continue until this is fixed.`);
process.exit(failed === 0 ? 0 : 1);