import { Pressable, StyleSheet, Text, View } from "react-native";
import { fonts } from "@/constants/theme";
import { ReadingMode, useSettings } from "@/hooks/use-settings";
import { useRem } from "@/hooks/use-screen-size";
import { useTheme } from "@/hooks/use-theme";

const OPTIONS: { mode: ReadingMode; label: string }[] = [
  { mode: "pages", label: "Bläddra" },
  { mode: "scroll", label: "Scrolla" },
];

// Two small buttons for choosing between turning pages and scrolling.
// The pill is small, but the Pressable around it is at least 44 px tall to tap.
export function ReadingModeToggle() {
  const theme = useTheme();
  const rem = useRem();
  const { settings, setReadingMode } = useSettings();

  return (
    <View style={styles.row}>
      {OPTIONS.map(({ mode, label }) => {
        const selected = settings.readingMode === mode;
        return (
          <Pressable
            key={mode}
            onPress={() => setReadingMode(mode)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.target, { paddingHorizontal: rem(0.4) }]} // space between the pills
          >
            <View
              style={[
                styles.pill,
                {
                  backgroundColor: selected
                    ? theme.colors.toggle
                    : theme.colors.pill,
                  paddingHorizontal: rem(0.75),
                  paddingVertical: rem(0.375),
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: selected
                      ? theme.colors.toggleText
                      : theme.colors.pillText,
                    fontSize: rem(1.125),
                  },
                ]}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  target: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
  },
  pill: {
    borderRadius: 999, // fully rounded ends
    alignItems: "center",
  },
  pillText: {
    fontFamily: fonts.bodyBold,
  },
});
