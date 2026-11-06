import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getTodaysStory, Story } from "@/api/stories";
import { useRem } from "@/hooks/use-screen-size";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MessageBox } from "@/components/message-box";
import { StoryReader } from "@/components/story-reader";

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
