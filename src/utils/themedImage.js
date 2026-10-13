// "/images/projects/nova-store.webp" -> "/images/projects/nova-store-light.webp"
export function lightSrc(path = "") {
  return path.replace(/(\.[a-z0-9]+)$/i, "-light$1");
}