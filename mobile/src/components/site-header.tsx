import { router, usePathname } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { fonts } from "@/constants/theme";
import { navItems, isNavItemActive } from "@/constants/nav";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeToggle } from "@/components/theme-toggle";

type Props = {
  showNav: boolean; // show the menu in the bar (desktop only)
  isWide: boolean;
  layout?: "stacked" | "bar"; // bar: title left, menu and toggle right (desktop)
};

export function SiteHeader({ showNav, isWide, layout = "stacked" }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const rem = useRem();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const isBar = layout === "bar";

  // Phones: below the status bar. Tablet and desktop: the panel or the bar has its own spacing.
  const paddingTop = isBar ? 16 : isWide ? 0 : insets.top + 8;

  // Scale the title with the screen width, but never above 84
  const titleSize = isBar ? rem(2.25) : Math.min(rem(3.5), width / 8.5);

  // The menu pills, used in the bar on desktop
  const navPills = (
    <View style={styles.nav}>
      {navItems.map((item) => {
        const active = isNavItemActive(item.href, pathname);
        return (
          <Pressable
            key={item.href}
            onPress={() => router.navigate(item.href)}
            accessibilityRole="link"
            accessibilityState={{ selected: active }}
            style={[
              styles.pill,
              {
                backgroundColor: theme.colors.pill,
                paddingHorizontal: rem(1.375),
              },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                { color: theme.colors.pillText, fontSize: rem(1.125) },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.header, isBar && styles.bar, { paddingTop }]}>
      {/* Phones: the toggle on its own row above the title */}
      {!isWide && (
        <View style={styles.toggleRow}>
          <ThemeToggle />
        </View>
      )}
      {/* Left: the title */}
      <View style={isBar && styles.barSide}>
        {/* The title also works as a link back to the start page */}
        <Pressable onPress={() => router.navigate("/")}>
          <Text
            style={[styles.title, { fontSize: titleSize }, theme.title]}
            numberOfLines={1}
          >
            Dagens saga
          </Text>
        </Pressable>
      </View>

      {/* Desktop: Middle: the menu */}
      {isBar && showNav && navPills}

      {/* Right: the toggle */}
      {isBar && (
        <View style={[styles.barSide, styles.barEnd]}>
          <ThemeToggle />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingBottom: 16,
  },
  title: {
    fontFamily: fonts.heading,
    /* textAlign: "center", */
  },
  nav: {
    flexDirection: "row", // menu items side by side
    gap: 20,
    marginTop: 10,
  },
  pill: {
    paddingVertical: 10,
    borderRadius: 999, // fully rounded ends
  },
  pillText: {
    fontFamily: fonts.heading,
  },
  toggleRow: { alignSelf: "stretch", alignItems: "flex-end", paddingRight: 16 },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
  },
  barSide: { flex: 1 }, // both sides take the same width, so the menu stays in the middle
  barEnd: { alignItems: "flex-end" }, // the toggle at the right edge
});
