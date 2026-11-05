// src/hooks/use-theme.tsx
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, Theme } from "@/constants/theme";
import { useSettings } from "@/hooks/use-settings";

type Mode = "light" | "dark";
type ThemeModeControls = { mode: Mode; toggleMode: () => void };

// The mode in use right now. "system" follows the phone's setting (dark if unknown).
export function useThemeMode(): ThemeModeControls {
  const { settings, setThemeMode } = useSettings();
  const systemScheme = useColorScheme();

  const mode: Mode =
    settings.themeMode === "system"
      ? systemScheme === "light"
        ? "light"
        : "dark"
      : settings.themeMode;

  // Choosing a mode saves it, so the app stops following the phone from then on
  const toggleMode = () => setThemeMode(mode === "dark" ? "light" : "dark");

  return { mode, toggleMode };
}

// The active theme, used by every screen as before
export function useTheme(): Theme {
  const { mode } = useThemeMode();
  return mode === "dark" ? darkTheme : lightTheme;
}
