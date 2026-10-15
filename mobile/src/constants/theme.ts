import { ImageSourcePropType, TextStyle } from "react-native";

// The three shadow properties React Native uses instead of CSS text-shadow
type TextGlow = Pick<
  TextStyle,
  "textShadowColor" | "textShadowOffset" | "textShadowRadius"
>;

export type Theme = {
  colors: {
    text: string;
    textMuted: string;
    background: string;
    accent: string;
    surface: string;
    border: string;
  };
  backgroundImage: ImageSourcePropType;
  textGlow: TextGlow;
};

export const fonts = {
  heading: "IrishGrover_400Regular",
  body: "Montserrat_400Regular",
  bodyBold: "Montserrat_600SemiBold",
};

// Brand styles that look the same in light and dark mode
export const brand = {
  color: "#eef3ff",
  glow: {
    textShadowColor: "#4991FD",
    textShadowOffset: { width: 2, height: 2 }, // 0,0 = glow around the text, not a drop shadow
    textShadowRadius: 20,
  } satisfies TextStyle,
};

export const lightTheme: Theme = {
  colors: {
    text: "#ee94fa",
    textMuted: "#5e4b73",
    background: "#fdf6ec",
    accent: "#d98c3f",
    surface: "rgba(255, 243, 177, 0.8)",
    border: "#E2AF21",
  },
  backgroundImage: require("../../assets/images/backgrounds/day-bg-mob.png"),
  textGlow: {
    textShadowColor: "#4991FD",
    textShadowOffset: { width: 2, height: 2 }, // 0,0 = glow around the text, not a drop shadow
    textShadowRadius: 12,
  },
};

export const darkTheme: Theme = {
  colors: {
    text: "#E9F6FF",
    textMuted: "#c9bfe0",
    background: "#141029",
    accent: "#f2c46d",
    surface: "rgba(25, 27, 43, 0.8)",
    border: "#E2AF21",
  },
  backgroundImage: require("../../assets/images/backgrounds/night-bg-mob.png"),
  textGlow: {
    textShadowColor: "#4991FD",
    textShadowOffset: { width: 2, height: 2 }, // 0,0 = glow around the text, not a drop shadow
    textShadowRadius: 12,
  },
};
