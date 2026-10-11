import { useMemo } from "react";

/**
 * Slices a list into pages.
 * The page number is clamped, so ?page=99 safely shows the last page.
 */
export function usePagination(items, page = 1, perPage = 6) {
  return useMemo(() => {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Number.isFinite(page) ? page : 1;
    const currentPage = Math.min(Math.max(1, safePage), totalPages);
    const start = (currentPage - 1) * perPage;

    return {
      total,
      totalPages,
      currentPage,
      pageItems: items.slice(start, start + perPage),
    };
  }, [items, page, perPage]);
}