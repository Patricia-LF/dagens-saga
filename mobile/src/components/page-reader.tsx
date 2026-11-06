import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  PixelRatio,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import type { Story } from "@/api/stories";
import { StoryCover } from "@/components/story-cover";
import {
  STORY_FONT_REM,
  STORY_LINE_GAP,
  STORY_LINE_HEIGHT_REM,
  STORY_PARAGRAPH_GAP_REM,
  StoryText,
} from "@/components/story-text";
import { fonts } from "@/constants/theme";
import { useRem } from "@/hooks/use-screen-size";
import { useTheme } from "@/hooks/use-theme";
import { estimatePageLayout } from "@/utils/estimate-page-layout";
import { splitIntoPages } from "@/utils/split-into-pages";

// FlatList needs this to stay the same between renders, so it lives outside the component
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };

type Page = { kind: "cover" } | { kind: "text"; text: string };

type Props = {
  story: Story;
};

// Shows a story one page at a time: the cover first, then the text split into pages
export function PageReader({ story }: Props) {
  const theme = useTheme();
  const rem = useRem();

  const listRef = useRef<FlatList<Page>>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [currentPage, setCurrentPage] = useState(0);

  // Also must stay the same between renders (useCallback with no dependencies)
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) setCurrentPage(first.index);
    },
    [],
  );

  // How much text fits on a page, from the measured page size and the real text size.
  // The page, its ScrollView and StoryText have no padding, so the text can use the
  // whole page. (If padding is added to any of them, subtract it from width and height.)
  // The font scale is the phone's text size setting (always 1 on the web). It scales the
  // text, but not the margins.
  const fontScale = PixelRatio.getFontScale();
  const lineHeight = rem(STORY_LINE_HEIGHT_REM) * fontScale;
  const paragraphGap = rem(STORY_PARAGRAPH_GAP_REM);
  const { charsPerLine, pageHeight } = estimatePageLayout(
    size.width,
    size.height,
    rem(STORY_FONT_REM) * fontScale,
    lineHeight,
  );

  // Only split again when the story or the page layout changes
  const pages = useMemo<Page[]>(
    () => [
      { kind: "cover" },
      ...splitIntoPages(story.body, {
        charsPerLine,
        pageHeight,
        lineHeight,
        lineGap: STORY_LINE_GAP,
        paragraphGap,
      }).map((text): Page => ({ kind: "text", text })),
    ],
    [story.body, charsPerLine, pageHeight, lineHeight, paragraphGap],
  );
  const lastPage = pages.length - 1;
  // After a resize there can be fewer pages than before
  const page = Math.min(currentPage, lastPage);

  // Measure the container itself, not the window: the panel has padding on wide screens
  const handleLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    const height = Math.round(event.nativeEvent.layout.height);
    // Keep the old object when nothing changed, so there is no new render or split
    setSize((old) =>
      old.width === width && old.height === height ? old : { width, height },
    );
  };

  const goToPage = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
  };

  const arrowStyle = [
    styles.arrowText,
    { color: theme.colors.text, fontSize: rem(2) },
  ];

  return (
    <View testID="page-reader" style={styles.container}>
      <View style={styles.listArea} onLayout={handleLayout}>
        {size.width > 0 && size.height > 0 && (
          <FlatList
            // A new key re-creates the list when the size changes (e.g. rotating the phone)
            key={`${size.width}x${size.height}`}
            ref={listRef}
            data={pages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => String(index)}
            initialScrollIndex={page}
            getItemLayout={(_, index) => ({
              length: size.width,
              offset: size.width * index,
              index,
            })}
            viewabilityConfig={VIEWABILITY_CONFIG}
            onViewableItemsChanged={onViewableItemsChanged}
            renderItem={({ item, index }) => (
              <View
                style={{ width: size.width, height: size.height }}
                accessibilityLabel={`Sida ${index + 1} av ${pages.length}`}
              >
                {/* A page that is too long for the screen scrolls, so no text is cut off */}
                <ScrollView
                  contentContainerStyle={
                    item.kind === "cover" ? styles.coverPage : undefined
                  }
                >
                  {item.kind === "cover" ? (
                    <StoryCover
                      title={story.title}
                      source={story.source}
                      imageUrl={story.imageUrl}
                    />
                  ) : (
                    <StoryText body={item.text} />
                  )}
                </ScrollView>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.controls}>
        {/* Empty placeholders keep the page indicator centered when an arrow is hidden */}
        {page > 0 ? (
          <Pressable
            onPress={() => goToPage(page - 1)}
            accessibilityRole="button"
            accessibilityLabel="Föregående sida"
            style={styles.arrow}
          >
            <Text style={arrowStyle}>←</Text>
          </Pressable>
        ) : (
          <View style={styles.arrow} />
        )}

        <Text
          style={[
            styles.indicator,
            { color: theme.colors.text, fontSize: rem(1) },
          ]}
        >
          Sida {page + 1} av {pages.length}
        </Text>

        {page < lastPage ? (
          <Pressable
            onPress={() => goToPage(page + 1)}
            accessibilityRole="button"
            accessibilityLabel="Nästa sida"
            style={styles.arrow}
          >
            <Text style={arrowStyle}>→</Text>
          </Pressable>
        ) : (
          <View style={styles.arrow} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0 },
  listArea: { flex: 1, minHeight: 0 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrow: {
    width: 56,
    height: 44, // the smallest comfortable tap area
    alignItems: "center",
    justifyContent: "center",
  },
  // No fontFamily on purpose: the system font has the arrow characters on every platform
  arrowText: {},
  indicator: { fontFamily: fonts.bodyBold },
  // flexGrow lets the content fill the page, so the cover can be centered vertically
  coverPage: { flexGrow: 1, justifyContent: "center" },
});
