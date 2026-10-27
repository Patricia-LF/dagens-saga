// src/app/library.tsx
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { getArchive, type StorySummary } from "@/api/stories";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";
import { formatStoryDate, todayInStockholm } from "@/utils/dates";

export default function LibraryScreen() {
  const theme = useTheme();
  const rem = useRem();
  const [stories, setStories] = useState<StorySummary[]>([]);
  const today = todayInStockholm();

  useEffect(() => {
    getArchive()
      .then(setStories)
      .catch((error) => {
        console.error(error);
        setStories([]); // issue 22 adds a real error state
      });
  }, []);

  return (
    <View style={styles.screen}>
      <ContentBox fill>
        <FlatList
          data={stories}
          keyExtractor={(story) => String(story.id)}
          renderItem={({ item }) => {
            const isToday = item.scheduledDate === today;
            return (
              <Pressable
                onPress={() => router.push(`/story/${item.id}`)}
                style={styles.item}
              >
                <Text
                  style={[
                    styles.date,
                    {
                      color: theme.colors.toggleText,
                      fontSize: rem(1),
                      lineHeight: rem(1.5),
                    },
                    isToday && styles.today,
                  ]}
                  numberOfLines={1}
                >
                  {isToday ? "I dag" : formatStoryDate(item.scheduledDate)}
                </Text>
                <Text
                  style={[
                    styles.title,
                    { color: theme.colors.text, fontSize: rem(1.25) },
                  ]}
                >
                  {item.title}
                </Text>
              </Pressable>
            );
          }}
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
    marginTop: 4,
    /* fontSize: 20, */
  },
  date: {
    fontFamily: fonts.body,
    marginBottom: 2,
  },
  today: {
    fontFamily: fonts.bodyBold,
  },
});
