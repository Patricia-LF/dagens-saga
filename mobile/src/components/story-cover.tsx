import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";
import { AnimatedTitle, LETTER_DELAY } from "@/components/animated-title";
import { FloatingView } from "@/components/floating-view";
import { Sparkles } from "@/components/sparkles";

export const DEFAULT_COVER = require("@/assets/images/covers/default-cover.jpg");

// Spacing on the cover. Used both in the styles and in the image size calculation,
// so the two always match.
const TITLE_GAP = 20; // below the title
const IMAGE_GAP = 10; // above the image
const BYLINE_GAP_TOP = 10;
const BYLINE_GAP_BOTTOM = 40;
const FLOAT_DISTANCE = 6; // FloatingView moves the image up this much
const SAFETY = 4; // px, covers rounding in the measured heights
const TEXT_MARGINS =
  TITLE_GAP +
  IMAGE_GAP +
  BYLINE_GAP_TOP +
  BYLINE_GAP_BOTTOM +
  FLOAT_DISTANCE +
  SAFETY;

type Props = {
  title: string;
  source: "ai" | "handwritten";
  imageUrl: string | null;
  availableHeight?: number; // px for the whole cover, so it fits without scrolling
};

export function StoryCover({
  title,
  source,
  imageUrl,
  availableHeight,
}: Props) {
  const theme = useTheme();
  const rem = useRem();
  const [titleHeight, setTitleHeight] = useState(0);
  const [bylineHeight, setBylineHeight] = useState(0);

  // Hidden until the title, byline and available height are measured,
  // so the image doesn't show at full size first and then shrink
  const measured =
    availableHeight !== undefined && titleHeight > 0 && bylineHeight > 0;

  // The image gets the height that is left after the title and byline. It is square,
  // so that also limits its width. Before anything is measured it uses the normal size.
  const imageMaxSize = measured
    ? Math.min(
        rem(20),
        Math.max(
          120,
          availableHeight - titleHeight - bylineHeight - TEXT_MARGINS,
        ),
      )
    : rem(20);
  const imageSource = imageUrl ? { uri: imageUrl } : DEFAULT_COVER;
  const byline =
    source === "ai" ? "Skriven av Sagolandets AI" : "Skriven av Patricia";

  return (
    <View style={[styles.cover, { opacity: measured ? 1 : 0 }]}>
      <View
        style={styles.titleWrapper}
        onLayout={(e) => setTitleHeight(e.nativeEvent.layout.height)}
      >
        <AnimatedTitle
          title={title}
          style={[
            styles.title,
            { color: theme.colors.text, fontSize: rem(1.75) },
          ]}
        />
        <Sparkles count={20} spread={title.length * LETTER_DELAY} sweep />
      </View>

      <FloatingView distance={FLOAT_DISTANCE}>
        {/* Both limits, since aspectRatio computes the height before maxWidth shrinks the width */}
        <View
          style={[
            styles.imageFrame,
            { maxWidth: imageMaxSize, maxHeight: imageMaxSize },
          ]}
        >
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </View>
      </FloatingView>

      <Text
        onLayout={(e) => setBylineHeight(e.nativeEvent.layout.height)}
        style={[styles.byline, { color: theme.colors.text, fontSize: rem(1) }]}
      >
        {byline}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {},
  titleWrapper: { marginBottom: TITLE_GAP }, // on the wrapper, not on every letter
  title: { fontFamily: fonts.heading, textAlign: "center" },
  byline: {
    fontFamily: fonts.body,
    textAlign: "center",
    marginTop: BYLINE_GAP_TOP,
    marginBottom: BYLINE_GAP_BOTTOM,
  },
  imageFrame: {
    width: "90%",
    aspectRatio: 1, // square; use 4 / 3 if your images are 4:3
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden", // clips the image to the rounded corners
    marginTop: IMAGE_GAP,
  },
  image: {
    width: "100%",
    height: "100%", // fill the frame exactly, whatever size the file is
  },
});
