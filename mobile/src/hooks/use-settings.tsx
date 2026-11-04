import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ReadingMode = "pages" | "scroll";

// All saved settings live in one object (issue 30 adds the color scheme here)
type Settings = { readingMode: ReadingMode };

const DEFAULT_SETTINGS: Settings = { readingMode: "pages" };

// AsyncStorage is a small key/value store on the device, like localStorage in a browser
const STORAGE_KEY = "settings";

type SettingsContextValue = {
  settings: Settings;
  loaded: boolean; // false until the saved settings have been read
  setReadingMode: (mode: ReadingMode) => void;
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  setReadingMode: () => {},
});

// Reads the saved settings. Anything missing or invalid falls back to the defaults.
async function loadSettings(): Promise<Settings> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(saved);
    const readingMode =
      parsed?.readingMode === "pages" || parsed?.readingMode === "scroll"
        ? parsed.readingMode
        : DEFAULT_SETTINGS.readingMode;
    return { ...DEFAULT_SETTINGS, readingMode };
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

  const setReadingMode = (readingMode: ReadingMode) => {
    const next = { ...settings, readingMode };
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((error) =>
      console.error(error),
    );
  };

  return (
    <SettingsContext.Provider value={{ settings, loaded, setReadingMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
