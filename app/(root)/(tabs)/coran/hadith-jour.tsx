import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useTranslation } from "@/lib/i18n";

export default function HadithJourScreen() {
  const { t } = useTranslation();

  return (
    <ScreenStackLayout
      title={t("screens.hadithDayTitle")}
      subtitle={t("screens.hadithDaySubtitle")}
    >
      <Text style={styles.placeholder}>
        Un hadith mis en avant chaque jour pour la méditation.
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
