import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  body: string;
};

// Shows a story body for young readers:
// a blank line starts a new paragraph, a single line break starts a new line
// (for example a new line of dialogue) inside the same paragraph
export function StoryText({ body }: Props) {
  const theme = useTheme();
  const paragraphs = body.split(/\n\s*\n/);

  return (
    <>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <View key={paragraphIndex} style={styles.paragraph}>
          {paragraph
            .trim()
            .split("\n")
            .map((line, lineIndex) => (
              <Text
                key={lineIndex}
                style={[styles.line, { color: theme.colors.text }]}
              >
                {line.trim()}
              </Text>
            ))}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 16,
  },
  line: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 6,
  },
});
