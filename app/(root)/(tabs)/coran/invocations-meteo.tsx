import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function InvocationsMeteoScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.invocationsWeatherTitle")}
      subtitle={t("screens.invocationsWeatherSubtitle")}
    >
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>
        Invocations liées à la pluie, au vent et aux conditions météo.
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
