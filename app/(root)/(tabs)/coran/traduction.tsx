import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useTranslation } from "@/lib/i18n";

export default function TraductionScreen() {
  const { t } = useTranslation();

  return (
    <ScreenStackLayout
      title={t("screens.translationTitle")}
      subtitle={t("screens.translationSubtitle")}
    >
      <Text style={styles.placeholder}>
        Lecture du Coran avec traduction en français (et autres langues). Affichage
        côte à côte ou en dessous du texte arabe, avec possibilité de choisir la
        langue de traduction.
      </Text>
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.7)",
    lineHeight: 22,
  },
});
