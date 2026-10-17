import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
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

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surface,
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
          >
            <Text style={[styles.icon, { fontSize: rem(1.5) }]}>
              {item.icon}
            </Text>
            <Text
              style={[
                styles.label,
                { color: theme.colors.text, fontSize: rem(1) },
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
    /* borderTopWidth: 2, */
    paddingTop: 8,
  },
  item: {
    flex: 1, // all tabs share the width equally
    alignItems: "center",
  },
  icon: {
    /*  fontSize: 24, */
  },
  label: {
    fontFamily: fonts.heading,
    fontSize: 14,
    marginTop: 2,
  },
});
