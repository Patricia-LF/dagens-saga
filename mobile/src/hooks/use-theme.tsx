// src/hooks/use-theme.tsx (note: .tsx now, since it contains JSX)
import { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, Theme } from "@/constants/theme";

type Mode = "light" | "dark";
type ThemeMode = { mode: Mode; toggleMode: () => void };

const ThemeModeContext = createContext<ThemeMode>({
  mode: "dark",
  toggleMode: () => {},
});

// Wraps the app and remembers the chosen mode. Starts with the phone's setting.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<Mode>(
    systemScheme === "light" ? "light" : "dark",
  );
  const toggleMode = () =>
    setMode((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

// The active theme, used by every screen as before
export function useTheme(): Theme {
  const { mode } = useContext(ThemeModeContext);
  return mode === "dark" ? darkTheme : lightTheme;
}

// For the toggle button
export function useThemeMode(): ThemeMode {
  return useContext(ThemeModeContext);
}
