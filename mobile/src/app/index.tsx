import { StyleSheet, Text, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function StartScreen() {
  const theme = useTheme();

  return (
    <View style={styles.screen}>
      <ContentBox>
        <Text
          style={[styles.text, styles.paragraph, { color: theme.colors.text }]}
        >
          🌈 Välkommen till <Text style={styles.bold}>Sagolandet</Text>! Här
          hittar du en ny saga varje dag - fylld med äventyr, vänskap och magi.
          🧚
        </Text>

        <Text style={[styles.text, { color: theme.colors.text }]}>
          Tryck på Dagens för att läsa dagens saga, eller besök Biblioteket för
          att hitta äldre sagor.
        </Text>
      </ContentBox>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 40,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
  },
  bold: {
    fontFamily: fonts.bodyBold,
  },
  paragraph: {
    marginBottom: 16, // space between paragraphs
  },
});
