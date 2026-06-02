import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function RecitateurDetailScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.reciterDetailTitle")}
      subtitle={t("screens.reciterDetailSubtitle")}
    >
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>
        Fiche du récitateur : biographie, style de récitation et accès à ses
        enregistrements.
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
