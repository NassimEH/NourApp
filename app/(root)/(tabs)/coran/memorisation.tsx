import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useTranslation } from "@/lib/i18n";

export default function MemorisationScreen() {
  const { t } = useTranslation();

  return (
    <ScreenStackLayout
      title={t("screens.memorisationTitle")}
      subtitle={t("screens.memorisationSubtitle")}
    >
      <Text style={styles.placeholder}>
        Outils de mémorisation : répétition espacée, suivi de progression et
        révision par sourate ou juz.
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
