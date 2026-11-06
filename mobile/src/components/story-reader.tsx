import { ReactNode, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import type { Story } from "@/api/stories";
import { PageReader } from "@/components/page-reader";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";
import { StoryCover } from "@/components/story-cover";
import { StoryText } from "@/components/story-text";
import { fonts } from "@/constants/theme";
import { useRem } from "@/hooks/use-screen-size";
import { useSettings } from "@/hooks/use-settings";
import { useTheme } from "@/hooks/use-theme";

const HINT_HEIGHT = 44; // same as the arrow row in page mode

type Props = {
  story: Story;
  leading?: ReactNode; // shown to the left of the toggle, for example a back link
};

// Shows a story in the reading mode the reader has chosen: pages or scrolling.
// Used by both the story of the day and the archive.
export function StoryReader({ story, leading }: Props) {
  const theme = useTheme();
  const rem = useRem();
  const { settings } = useSettings();
  const [viewportHeight, setViewportHeight] = useState(0);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Fully visible at the top, gone after 80 px of scrolling
  const hintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [1, 0], "clamp"),
  }));

  return (
    <View testID="story-reader" style={styles.reader}>
      {/* One row on top: the leading element on the left, the toggle on the right */}
      <View style={styles.topRow}>
        {leading}
        <View style={styles.toggle}>
          <ReadingModeToggle />
        </View>
      </View>

      {settings.readingMode === "pages" ? (
        <PageReader story={story} />
      ) : (
        <View style={styles.scrollArea}>
          <Animated.ScrollView
            onScroll={onScroll}
            scrollEventThrottle={16}
            onLayout={(event) =>
              setViewportHeight(Math.round(event.nativeEvent.layout.height))
            }
          >
            {/* paddingBottom keeps the cover above the hint, centered in the same area as in page mode */}
            <View
              style={[
                styles.coverScreen,
                { minHeight: viewportHeight, paddingBottom: HINT_HEIGHT },
              ]}
            >
              <StoryCover
                title={story.title}
                source={story.source}
                imageUrl={story.imageUrl}
                availableHeight={
                  viewportHeight > 0 ? viewportHeight - HINT_HEIGHT : undefined
                }
              />
            </View>
            <StoryText body={story.body} />
          </Animated.ScrollView>

          {/* On top of the scroll view, where the arrows are in page mode */}
          <Animated.View
            pointerEvents="none"
            style={[styles.scrollHint, hintStyle]}
          >
            <Text
              style={[
                styles.scrollHintText,
                { color: theme.colors.text, fontSize: rem(1) },
              ]}
            >
              Scrolla ner för att läsa ↓
            </Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Fills the space in the content box, so the page view gets a real height
  reader: { flex: 1, minHeight: 0 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  // marginLeft: auto keeps the toggle on the right even when there is no leading element
  toggle: { marginLeft: "auto", flexShrink: 0 },
  coverScreen: { justifyContent: "center" }, // keeps the cover in the middle of the first view
  scrollArea: { flex: 1 },
  scrollHint: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: HINT_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollHintText: { fontFamily: fonts.body, textAlign: "center" },
});
