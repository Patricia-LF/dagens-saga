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
      testID="content-box"
      style={[
        styles.box,
        {
          padding: rem(1.5),
          marginHorizontal: rem(1),
          marginTop: rem(0.8),
          borderRadius: rem(1.25),
        },
        fill && { flexGrow: 1, flexShrink: 1, minHeight: 0 },
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
    marginBottom: 10,
    justifyContent: "center",
  },
  fill: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.heading,
    textAlign: "center",
    marginBottom: 16,
  },
});
