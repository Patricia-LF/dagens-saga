import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSettings } from "@/hooks/use-settings";
import { useRem } from "@/hooks/use-screen-size";
import { useTheme } from "@/hooks/use-theme";

// Two icon buttons for choosing between turning pages and scrolling.
// The icon shows which one is selected, and each button is at least 44 px to tap.
export function ReadingModeToggle() {
  const theme = useTheme();
  const rem = useRem();
  const { settings, setReadingMode } = useSettings();

  // Inside the component, since the icons depend on the active theme
  const options = [
    {
      mode: "pages",
      label: "Bläddra",
      on: theme.themeIcons.pagesOn,
      off: theme.themeIcons.pagesOff,
    },
    {
      mode: "scroll",
      label: "Scrolla",
      on: theme.themeIcons.scrollOn,
      off: theme.themeIcons.scrollOff,
    },
  ] as const;

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = settings.readingMode === option.mode;
        return (
          <Pressable
            key={option.mode}
            onPress={() => setReadingMode(option.mode)}
            accessibilityRole="button"
            accessibilityLabel={option.label} // the icon has no text, so screen readers need the name
            accessibilityState={{ selected }}
            style={styles.button}
          >
            <Image
              source={selected ? option.on : option.off}
              style={{ width: rem(2.25), height: rem(2.25) }}
              accessible={false}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
