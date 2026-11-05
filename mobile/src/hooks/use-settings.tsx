import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ReadingMode = "pages" | "scroll";
export type ThemeMode = "system" | "light" | "dark";

// All saved settings live in one object
type Settings = { readingMode: ReadingMode; themeMode: ThemeMode };

const DEFAULT_SETTINGS: Settings = {
  readingMode: "pages",
  themeMode: "system",
};

// AsyncStorage is a small key/value store on the device, like localStorage in a browser
const STORAGE_KEY = "settings";

type SettingsContextValue = {
  settings: Settings;
  loaded: boolean; // false until the saved settings have been read
  setReadingMode: (mode: ReadingMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  setReadingMode: () => {},
  setThemeMode: () => {},
});

// Returns the value if it is one of the allowed options, otherwise the fallback
function pick<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

// Reads the saved settings. Anything missing or invalid falls back to the defaults.
async function loadSettings(): Promise<Settings> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(saved);
    return {
      readingMode: pick(
        parsed?.readingMode,
        ["pages", "scroll"],
        DEFAULT_SETTINGS.readingMode,
      ),
      themeMode: pick(
        parsed?.themeMode,
        ["system", "light", "dark"],
        DEFAULT_SETTINGS.themeMode,
      ),
    };
  } catch (error) {
    console.error(error);
    return DEFAULT_SETTINGS;
  }
}

// Wraps the app, loads the settings once at start and saves them on every change
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((saved) => {
      setSettings(saved);
      setLoaded(true);
    });
  }, []);

  // Save whenever the settings change, but not before the saved ones have been read
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch((error) =>
      console.error(error),
    );
  }, [settings, loaded]);

  // prev is always the latest settings, so two quick changes can't overwrite each other
  const setReadingMode = (readingMode: ReadingMode) =>
    setSettings((prev) => ({ ...prev, readingMode }));
  const setThemeMode = (themeMode: ThemeMode) =>
    setSettings((prev) => ({ ...prev, themeMode }));

  return (
    <SettingsContext.Provider
      value={{ settings, loaded, setReadingMode, setThemeMode }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
