import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { getTodaysStory, Story } from "@/api/stories";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MessageBox } from "@/components/message-box";
import { StoryReader } from "@/components/story-reader";

export default function TodayScreen() {
  // undefined = loading, null = no story today, Story = today's story
  const [story, setStory] = useState<Story | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  // Fetches today's story. State is only set when the answer comes, never right away,
  // so it is safe to call from an effect.
  const fetchTodaysStory = useCallback(() => {
    getTodaysStory()
      .then(setStory)
      .catch((error) => {
        console.error(error);
        setFailed(true);
      });
  }, []);

  useEffect(() => {
    fetchTodaysStory();
  }, [fetchTodaysStory]);

  // "Försök igen": show loading again, then fetch
  const retry = () => {
    setFailed(false);
    setStory(undefined);
    fetchTodaysStory();
  };

  if (failed) {
    return (
      <MessageBox
        message="Sagorna gick inte att hämta just nu. Kolla att du är uppkopplad och försök igen."
        actionLabel="Försök igen"
        onAction={retry}
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
    <View testID="screen" style={styles.screen}>
      <ContentBox fill>
        <StoryReader key={story.id} story={story} />
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
    paddingBottom: 40,
  },
  message: {
    fontFamily: fonts.body,
    textAlign: "center",
  },
});
