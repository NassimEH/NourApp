import { StyleSheet, Text } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useTranslation } from "@/lib/i18n";

export default function InvocationsSommeilScreen() {
  const { t } = useTranslation();

  return (
    <ScreenStackLayout
      title={t("screens.invocationsSleepTitle")}
      subtitle={t("screens.invocationsSleepSubtitle")}
    >
      <Text style={styles.placeholder}>
        Invocations et adhkâr à réciter avant de dormir.
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
