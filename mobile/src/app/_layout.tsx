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
import { ThemeProvider, useTheme } from "@/hooks/use-theme";
import { BottomNav } from "@/components/bottom-nav";
import { WIDE_SCREEN } from "@/constants/nav";

// Keep the splash screen visible until the fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
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
      {/* Background: direct child of root, so it always fills the whole screen */}
      <Image
        source={theme.backgroundImage}
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
        resizeMode="cover"
      />

      <View
        style={[
          styles.content, // always: fill the height
          isWide && styles.panel, // wide screens: the panel look
          isWide && { backgroundColor: theme.colors.panel },
        ]}
      >
        <SiteHeader showNav={isWide} />
        <View style={styles.page}>
          <Slot />
        </View>
      </View>

      {!isWide && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
  panel: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: 32,
    padding: 32,
  },
  page: { flex: 1 },
});
