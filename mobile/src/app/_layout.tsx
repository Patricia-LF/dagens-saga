import { useFonts } from "expo-font";
import { IrishGrover_400Regular } from "@expo-google-fonts/irish-grover";
import {
  ComicNeue_400Regular,
  ComicNeue_700Bold,
} from "@expo-google-fonts/comic-neue";
import * as SplashScreen from "expo-splash-screen";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { SiteHeader } from "@/components/site-header";
import { useTheme } from "@/hooks/use-theme";
import { BottomNav } from "@/components/bottom-nav";
import { WIDE_SCREEN } from "@/constants/nav";

// Keep the splash screen visible until the fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme(); // the active theme (light or dark)
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_SCREEN;

  const [fontsLoaded] = useFonts({
    IrishGrover_400Regular,
    ComicNeue_400Regular,
    ComicNeue_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.root}>
      {/* Shared background, stays still while screens change */}
      <Image
        source={theme.backgroundImage}
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
        resizeMode="cover"
      />
      <SiteHeader showNav={isWide} />
      <View style={styles.page}>
        <Slot />
      </View>
      {!isWide && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  page: {
    flex: 1, // the current screen fills the space below the header
    paddingTop: 40, // space between the menu and the box, the same on every screen
  },
});
