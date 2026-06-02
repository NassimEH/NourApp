import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function TraductionScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.translationTitle")}
      subtitle={t("screens.translationSubtitle")}
    >
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>
        {t("screens.translationUnifiedHint")}
      </Text>
      <TouchableOpacity
        style={[styles.cta, { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder }]}
        onPress={() => router.push("/(root)/(tabs)/coran/sourates")}
        activeOpacity={0.8}
      >
        <Text style={[styles.ctaText, { color: colors.text }]}>
          {t("screens.translationOpenReader")}
        </Text>
      </TouchableOpacity>
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
    marginBottom: 16,
  },
  cta: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
