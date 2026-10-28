import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";

// Shown while data is being fetched
export function LoadingIndicator() {
  const theme = useTheme();

  return (
    <View style={styles.centered} accessibilityLabel="Laddar">
      <ActivityIndicator size="large" color={theme.colors.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
});
