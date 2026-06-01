import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { formatCountdown, getNextPrayerInfo } from "@/lib/prayerUtils";
import { usePrayerTimes } from "@/lib/usePrayerTimes";

const SALAT_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export default function PrayerSummaryScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const { timings, loading } = usePrayerTimes();

  const next = timings ? getNextPrayerInfo(timings) : null;

  return (
    <PreferenceScreenLayout
      title={t("tools.prayerSummary.title")}
      subtitle={t("tools.prayerSummary.subtitle")}
    >
      {loading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : !timings ? (
        <Text style={[styles.error, { color: colors.textMuted }, rtlTextStyle]}>
          {t("home.prayerUnavailable")}
        </Text>
      ) : (
        <>
          {next ? (
            <View
              style={[
                styles.nextCard,
                {
                  backgroundColor: colors.accentSurface,
                  borderColor: colors.accentBorder,
                },
              ]}
            >
              <Text style={[styles.nextLabel, { color: colors.textMuted }, rtlTextStyle]}>
                {t("tools.prayerSummary.nextPrayer")}
              </Text>
              <Text style={[styles.nextName, { color: colors.text }]}>{next.label}</Text>
              <Text style={[styles.nextIn, { color: colors.accent }, rtlTextStyle]}>
                {t("tools.prayerSummary.in", {
                  time: formatCountdown(next.inMinutes),
                })}
              </Text>
              <Text style={[styles.nextTime, { color: colors.textMuted }]}>
                {timings[next.name as keyof typeof timings]}
              </Text>
            </View>
          ) : null}

          <View style={[styles.list, rtlViewStyle]}>
            {SALAT_ORDER.map((key) => (
              <View
                key={key}
                style={[styles.row, { borderBottomColor: colors.divider }]}
              >
                <AppIcon name="sunrise" size={16} color={colors.iconMuted} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>{key}</Text>
                <Text style={[styles.rowTime, { color: colors.textMuted }]}>
                  {timings[key]}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push("/(root)/(tabs)/qibla")}
            style={[styles.linkBtn, { backgroundColor: colors.accent }]}
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: colors.onAccent }]}>
              {t("tools.prayerSummary.openPrayers")}
            </Text>
          </Pressable>
        </>
      )}
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 32,
  },
  error: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
    marginVertical: 24,
  },
  nextCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: "center",
  },
  nextLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  nextName: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    marginTop: 6,
  },
  nextIn: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginTop: 8,
  },
  nextTime: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 4,
  },
  list: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
  },
  rowTime: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  linkBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  linkText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
