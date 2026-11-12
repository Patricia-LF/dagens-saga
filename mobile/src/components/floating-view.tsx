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
  distanceX?: number; // how many px it moves sideways (0 = only up and down)
  durationX?: number; // ms for one way sideways. Different from duration gives a softer path
  delay?: number; // ms before it starts, so several items don't move in sync
  style?: StyleProp<ViewStyle>;
};

// Moves its content slowly up and down, forever. Stands still with "reduce motion" on.
export function FloatingView({
  children,
  distance = 6,
  duration = 2000,
  distanceX = 0,
  durationX = 2600,
  delay = 0,
  style,
}: Props) {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);
  const offsetX = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    const easing = Easing.inOut(Easing.sin);
    offset.value = withDelay(
      delay,
      withRepeat(withTiming(-distance, { duration, easing }), -1, true),
    );
    // Starts at -distanceX / 2 and moves to +distanceX / 2, so it sways around its place
    offsetX.value = -distanceX / 2;
    offsetX.value = withDelay(
      delay,
      withRepeat(
        withTiming(distanceX / 2, { duration: durationX, easing }),
        -1,
        true,
      ),
    );

    return () => {
      cancelAnimation(offset);
      cancelAnimation(offsetX);
    };
  }, [
    reduceMotion,
    distance,
    duration,
    distanceX,
    durationX,
    delay,
    offset,
    offsetX,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offset.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
