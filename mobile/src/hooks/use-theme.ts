import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, Theme } from "@/constants/theme";

// Returns the theme that matches the phone's light/dark setting
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
}
