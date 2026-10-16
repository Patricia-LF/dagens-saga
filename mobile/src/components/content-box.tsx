import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  title?: string; // optional heading inside the box
  fill?: boolean; // fill the available height (for scrolling content)
  children: ReactNode;
};

export function ContentBox({ title, fill = false, children }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.box,
        fill && styles.fill,
        {
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      {title && (
        <Text style={[styles.title, { color: theme.colors.text }]}>
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
    marginHorizontal: 40,
  },
  fill: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    textAlign: "center",
    marginBottom: 16,
  },
});
