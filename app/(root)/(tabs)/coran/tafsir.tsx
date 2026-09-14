import { Linking, StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

const EXTERNAL_TAFSIR_URL = "https://quran.com";

export default function TafsirScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.tafsirTitle")}
      subtitle={t("screens.tafsirSubtitle")}
    >
      <Text style={[styles.placeholder, { color: colors.textMuted }]}>
        {t("screens.tafsirComingSoon")}
      </Text>
      <TouchableOpacity
        style={[
          styles.cta,
          { backgroundColor: colors.accent, borderColor: colors.accent },
        ]}
        onPress={() => void Linking.openURL(EXTERNAL_TAFSIR_URL)}
        activeOpacity={0.8}
        accessibilityRole="link"
      >
        <Text style={[styles.ctaText, { color: colors.onAccent }]}>
          {t("screens.tafsirOpenExternal")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.cta,
          styles.ctaSecondary,
          { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder },
        ]}
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
  ctaSecondary: {
    marginTop: 10,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
