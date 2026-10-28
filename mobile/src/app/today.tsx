import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getTodaysStory, Story } from "@/api/stories";
import { StoryText } from "@/components/story-text";
import { useRem } from "@/hooks/use-screen-size";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MessageBox } from "@/components/message-box";

export default function TodayScreen() {
  const theme = useTheme();
  const rem = useRem();

  // undefined = loading, null = no story today, Story = today's story
  const [story, setStory] = useState<Story | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    setStory(undefined); // show the loading state again when retrying
    getTodaysStory()
      .then(setStory)
      .catch((error) => {
        console.error(error);
        setFailed(true);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (failed) {
    return (
      <MessageBox
        message="Sagorna gick inte att hämta just nu. Kolla att du är uppkopplad och försök igen."
        actionLabel="Försök igen"
        onAction={load}
      />
    );
  }

  // Still loading
  if (story === undefined) return <LoadingIndicator />;

  // No story scheduled for today
  if (story === null) {
    return (
      <MessageBox message="Ingen saga publicerad idag ännu. Kika gärna i biblioteket!" />
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
