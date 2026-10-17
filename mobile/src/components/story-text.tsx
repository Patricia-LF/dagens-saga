import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";

type Props = {
  body: string;
};

// Shows a story body for young readers:
// a blank line starts a new paragraph, a single line break starts a new line
// (for example a new line of dialogue) inside the same paragraph
export function StoryText({ body }: Props) {
  const theme = useTheme();
  const rem = useRem();
  const paragraphs = body.split(/\n\s*\n/);

  return (
    <>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <View
          key={paragraphIndex}
          style={[styles.paragraph, { marginBottom: rem(1) }]}
        >
          {paragraph
            .trim()
            .split("\n")
            .map((line, lineIndex) => (
              <Text
                key={lineIndex}
                style={[
                  styles.line,
                  {
                    color: theme.colors.text,
                    fontSize: rem(1.125),
                    lineHeight: rem(1.75),
                  },
                ]}
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
  paragraph: {},
  line: {
    fontFamily: fonts.body,
    marginBottom: 6,
  },
});
