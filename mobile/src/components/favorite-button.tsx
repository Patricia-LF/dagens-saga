import { useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { Sparkles } from "@/components/sparkles";
import { useRem } from "@/hooks/use-screen-size";
import { useSettings } from "@/hooks/use-settings";
import { useTheme } from "@/hooks/use-theme";

type Props = { storyId: number };

// A star that adds or removes the story as a favorite. Sparkles when it is added.
export function FavoriteButton({ storyId }: Props) {
  const theme = useTheme();
  const rem = useRem();
  const { settings, toggleFavorite } = useSettings();
  const [sparkleKey, setSparkleKey] = useState(0);

  const isFavorite = settings.favorites.includes(storyId);

  const handlePress = () => {
    // Only sparkle when the story becomes a favorite, not when it is removed
    if (!isFavorite) setSparkleKey((key) => key + 1);
    toggleFavorite(storyId);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? "Ta bort från favoriter" : "Spara som favorit"
      }
      accessibilityState={{ selected: isFavorite }}
      style={styles.button}
    >
      <Image
        source={
          isFavorite ? theme.themeIcons.starFilled : theme.themeIcons.star
        }
        style={{ width: rem(2), height: rem(2) }}
        accessible={false}
      />
      {/* A new key creates new sparkles, so they play again on every add */}
      {sparkleKey > 0 && <Sparkles key={sparkleKey} count={8} spread={300} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
