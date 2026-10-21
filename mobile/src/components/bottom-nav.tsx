import { router, usePathname } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts } from "@/constants/theme";
import { isNavItemActive, navItems } from "@/constants/nav";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";

export function BottomNav() {
  const theme = useTheme();
  const rem = useRem();
  const pathname = usePathname();
  const insets = useSafeAreaInsets(); // space for the home indicator on newer phones

  const iconSize = rem(1.75);

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surfaceStrong,
        },
        { paddingBottom: insets.bottom + 8 },
      ]}
    >
      {navItems.map((item) => {
        const active = isNavItemActive(item.href, pathname);
        return (
          <Pressable
            key={item.href}
            onPress={() => router.navigate(item.href)}
            style={styles.item}
            accessibilityRole="link"
            accessibilityState={{ selected: active }}
          >
            <Image
              source={theme.navIcons[item.icon]}
              style={[
                { width: iconSize, height: iconSize },
                !active && styles.inactive, // dim the tabs that are not selected
              ]}
            />
            <Text
              style={[
                styles.label,
                { color: theme.colors.text, fontSize: rem(1) },
                !active && styles.inactive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    paddingTop: 8,
  },
  item: {
    flex: 1, // all tabs share the width equally
    alignItems: "center",
  },
  inactive: {
    opacity: 0.6,
  },
  label: {
    fontFamily: fonts.heading,
    marginTop: 2,
  },
});
