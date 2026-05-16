import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useTranslation } from "@/lib/i18n";

export default function InvocationsMeteoScreen() {
  const { t } = useTranslation();

  return (
    <ScreenStackLayout
      title={t("screens.invocationsWeatherTitle")}
      subtitle={t("screens.invocationsWeatherSubtitle")}
    >
      <Text style={styles.placeholder}>
        Invocations liées à la pluie, au vent et aux conditions météo.
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
