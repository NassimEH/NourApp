import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function InvocationsMatinSoirScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.invocationsMorningEveningTitle")}
      subtitle={t("screens.invocationsMorningEveningSubtitle")}
    >
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>
        Adhkâr du matin et du soir selon la sunna.
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
