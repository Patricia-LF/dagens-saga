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

type Props = {
  showNav: boolean; // show the menu under the title (wide screens only)
};

export function SiteHeader({ showNav }: Props) {
  const theme = useTheme();
  const rem = useRem();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  // Scale the title with the screen width, but never above 84
  const titleSize = Math.min(rem(3.5), width / 8.5);

  return (
    <View style={styles.header}>
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
                style={[styles.pill, { backgroundColor: theme.colors.pill }]}
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
    paddingTop: 58,
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
    /* fontSize: 20, */
  },
  navItemActive: {
    textDecorationLine: "underline",
  },
  pill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999, // fully rounded ends
  },
  pillText: {
    fontFamily: fonts.heading,
    /* fontSize: 20, */
  },
});
