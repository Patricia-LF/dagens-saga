import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getStory, Story } from "@/api/stories";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { StoryText } from "@/components/story-text";
import { useRem } from "@/hooks/use-screen-size";

export default function StoryScreen() {
  const theme = useTheme();
  const rem = useRem();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [story, setStory] = useState<Story | null | undefined>(undefined);

  useEffect(() => {
    getStory(Number(id)).then(setStory);
  }, [id]);

  // Still loading
  if (story === undefined) return null;

  // Not found (or an error, until issue 22)
  if (story === null) {
    return (
      <View style={styles.centered}>
        <ContentBox>
          <Text
            style={[
              styles.message,
              { color: theme.colors.text, fontSize: rem(1.125) },
            ]}
          >
            Den här sagan finns inte.
          </Text>
          <Pressable
            onPress={() => router.navigate("/library")}
            style={styles.backButton}
          >
            <Text
              style={[
                styles.backText,
                { color: theme.colors.text, fontSize: rem(1) },
              ]}
            >
              ← Tillbaka till biblioteket
            </Text>
          </Pressable>
        </ContentBox>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ContentBox title={story.title} fill>
        <Pressable
          onPress={() => router.navigate("/library")}
          style={styles.backButton}
        >
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
  title: { fontFamily: fonts.heading, fontSize: 28, marginBottom: 12 },
  body: { fontFamily: fonts.body, fontSize: 18, lineHeight: 28 },
  backButton: {
    alignSelf: "flex-start", // only as wide as the text, aligned to the left
    paddingVertical: 8, // larger tap area for small fingers
    marginBottom: 8,
  },
  backText: {
    fontFamily: fonts.bodyBold,
    /* fontSize: 16, */
  },
  centered: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  message: {
    fontFamily: fonts.body,
    textAlign: "center",
  },
});
