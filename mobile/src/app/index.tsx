import { StyleSheet, Text, View } from "react-native";
import { ContentBox } from "@/components/content-box";
import { fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRem } from "@/hooks/use-screen-size";

export default function StartScreen() {
  const theme = useTheme();
  const rem = useRem();

  return (
    <View style={styles.screen}>
      <ContentBox>
        <Text
          style={[
            styles.text,
            styles.paragraph,
            {
              color: theme.colors.text,
              fontSize: rem(1.125),
              lineHeight: rem(1.75),
            },
          ]}
        >
          🌈 Välkommen till <Text style={styles.bold}>Sagolandet</Text>! Här
          hittar du en ny saga varje dag - fylld med äventyr, vänskap och magi.
          🧚
        </Text>

        <Text
          style={[
            styles.text,
            {
              color: theme.colors.text,
              fontSize: rem(1.125),
              lineHeight: rem(1.75),
            },
          ]}
        >
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
    textAlign: "center",
  },
  bold: {
    fontFamily: fonts.bodyBold,
  },
  paragraph: {
    marginBottom: 16, // space between paragraphs
  },
});
