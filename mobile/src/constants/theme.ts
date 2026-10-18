import { ImageSourcePropType, TextStyle } from "react-native";
import type { BackgroundShape } from "@/hooks/use-screen-size";

// The three shadow properties React Native uses instead of CSS text-shadow
/* type TextGlow = Pick<
  TextStyle,
  "textShadowColor" | "textShadowOffset" | "textShadowRadius"
>; */

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
    toggle: string; // day/night button
    toggleText: string;
  };
  title: TextStyle; // title color and glow
  backgroundImages: Record<BackgroundShape, ImageSourcePropType>;
};

export const lightTheme: Theme = {
  colors: {
    text: "#6b21a8",
    surface: "rgba(254, 243, 199, 0.7)",
    surfaceStrong: "rgba(254, 243, 199, 0.9)",
    panel: "rgba(71, 71, 71, 0.31)",
    pill: "#fdeca8",
    pillText: "#6b21a8",
    toggle: "#e9a3f8",
    toggleText: "#4b0082",
  },
  title: {
    color: "#f5e9ff",
    textShadowColor: "#a949fd",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  backgroundImages: {
    portrait: require("@/assets/images/backgrounds/day-bg-mob.png"),
    landscape: require("@/assets/images/backgrounds/light-Tablet.png"),
    wide: require("@/assets/images/backgrounds/day-bg-web.jpeg"),
  },
};

export const darkTheme: Theme = {
  colors: {
    text: "#fef9c3",
    surface: "rgba(59, 90, 130, 0.45)",
    surfaceStrong: "rgba(24, 46, 72, 0.8)",
    panel: "rgba(0, 0, 0, 0.5)",
    pill: "rgba(61, 111, 155, 0.4)",
    pillText: "#fef9c3",
    toggle: "#6a5ef0",
    toggleText: "#fff8dc",
  },
  title: {
    color: "#E9F6FF",
    textShadowColor: "#4991FD",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  backgroundImages: {
    portrait: require("@/assets/images/backgrounds/night-bg-mob.png"),
    landscape: require("@/assets/images/backgrounds/dark-Tablet.png"),
    wide: require("@/assets/images/backgrounds/night-bg-web.jpeg"),
  },
};
