// src/components/animated-title.tsx
import { StyleProp, Text, TextStyle, View } from "react-native";
import Animated, {
  FadeInDown,
  useReducedMotion,
} from "react-native-reanimated";

type Props = { title: string; style?: StyleProp<TextStyle> };

export const LETTER_DELAY = 40; // ms between each letter

// The title's letters fly in one by one, then stay still
export function AnimatedTitle({ title, style }: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <Text style={style} accessibilityRole="header">
        {title}
      </Text>
    );
  }

  // Each word is its own row, so long titles still wrap between words, not inside them
  let index = 0;
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={title} // screen readers read the whole title, not letter by letter
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {title.split(" ").map((word, w, words) => (
        <View key={w} style={{ flexDirection: "row" }}>
          {/* A space after every word except the last, so the title stays centered */}
          {[...word, ...(w < words.length - 1 ? [" "] : [])].map((char, c) => (
            <Animated.Text
              key={c}
              entering={FadeInDown.delay(index++ * LETTER_DELAY).springify()}
              style={style}
            >
              {char}
            </Animated.Text>
          ))}
        </View>
      ))}
    </View>
  );
}
