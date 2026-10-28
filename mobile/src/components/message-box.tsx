import { Pressable, StyleSheet, Text, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";

type Props = {
  message: string;
  actionLabel?: string; // optional button, for example "Försök igen"
  onAction?: () => void;
};

// A centered box with a friendly message, used for empty and error states
export function MessageBox({ message, actionLabel, onAction }: Props) {
  const theme = useTheme();
  const rem = useRem();

  return (
    <View style={styles.centered}>
      <ContentBox>
        <Text
          style={[
            styles.message,
            {
              color: theme.colors.text,
              fontSize: rem(1.125),
              lineHeight: rem(1.75),
            },
          ]}
        >
          {message}
        </Text>

        {actionLabel && onAction && (
          <Pressable
            onPress={onAction}
            style={[styles.button, { backgroundColor: theme.colors.pill }]}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.pillText, fontSize: rem(1) },
              ]}
            >
              {actionLabel}
            </Text>
          </Pressable>
        )}
      </ContentBox>
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
  message: {
    fontFamily: fonts.body,
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  buttonText: {
    fontFamily: fonts.bodyBold,
  },
});
