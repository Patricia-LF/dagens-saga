import { useFonts } from "expo-font";
import { IrishGrover_400Regular } from "@expo-google-fonts/irish-grover";
import {
  ComicNeue_400Regular,
  ComicNeue_700Bold,
} from "@expo-google-fonts/comic-neue";
import * as SplashScreen from "expo-splash-screen";
import { Slot, usePathname } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View, Platform } from "react-native";
import { SiteHeader } from "@/components/site-header";
import { useTheme } from "@/hooks/use-theme";
import { SettingsProvider, useSettings } from "@/hooks/use-settings";
import { BottomNav } from "@/components/bottom-nav";
import { useBackgroundShape, useScreenSize } from "@/hooks/use-screen-size";
import { ThemeToggle } from "@/components/theme-toggle";

// Keep the splash screen visible until the fonts and settings are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  );
}

function AppShell() {
  const theme = useTheme(); // the active theme (light or dark)
  const screenSize = useScreenSize();
  const backgroundShape = useBackgroundShape();
  const isWide = screenSize !== "mobile";
  const isWeb = Platform.OS === "web";
  // Bottom nav everywhere except on desktop-sized web windows
  const showBottomNav = !isWeb || screenSize !== "desktop";

  const [fontsLoaded] = useFonts({
    IrishGrover_400Regular,
    ComicNeue_400Regular,
    ComicNeue_700Bold,
  });

  // Wait for the saved settings too, so the reading mode doesn't jump at start
  const { loaded: settingsLoaded } = useSettings();
  const ready = fontsLoaded && settingsLoaded;

  // The reading screens need the panel to fill the height, so the page view gets a height
  const pathname = usePathname();
  const readingFillsHeight =
    pathname === "/today" || pathname.startsWith("/story");

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <View style={styles.root}>
      {/* Background: direct child of root, so it always fills the whole screen */}
      <Image
        source={theme.backgroundImages[backgroundShape]}
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
        resizeMode="cover"
      />

      {/* Side margin only around the panel, so the bottom nav can still reach the edges */}
      <View testID="main" style={[styles.main, isWide && styles.mainWide]}>
        <View
          testID="panel"
          style={[
            isWide ? styles.panel : styles.content,
            isWide && { backgroundColor: theme.colors.panel },
            isWide && readingFillsHeight && styles.panelFill,
          ]}
        >
          <SiteHeader showNav={!showBottomNav} isWide={isWide} />
          <View style={styles.page}>
            <Slot />
          </View>
        </View>
      </View>

      {showBottomNav && <BottomNav />}
      <ThemeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  main: { flex: 1 }, // takes the space above the bottom nav
  mainWide: { paddingHorizontal: 24 }, // keeps the panel away from the screen edges
  content: { flex: 1 },
  panel: {
    flexShrink: 1,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: 32,
    padding: 32,
  },
  // Without flexGrow the panel is only as tall as its content (on web, the height
  // is not passed down), so a child with flex: 1 would end up 0 px tall
  panelFill: { flexGrow: 1 },
  page: { flexGrow: 1, flexShrink: 1 },
});
