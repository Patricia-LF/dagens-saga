// src/app/library.tsx
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { getArchive, type StorySummary } from "@/api/stories";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";
import { formatStoryDate, todayInStockholm } from "@/utils/dates";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MessageBox } from "@/components/message-box";
import { DEFAULT_COVER } from "@/components/story-cover";
import { useSettings } from "@/hooks/use-settings";

type LibraryFilter = "all" | "favorites";

export default function LibraryScreen() {
  const theme = useTheme();
  const rem = useRem();
  const today = todayInStockholm();
  const { settings } = useSettings();
  const [filter, setFilter] = useState<LibraryFilter>("all");

  const filterOptions = [
    {
      value: "all",
      label: "Alla sagor",
      on: theme.themeIcons.allOn,
      off: theme.themeIcons.allOff,
    },
    {
      value: "favorites",
      label: "Favoriter",
      on: theme.themeIcons.favoritesOn,
      off: theme.themeIcons.favoritesOff,
    },
  ] as const;

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

  const visibleStories =
    filter === "favorites"
      ? stories.filter((story) => settings.favorites.includes(story.id))
      : stories;

  return (
    <View style={styles.screen}>
      <ContentBox fill>
        <View style={styles.filterRow}>
          <Text
            accessibilityRole="header"
            style={[
              styles.heading,
              { color: theme.colors.text, fontSize: rem(1.5) },
            ]}
          >
            {filter === "favorites" ? "Mina favoriter" : "Alla sagor"}
          </Text>

          {/* The filter buttons, grouped so they stay together on the right */}
          <View style={styles.filterButtons}>
            {filterOptions.map((option) => {
              const selected = filter === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setFilter(option.value)}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected }}
                  style={styles.filterButton}
                >
                  <Image
                    source={selected ? option.on : option.off}
                    style={{ width: rem(2.25), height: rem(2.25) }}
                    accessible={false}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {visibleStories.length === 0 ? (
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.text, fontSize: rem(1.125) },
            ]}
          >
            Du har inga favoriter än. Tryck på stjärnan när du läser en saga du
            gillar!
          </Text>
        ) : (
          <FlatList
            data={visibleStories}
            keyExtractor={(story) => String(story.id)}
            renderItem={({ item }) => {
              const isToday = item.scheduledDate === today;
              const dateLabel = isToday
                ? "I dag"
                : formatStoryDate(item.scheduledDate);
              const isFavorite = settings.favorites.includes(item.id);
              return (
                <Pressable
                  onPress={() => router.push(`/story/${item.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}, ${dateLabel}${isFavorite ? ", favorit" : ""}`}
                  style={[styles.item, { paddingVertical: rem(0.75) }]}
                >
                  <Image
                    source={
                      item.imageUrl ? { uri: item.imageUrl } : DEFAULT_COVER
                    }
                    style={[
                      styles.thumbnail,
                      { width: rem(6), height: rem(6) },
                    ]}
                    accessible={false} // decorative, the title says which story it is
                  />

                  <View style={styles.itemText}>
                    {/* The date and the star side by side */}
                    <View style={styles.dateRow}>
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
                        {dateLabel}
                      </Text>
                      {isFavorite && (
                        <Image
                          source={theme.themeIcons.starFilled}
                          style={{ width: rem(1.25), height: rem(1.25) }}
                          accessible={false}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.title,
                        { color: theme.colors.text, fontSize: rem(1.25) },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        )}
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
  item: { flexDirection: "row", alignItems: "center", gap: 12 },
  thumbnail: { borderRadius: 8 },
  itemText: { flex: 1 }, // takes the rest of the width, so long titles wrap
  title: {
    fontFamily: fonts.bodyBold,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  date: { fontFamily: fonts.body },
  today: {
    fontFamily: fonts.bodyBold,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filterButtons: { flexDirection: "row", gap: 8 },
  filterButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: { fontFamily: fonts.heading, flexShrink: 1 },
  emptyText: { fontFamily: fonts.body, textAlign: "center", marginTop: 24 },
});
