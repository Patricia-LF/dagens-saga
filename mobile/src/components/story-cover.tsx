import { Image, StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";
import { AnimatedTitle } from "./animated-title";
import { FloatingView } from "@/components/floating-view";

const DEFAULT_COVER = require("@/assets/images/covers/default-cover.jpg");

type Props = {
  title: string;
  source: "ai" | "handwritten";
  imageUrl: string | null;
};

export function StoryCover({ title, source, imageUrl }: Props) {
  const theme = useTheme();
  const rem = useRem();
  const imageSource = imageUrl ? { uri: imageUrl } : DEFAULT_COVER;
  const byline =
    source === "ai" ? "Skriven av Sagolandets AI" : "Skriven av Patricia";

  return (
    <View style={styles.cover}>
      <View style={styles.titleWrapper}>
        <AnimatedTitle
          title={title}
          style={[
            styles.title,
            { color: theme.colors.text, fontSize: rem(1.75) },
          ]}
        />
      </View>

      <FloatingView>
        <View style={[styles.imageFrame, { maxWidth: rem(20) }]}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </View>
      </FloatingView>

      <Text
        style={[styles.byline, { color: theme.colors.text, fontSize: rem(1) }]}
      >
        {byline}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {},
  titleWrapper: { marginBottom: 20 }, // on the wrapper, not on every letter
  title: { fontFamily: fonts.heading, textAlign: "center" },
  byline: { fontFamily: fonts.body, textAlign: "center", margin: 10 },
  imageFrame: {
    width: "90%",
    aspectRatio: 1, // square; use 4 / 3 if your images are 4:3
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden", // clips the image to the rounded corners
  },
  image: {
    width: "100%",
    height: "100%", // fill the frame exactly, whatever size the file is
  },
});
