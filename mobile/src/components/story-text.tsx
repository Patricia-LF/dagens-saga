import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";

// Exported so the page reader can estimate how much text fits on a page
export const STORY_FONT_REM = 1.125;
export const STORY_LINE_HEIGHT_REM = 1.75;
export const STORY_LINE_GAP = 6; // px below every source line (not scaled by rem)
export const STORY_PARAGRAPH_GAP_REM = 1; // space below every paragraph

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
          style={[
            styles.paragraph,
            { marginBottom: rem(STORY_PARAGRAPH_GAP_REM) },
          ]}
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
                    fontSize: rem(STORY_FONT_REM),
                    lineHeight: rem(STORY_LINE_HEIGHT_REM),
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
    marginBottom: STORY_LINE_GAP,
  },
});
