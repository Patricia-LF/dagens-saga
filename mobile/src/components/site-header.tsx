import { router, usePathname } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { brand, fonts } from "@/constants/theme";
import { navItems, isNavItemActive } from "@/constants/nav";

type Props = {
  showNav: boolean; // show the menu under the title (wide screens only)
};

export function SiteHeader({ showNav }: Props) {
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  // Scale the title with the screen width, but never above 84
  const titleSize = Math.min(84, width / 8.5);

  return (
    <View style={styles.header}>
      {/* The title also works as a link back to the start page */}
      <Pressable onPress={() => router.navigate("/")}>
        <Text style={[styles.title, { fontSize: titleSize }]} numberOfLines={1}>
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
              >
                {/* Menu items: always the same color, glow only when active */}
                <Text
                  style={[
                    styles.navItem,
                    active && styles.navItemActive,
                    active && brand.glow,
                  ]}
                >
                  {item.label} {item.icon}
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
    paddingTop: 48,
    paddingBottom: 16,
  },
  title: {
    fontFamily: fonts.heading,
    textAlign: "center",
    color: brand.color,
    ...brand.glow,
  },
  nav: {
    flexDirection: "row", // menu items side by side
    gap: 20,
    marginTop: 16,
  },
  navItem: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: brand.color,
  },
  navItemActive: {
    textDecorationLine: "underline",
  },
});
