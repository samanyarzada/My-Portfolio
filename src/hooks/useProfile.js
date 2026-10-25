import { useContent } from "./useContent";

// The profile comes from the database, with the built-in data as a fallback
export function useProfile() {
  return useContent().profile;
}