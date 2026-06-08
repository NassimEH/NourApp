import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { screenScrollContent } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { JUZ_TO_FIRST_SURA } from "@/lib/quran/juzMapping";

const JUZ_NUMBERS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function JuzScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.juzTitle")}
          subtitle={t("screens.juzSubtitle")}
          onBack={() => router.back()}
        />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.intro, { color: colors.textMuted }]}>
            {t("screens.juzIntro")}
          </Text>
          <View style={styles.grid}>
            {JUZ_NUMBERS.map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.card,
                  { borderColor: colors.border, backgroundColor: colors.cardElevated },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/(root)/(tabs)/coran/[number]",
                    params: { number: String(JUZ_TO_FIRST_SURA[n] ?? 1) },
                  })
                }
                activeOpacity={0.85}
              >
                <AppIcon name="book-open" size={22} color={colors.accent} />
                <Text style={[styles.juzLabel, { color: colors.text }]}>
                  {t("screens.juzNumber", { number: n })}
                </Text>
                <Text style={[styles.suraHint, { color: colors.textMuted }]}>
                  {t("screens.juzStartsAt", { sura: JUZ_TO_FIRST_SURA[n] ?? 1 })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { ...screenScrollContent, paddingTop: 8, paddingBottom: 40 },
  intro: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "47%",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  juzLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  suraHint: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
  },
});
