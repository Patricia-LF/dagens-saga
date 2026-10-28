import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getStory, type Story } from "@/api/stories";
import { ContentBox } from "@/components/content-box";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MessageBox } from "@/components/message-box";
import { StoryText } from "@/components/story-text";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";

export default function StoryScreen() {
  const theme = useTheme();
  const rem = useRem();
  const { id } = useLocalSearchParams<{ id: string }>();

  // undefined = loading, null = not found, Story = the story
  const [story, setStory] = useState<Story | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    setStory(undefined); // show the loading state again when retrying
    getStory(Number(id))
      .then(setStory)
      .catch((error) => {
        console.error(error);
        setFailed(true);
      });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const goToLibrary = () => router.navigate("/library");

  if (failed) {
    return (
      <MessageBox
        message="Sagan gick inte att hämta just nu. Kolla att du är uppkopplad och försök igen."
        actionLabel="Försök igen"
        onAction={load}
      />
    );
  }

  if (story === undefined) return <LoadingIndicator />;

  if (story === null) {
    return (
      <MessageBox
        message="Den här sagan finns inte."
        actionLabel="Till biblioteket"
        onAction={goToLibrary}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ContentBox title={story.title} fill>
        <Pressable onPress={goToLibrary} style={styles.backButton}>
          <Text
            style={[
              styles.backText,
              { color: theme.colors.text, fontSize: rem(1) },
            ]}
          >
            ← Tillbaka till biblioteket
          </Text>
        </Pressable>
        <ScrollView>
          <StoryText body={story.body} />
        </ScrollView>
      </ContentBox>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, flexShrink: 1, paddingBottom: 10 },
  backButton: {
    alignSelf: "flex-start", // only as wide as the text, aligned to the left
    paddingVertical: 8, // larger tap area for small fingers
    marginBottom: 8,
  },
  backText: {
    fontFamily: fonts.bodyBold,
  },
});
