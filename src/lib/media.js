import { supabase } from "./supabase";
import { lightSrc } from "../utils/themedImage";

const BUCKET = "media";
const MARKER = `/storage/v1/object/public/${BUCKET}/`;

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 480 * 1024; // the bucket limit is 500 KB

function toBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}

// Resizes to max 1280 px wide and converts to WebP. Throws Error("type" | "tooBig" |
// "decode" | "unsupported" | "tooHeavy"), which the picker turns into a message.
export async function compressToWebp(file, maxWidth = 1280) {
  if (!ACCEPTED_TYPES.includes(file.type)) throw new Error("type");
  if (file.size > MAX_INPUT_BYTES) throw new Error("tooBig");

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("decode");
  }

  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  // Lower the quality step by step until the file is small enough
  for (const quality of [0.85, 0.75, 0.65, 0.5]) {
    const blob = await toBlob(canvas, quality);
    if (!blob || blob.type !== "image/webp") throw new Error("unsupported");
    if (blob.size <= MAX_OUTPUT_BYTES) return blob;
  }
  throw new Error("tooHeavy");
}

// Uploads a blob and returns its public URL
export async function uploadImage(path, blob) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error("upload");
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Best effort: a failed cleanup must never break the main action
export async function removeUploaded(paths) {
  if (!paths.length) return;
  try {
    await supabase.storage.from(BUCKET).remove(paths);
  } catch {
    // ignore
  }
}

// Files in /public are not stored in Supabase, so they are left alone
export function storagePathFromUrl(url = "") {
  const i = url.indexOf(MARKER);
  return i === -1 ? null : decodeURIComponent(url.slice(i + MARKER.length));
}

// Removes the dark image and its "-light" twin
export async function removeStoredImages(url) {
  const path = storagePathFromUrl(url);
  if (path) await removeUploaded([path, lightSrc(path)]);
}