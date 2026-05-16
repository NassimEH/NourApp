import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useTranslation } from "@/lib/i18n";

export default function InvocationsMatinSoirScreen() {
  const { t } = useTranslation();

  return (
    <ScreenStackLayout
      title={t("screens.invocationsMorningEveningTitle")}
      subtitle={t("screens.invocationsMorningEveningSubtitle")}
    >
      <Text style={styles.placeholder}>
        Adhkâr du matin et du soir selon la sunna.
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
