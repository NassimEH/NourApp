import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function HadithsThemeScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.hadithsThemeTitle")}
      subtitle={t("screens.hadithsThemeSubtitle")}
    >
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>
        Parcourez les hadiths classés par thème : foi, prière, caractère, famille,
        etc.
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
