import { ImageSourcePropType, TextStyle } from "react-native";

// The three shadow properties React Native uses instead of CSS text-shadow
type TextGlow = Pick<
  TextStyle,
  "textShadowColor" | "textShadowOffset" | "textShadowRadius"
>;

export const fonts = {
  heading: "IrishGrover_400Regular",
  body: "ComicNeue_400Regular",
  bodyBold: "ComicNeue_700Bold",
};

export type Theme = {
  colors: {
    text: string;
    surface: string; // the content box
    panel: string; // the large panel behind everything (wide screens only)
    pill: string; // menu buttons
    pillText: string;
    toggle: string; // day/night button
    toggleText: string;
  };
  title: TextStyle; // title color and glow
  backgroundImage: ImageSourcePropType;
};

export const lightTheme: Theme = {
  colors: {
    text: "#6b21a8",
    surface: "rgba(254, 243, 199, 0.92)",
    panel: "rgba(71, 71, 71, 0.31)",
    pill: "#fdeca8",
    pillText: "#6b21a8",
    toggle: "#e9a3f8",
    toggleText: "#4b0082",
  },
  title: {
    color: "#b691ea",
    textShadowColor: "rgba(247, 136, 227, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  backgroundImage: require("../../assets/images/backgrounds/day-bg-mob.png"),
};

export const darkTheme: Theme = {
  colors: {
    text: "#fef9c3",
    surface: "rgba(59, 90, 130, 0.45)",
    panel: "rgba(0, 0, 0, 0.5)",
    pill: "rgba(61, 111, 155, 0.4)",
    pillText: "#fef9c3",
    toggle: "#6a5ef0",
    toggleText: "#fff8dc",
  },
  title: {
    color: "#88c9ff",
    textShadowColor: "rgba(144, 202, 249, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  backgroundImage: require("../../assets/images/backgrounds/night-bg-mob.png"),
};
