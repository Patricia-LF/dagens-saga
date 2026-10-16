import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getTodaysStory, Story } from "@/api/stories";
import { StoryText } from "@/components/story-text";

export default function TodayScreen() {
  const theme = useTheme();

  // undefined = still loading, null = no story today, Story = today's story
  const [story, setStory] = useState<Story | null | undefined>(undefined);

  useEffect(() => {
    getTodaysStory().then(setStory);
  }, []);

  // Still loading
  if (story === undefined) return null;

  // No story scheduled for today
  if (story === null) {
    return (
      <View style={styles.centered}>
        <ContentBox>
          <Text style={[styles.message, { color: theme.colors.text }]}>
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
    flex: 1,
    paddingBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 18,
    textAlign: "center",
  },
});
