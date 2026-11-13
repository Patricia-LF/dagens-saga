import { Image, StyleSheet, Text, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem, useScreenSize } from "@/hooks/use-screen-size";
import { FloatingView } from "@/components/floating-view";

// Decorative fairies on the start page (change the file names to yours)
/* const FAIRY_LEFT_UP = require("@/assets/images/fairies/fairy-1-left-up.png");
const FAIRY_LEFT_DOWN = require("@/assets/images/fairies/fairy-2-left-down.png");
const FAIRY_RIGHT_UP = require("@/assets/images/fairies/fairy-1-right-up.png");
const FAIRY_RIGHT_DOWN = require("@/assets/images/fairies/fairy-2-right-down.png"); */

export default function StartScreen() {
  const theme = useTheme();
  const rem = useRem();

  const screenSize = useScreenSize();
  const isTablet = screenSize === "tablet";
  const fairyInset = screenSize === "mobile" ? rem(1) : rem(0.1);

  return (
    <View
      style={[
        styles.screen, // all sizes
        !isTablet && styles.screenCentered, // phone and desktop
        isTablet && styles.screenTablet, // only tablet
      ]}
    >
      <View>
        <ContentBox>
          <Text
            style={[
              styles.text,
              styles.paragraph,
              {
                color: theme.colors.text,
                fontSize: rem(1.125),
                lineHeight: rem(1.75),
              },
            ]}
          >
            🌈 Välkommen till <Text style={styles.bold}>Sagolandet</Text>! Här
            hittar du en ny saga varje dag - fylld med äventyr, vänskap och
            magi.
          </Text>

          <Text
            style={[
              styles.text,
              {
                color: theme.colors.text,
                fontSize: rem(1.125),
                lineHeight: rem(1.75),
              },
            ]}
          >
            Tryck på Dagens för att läsa dagens saga, eller besök Biblioteket
            för att hitta äldre sagor.
          </Text>
        </ContentBox>
        <FloatingView
          distance={12}
          distanceX={8}
          duration={1000}
          durationX={1700}
          style={[styles.fairy, { top: -rem(1.5), left: fairyInset }]}
        >
          <Image
            source={theme.fairies.topLeft}
            style={{ width: rem(4), height: rem(4) }}
            resizeMode="contain"
            accessible={false}
          />
        </FloatingView>
        <FloatingView
          delay={800}
          distance={10}
          distanceX={12}
          duration={1400}
          durationX={2100}
          style={[styles.fairy, { top: -rem(1.5), right: fairyInset }]}
        >
          <Image
            source={theme.fairies.topRight}
            style={{ width: rem(4), height: rem(4) }}
            resizeMode="contain"
            accessible={false}
          />
        </FloatingView>
        <FloatingView
          delay={600}
          distance={14}
          distanceX={10}
          duration={1600}
          durationX={2400}
          style={[styles.fairy, { bottom: -rem(1.5), left: fairyInset }]}
        >
          <Image
            source={theme.fairies.bottomLeft}
            style={{ width: rem(4), height: rem(4) }}
            resizeMode="contain"
            accessible={false}
          />
        </FloatingView>
        <FloatingView
          distance={16}
          distanceX={14}
          duration={1200}
          durationX={1400}
          style={[styles.fairy, { bottom: -rem(1.5), right: fairyInset }]}
        >
          <Image
            source={theme.fairies.bottomRight}
            style={{ width: rem(4), height: rem(4) }}
            resizeMode="contain"
            accessible={false}
          />
        </FloatingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  // Phone and desktop: the box a bit above the middle of the free space
  screenCentered: { justifyContent: "center", paddingBottom: 140 },
  screenTablet: { marginTop: 60, paddingBottom: 20 },
  text: {
    fontFamily: fonts.body,
    textAlign: "center",
  },
  bold: {
    fontFamily: fonts.bodyBold,
  },
  paragraph: {
    marginBottom: 16, // space between paragraphs
  },
  fairy: {
    position: "absolute",
    pointerEvents: "none", // taps go through to whatever is underneath
  },
});
