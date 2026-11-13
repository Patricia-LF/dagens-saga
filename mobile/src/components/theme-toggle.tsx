// src/components/theme-toggle.tsx
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSettings } from "@/hooks/use-settings";
import { useTheme, useThemeMode } from "@/hooks/use-theme";

const TRACK_WIDTH = 72;
const TRACK_HEIGHT = 40;
const KNOB_SIZE = 32;
const PADDING = (TRACK_HEIGHT - KNOB_SIZE) / 2;
const TRAVEL = TRACK_WIDTH - KNOB_SIZE - PADDING * 2; // how far the knob moves

// Day/night switch in the top right corner. The knob slides and the sun fades into the moon.
export function ThemeToggle() {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const { setThemeMode } = useSettings();
  const reduceMotion = useReducedMotion();
  const isDark = mode === "dark";

  // 0 = day (knob on the left), 1 = night (knob on the right)
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    const target = isDark ? 1 : 0;
    progress.value = reduceMotion
      ? target
      : withTiming(target, { duration: 250 });
  }, [isDark, reduceMotion, progress]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRAVEL }],
  }));
  const sunStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const moonStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Pressable
      onPress={() => setThemeMode(isDark ? "light" : "dark")}
      accessibilityRole="switch"
      accessibilityLabel="Nattläge"
      accessibilityState={{ checked: isDark }}
      hitSlop={8}
      style={[styles.track, { backgroundColor: theme.colors.pill }]}
    >
      <Animated.View
        style={[
          styles.knob,
          { backgroundColor: theme.colors.toggle },
          knobStyle,
        ]}
      >
        <Animated.Image
          source={theme.themeIcons.sun}
          style={[styles.icon, sunStyle]}
        />
        <Animated.Image
          source={theme.themeIcons.moon}
          style={[styles.icon, moonStyle]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: PADDING,
  },
  floating: { position: "absolute", right: 16, zIndex: 10 },
  inFlow: { alignSelf: "flex-end", marginRight: 16 }, // on the right, above the title
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  // Both icons sit on top of each other inside the knob
  icon: {
    position: "absolute",
    width: 22,
    height: 22,
  },
});
