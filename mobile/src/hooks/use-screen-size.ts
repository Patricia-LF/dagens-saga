import { useWindowDimensions } from "react-native";
import { DESKTOP_SCREEN, WIDE_SCREEN } from "@/constants/nav";

export type ScreenSize = "mobile" | "tablet" | "desktop";

// Which layout to use, based on the current window width
export function useScreenSize(): ScreenSize {
  const { width } = useWindowDimensions();
  if (width >= DESKTOP_SCREEN) return "desktop";
  if (width >= WIDE_SCREEN) return "tablet";
  return "mobile";
}

// How much bigger the text is on each screen size (mobile = 1)
const FONT_SCALE: Record<ScreenSize, number> = {
  mobile: 1,
  tablet: 1.3,
  desktop: 1.2,
};

// Works like rem in CSS: rem(1) = 16 on mobile, and scales up on bigger screens
export function useRem() {
  const scale = FONT_SCALE[useScreenSize()];
  return (value: number) => value * 16 * scale;
}

export type BackgroundShape = "portrait" | "landscape" | "wide";

// Picks the background shape that needs the least cropping for the current window
export function useBackgroundShape(): BackgroundShape {
  const { width, height } = useWindowDimensions();
  const ratio = width / height;

  if (ratio < 1) return "portrait"; // taller than wide: phone, or tablet held upright (9:16 image)
  if (ratio < 1.55) return "landscape"; // close to 4:3: tablet held sideways (4:3 image)
  return "wide"; // close to 16:9: desktop browser or phone held sideways (16:9 image)
}
