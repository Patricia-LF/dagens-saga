import { StyleSheet, Text, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function TodayScreen() {
  const theme = useTheme();

  return (
    <View style={styles.screen}>
      <ContentBox>
        <Text style={[styles.text, { color: theme.colors.text }]}>
          Dagens saga kommer här
        </Text>
      </ContentBox>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 18,
    textAlign: "center",
  },
});
