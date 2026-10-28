// src/app/library.tsx
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { getArchive, type StorySummary } from "@/api/stories";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";
import { formatStoryDate, todayInStockholm } from "@/utils/dates";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MessageBox } from "@/components/message-box";

export default function LibraryScreen() {
  const theme = useTheme();
  const rem = useRem();
  const today = todayInStockholm();

  // undefined = loading, [] = no stories yet, otherwise the list
  const [stories, setStories] = useState<StorySummary[] | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    setStories(undefined);
    getArchive()
      .then(setStories)
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
        message="Biblioteket gick inte att hämta just nu. Kolla att du är uppkopplad och försök igen."
        actionLabel="Försök igen"
        onAction={load}
      />
    );
  }

  if (stories === undefined) return <LoadingIndicator />;

  if (stories.length === 0) {
    return (
      <MessageBox message="Det finns inga sagor i biblioteket än. Snart kommer den första!" />
    );
  }

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
