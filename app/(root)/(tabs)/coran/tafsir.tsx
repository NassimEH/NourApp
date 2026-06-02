import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function TafsirScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.tafsirTitle")}
      subtitle={t("screens.tafsirSubtitle")}
    >
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>
        {
          "Exégèse et explication des versets : sélection d'une sourate et d'un verset pour afficher les commentaires des savants (tafsir). Les sources et le contenu seront intégrés ici."
        }
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
