import darkImg from "../assets/images/profile.webp";
import lightImg from "../assets/images/profile-light.webp";
import { useTheme } from "./useTheme";

// Returns the profile photo that matches the current theme
export function useProfileImage() {
  const { isLight } = useTheme();
  return isLight ? lightImg : darkImg;
}