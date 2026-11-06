import { ImageSourcePropType, TextStyle } from "react-native";
import type { BackgroundShape } from "@/hooks/use-screen-size";

export type NavIconName = "home" | "today" | "library";
export type ThemeIconName = "sun" | "moon";

export const fonts = {
  heading: "IrishGrover_400Regular",
  body: "ComicNeue_400Regular",
  bodyBold: "ComicNeue_700Bold",
};

export type Theme = {
  colors: {
    text: string;
    surface: string; // the content box
    surfaceStrong: string; // content box on reading pages (everything except the start page)
    panel: string; // the large panel behind everything (wide screens only)
    pill: string; // menu buttons
    pillText: string;
    toggle: string; // selected toggle (reading mode, day/night)
    toggleText: string;
    sparkle: string; // the twinkling stars on the cover and buttons
    sparkleGlow: string; // the glow around each star
  };
  title: TextStyle; // title color and glow
  backgroundImages: Record<BackgroundShape, ImageSourcePropType>;
  navIcons: Record<NavIconName, ImageSourcePropType>;
  themeIcons: Record<ThemeIconName, ImageSourcePropType>;
};

export const lightTheme: Theme = {
  colors: {
    text: "#6b21a8",
    surface: "rgba(254, 243, 199, 0.7)",
    surfaceStrong: "rgba(254, 243, 199, 0.95)",
    panel: "rgba(71, 71, 71, 0.31)",
    pill: "#fdeca8",
    pillText: "#6b21a8",
    toggle: "#e9a3f8",
    toggleText: "#4b0082",
    sparkle: "#e0a100", // deeper gold, visible on the light background
    sparkleGlow: "rgba(255, 255, 255, 0.9)",
  },
  title: {
    color: "#f5e9ff",
    textShadowColor: "#a949fd",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  backgroundImages: {
    portrait: require("@/assets/images/backgrounds/light-mobile.jpg"),
    landscape: require("@/assets/images/backgrounds/light-tablet.jpg"),
    wide: require("@/assets/images/backgrounds/light-web.jpg"),
  },
  navIcons: {
    home: require("@/assets/icons/home-light.png"),
    today: require("@/assets/icons/dagens-light.png"),
    library: require("@/assets/icons/library-light.png"),
  },
  themeIcons: {
    sun: require("@/assets/icons/sun-light.png"),
    moon: require("@/assets/icons/moon-light.png"),
  },
};

export const darkTheme: Theme = {
  colors: {
    text: "#fef9c3",
    surface: "rgba(59, 90, 130, 0.55)",
    surfaceStrong: "rgba(24, 46, 72, 0.95)",
    panel: "rgba(0, 0, 0, 0.5)",
    pill: "rgba(61, 111, 155, 0.4)",
    pillText: "#fef9c3",
    toggle: "#6a5ef0",
    toggleText: "#fff8dc",
    sparkle: "#ffe680", // pale gold
    sparkleGlow: "rgba(255, 230, 128, 0.8)",
  },
  title: {
    color: "#E9F6FF",
    textShadowColor: "#4991FD",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  backgroundImages: {
    portrait: require("@/assets/images/backgrounds/dark-mobile.jpg"),
    landscape: require("@/assets/images/backgrounds/dark-tablet.jpg"),
    wide: require("@/assets/images/backgrounds/dark-web.jpg"),
  },
  navIcons: {
    home: require("@/assets/icons/home-dark.png"),
    today: require("@/assets/icons/dagens-dark.png"),
    library: require("@/assets/icons/library-dark.png"),
  },
  themeIcons: {
    sun: require("@/assets/icons/sun-dark.png"),
    moon: require("@/assets/icons/moon-dark.png"),
  },
};
