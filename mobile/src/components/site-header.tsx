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
  showNav: boolean; // show the menu under the title (wide screens only)
  isWide: boolean;
};

export function SiteHeader({ showNav, isWide }: Props) {
  const insets = useSafeAreaInsets();

  const theme = useTheme();
  const rem = useRem();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  // Phones: at least 58 for the look, more if the status bar or camera needs it.
  // Tablet and web: the panel already has its own padding.
  const paddingTop = isWide ? 0 : insets.top + 8;

  // Scale the title with the screen width, but never above 84
  const titleSize = Math.min(rem(3.5), width / 8.5);

  return (
    <View style={[styles.header, { paddingTop, gap: isWide ? 0 : 8 }]}>
      {!isWide && (
        // Its own row, so the toggle can sit on the right while the title stays centered
        <View style={styles.toggleRow}>
          <ThemeToggle />
        </View>
      )}
      {/* The title also works as a link back to the start page */}
      <Pressable onPress={() => router.navigate("/")}>
        <Text
          style={[styles.title, { fontSize: titleSize }, theme.title]}
          numberOfLines={1}
        >
          Dagens saga
        </Text>
      </Pressable>

      {showNav && (
        <View style={styles.nav}>
          {navItems.map((item) => {
            const active = isNavItemActive(item.href, pathname);
            return (
              <Pressable
                key={item.href}
                onPress={() => router.navigate(item.href)}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    /* paddingTop: 58, */
    paddingBottom: 16,
  },
  title: {
    fontFamily: fonts.heading,
    textAlign: "center",
  },
  nav: {
    flexDirection: "row", // menu items side by side
    gap: 20,
    marginTop: 16,
  },
  navItem: {
    fontFamily: fonts.heading,
  },
  navItemActive: {
    textDecorationLine: "underline",
  },
  pill: {
    paddingVertical: 10,
    borderRadius: 999, // fully rounded ends
  },
  pillText: {
    fontFamily: fonts.heading,
  },
  toggleRow: { alignSelf: "stretch", alignItems: "flex-end", paddingRight: 16 },
});
