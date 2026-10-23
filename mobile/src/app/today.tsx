import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getTodaysStory, Story } from "@/api/stories";
import { StoryText } from "@/components/story-text";
import { useRem } from "@/hooks/use-screen-size";

export default function TodayScreen() {
  const theme = useTheme();
  const rem = useRem();

  // undefined = still loading, null = no story today, Story = today's story
  const [story, setStory] = useState<Story | null | undefined>(undefined);

  useEffect(() => {
    getTodaysStory()
      .then(setStory)
      .catch((error) => {
        console.error(error);
        setStory(null); // show the "no story" state for now; issue 22 adds a real error state
      });
  }, []);

  // Still loading
  if (story === undefined) return null;

  // No story scheduled for today
  if (story === null) {
    return (
      <View style={styles.centered}>
        <ContentBox>
          <Text
            style={[
              styles.message,
              {
                color: theme.colors.text,
                fontSize: rem(1.125),
                lineHeight: rem(1.75),
              },
            ]}
          >
            Ingen saga publicerad idag ännu. Kika gärna i biblioteket!
          </Text>
        </ContentBox>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ContentBox title={story.title} fill>
        <ScrollView>
          <StoryText body={story.body} />
        </ScrollView>
      </ContentBox>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    flexShrink: 1,
    paddingBottom: 8,
  },
  centered: {
    flexGrow: 1,
    flexShrink: 1,
    /* justifyContent: "center", */
    paddingBottom: 40,
  },
  message: {
    fontFamily: fonts.body,
    /*  fontSize: 18, */
    textAlign: "center",
  },
});
