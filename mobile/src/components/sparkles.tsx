// src/components/sparkles.tsx
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Sparkle = { top: number; left: number; size: number; delay: number };

type Props = {
  count?: number; // how many sparkles
  startDelay?: number; // ms before the first one appears
  spread?: number; // ms over which the sparkles appear
  sweep?: boolean; // true: they appear from left to right, like the title's letters
  color?: string;
  glowColor?: string;
};

// Positions in percent and a delay for each sparkle. Made once per mount.
function makeSparkles(
  count: number,
  startDelay: number,
  spread: number,
  sweep: boolean,
): Sparkle[] {
  return Array.from({ length: count }, (_, i) => {
    // How far along the sparkle is, from 0 to 1. In order when sweeping, random otherwise.
    const progress = sweep ? (i + Math.random() * 0.5) / count : Math.random();
    return {
      top: Math.random() * 100,
      left: sweep ? progress * 100 : Math.random() * 100,
      size: 6 + Math.random() * 6,
      delay: startDelay + progress * spread,
    };
  });
}

// Small stars that twinkle once over the parent, then disappear. Decorative only.
// Small stars that twinkle once over the parent, then disappear. Decorative only.
// The colors come from the theme, unless other colors are passed in.
export function Sparkles({
  count = 8,
  startDelay = 0,
  spread = 600,
  sweep = false,
  color,
  glowColor,
}: Props) {
  const theme = useTheme();
  const starColor = color ?? theme.colors.sparkle;
  const starGlow = glowColor ?? theme.colors.sparkleGlow;
  const reduceMotion = useReducedMotion();
  const [sparkles] = useState(() =>
    makeSparkles(count, startDelay, spread, sweep),
  );

  if (reduceMotion) return null;

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessible={false}
    >
      {sparkles.map((sparkle, i) => (
        <OneSparkle
          key={i}
          sparkle={sparkle}
          color={starColor}
          glowColor={starGlow}
        />
      ))}
    </View>
  );
}

function OneSparkle({
  sparkle,
  color,
  glowColor,
}: {
  sparkle: Sparkle;
  color: string;
  glowColor: string;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // 0 → 1 (appear) → 0 (fade away)
    progress.value = withDelay(
      sparkle.delay,
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 500 }),
      ),
    );
  }, [progress, sparkle.delay]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: 0.3 + progress.value * 0.7 },
      { rotate: `${progress.value * 90}deg` },
    ],
  }));

  return (
    <Animated.Text
      style={[
        {
          position: "absolute",
          top: `${sparkle.top}%`,
          left: `${sparkle.left}%`,
          fontSize: sparkle.size,
          color,
          textShadowColor: glowColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 4,
        },
        style,
      ]}
    >
      ✦
    </Animated.Text>
  );
}
