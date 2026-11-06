// src/components/floating-view.tsx
import { ReactNode, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  children: ReactNode;
  distance?: number; // how many px it moves up
  duration?: number; // ms for one way (up or down)
  delay?: number; // ms before it starts, so several items don't move in sync
  style?: StyleProp<ViewStyle>;
};

// Moves its content slowly up and down, forever. Stands still with "reduce motion" on.
export function FloatingView({
  children,
  distance = 6,
  duration = 2000,
  delay = 0,
  style,
}: Props) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    offset.value = withDelay(
      delay,
      withRepeat(
        withTiming(-distance, { duration, easing: Easing.inOut(Easing.sin) }),
        -1, // repeat forever
        true, // go back down again instead of jumping
      ),
    );
    return () => cancelAnimation(offset);
  }, [reduceMotion, distance, duration, delay, offset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
