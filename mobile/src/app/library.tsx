// src/app/library.tsx (same pattern for library.tsx)
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { getArchive, Story } from "@/api/stories";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";

export default function LibraryScreen() {
  const theme = useTheme();
  const rem = useRem();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    getArchive().then(setStories);
  }, []);

  return (
    <View style={styles.screen}>
      <ContentBox fill>
        <FlatList
          data={stories}
          keyExtractor={(story) => String(story.id)}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/story/${item.id}`)}
              style={styles.item}
            >
              <Text
                style={[
                  styles.title,
                  { color: theme.colors.text, fontSize: rem(1.25) },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.excerpt,
                  {
                    color: theme.colors.toggleText,
                    fontSize: rem(1.125),
                    lineHeight: rem(1.75),
                  },
                ]}
                numberOfLines={2}
              >
                {item.body}
              </Text>
            </Pressable>
          )}
        />
      </ContentBox>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    flexShrink: 1,
    paddingBottom: 10,
  },
  item: {
    paddingVertical: 12,
  },
  title: {
    fontFamily: fonts.bodyBold,
    /* fontSize: 20, */
  },
  excerpt: {
    fontFamily: fonts.body,
    /* fontSize: 18, */
    marginTop: 4,
  },
});
