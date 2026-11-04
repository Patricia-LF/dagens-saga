import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { Story } from "@/api/stories";
import { PageReader } from "@/components/page-reader";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";
import { StoryCover } from "@/components/story-cover";
import { StoryText } from "@/components/story-text";
import { useSettings } from "@/hooks/use-settings";

type Props = {
  story: Story;
  leading?: ReactNode; // shown to the left of the toggle, for example a back link
};

// Shows a story in the reading mode the reader has chosen: pages or scrolling.
// Used by both the story of the day and the archive.
export function StoryReader({ story, leading }: Props) {
  const { settings } = useSettings();

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
        <ScrollView>
          <StoryCover
            title={story.title}
            source={story.source}
            imageUrl={story.imageUrl}
          />
          <StoryText body={story.body} />
        </ScrollView>
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
});
