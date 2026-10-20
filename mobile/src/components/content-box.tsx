import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";
import { usePathname } from "expo-router";

type Props = {
  title?: string; // optional heading inside the box
  fill?: boolean; // fill the available height (for scrolling content)
  children: ReactNode;
};

export function ContentBox({ title, fill = false, children }: Props) {
  const theme = useTheme();
  const rem = useRem();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <View
      style={[
        styles.box,
        fill && { flexGrow: 1, flexShrink: 1 },
        {
          backgroundColor: isHome
            ? theme.colors.surface
            : theme.colors.surfaceStrong,
        },
      ]}
    >
      {title && (
        <Text
          style={[
            styles.title,
            { color: theme.colors.text, fontSize: rem(1.625) },
          ]}
        >
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 20,
    justifyContent: "center",
  },
  fill: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.heading,
    /* fontSize: 26, */
    textAlign: "center",
    marginBottom: 16,
  },
  /*  surface: {
    marginHorizontal: 40,
  }, */
});
