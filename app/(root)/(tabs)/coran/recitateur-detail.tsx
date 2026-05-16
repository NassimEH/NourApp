import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useTranslation } from "@/lib/i18n";

export default function RecitateurDetailScreen() {
  const { t } = useTranslation();

  return (
    <ScreenStackLayout
      title={t("screens.reciterDetailTitle")}
      subtitle={t("screens.reciterDetailSubtitle")}
    >
      <Text style={styles.placeholder}>
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
    color: "rgba(0,0,0,0.7)",
    lineHeight: 22,
  },
});
