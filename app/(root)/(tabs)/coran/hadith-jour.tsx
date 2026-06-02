import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function HadithJourScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.hadithDayTitle")}
      subtitle={t("screens.hadithDaySubtitle")}
    >
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>
        Un hadith mis en avant chaque jour pour la méditation.
      </Text>
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
  },
});
