import { useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { formatCountdown, getNextPrayerInfo } from "@/lib/prayerUtils";
import { usePrayerTimes } from "@/lib/usePrayerTimes";
import { createToolScreenStyles } from "@/lib/tool-screen-styles";

const SALAT_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export default function PrayerSummaryScreen() {
  const colors = useAppTheme();
  const styles = useMemo(() => createToolScreenStyles(colors), [colors]);
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const { timings, loading } = usePrayerTimes();

  const next = timings ? getNextPrayerInfo(timings) : null;

  return (
    <ToolScreenLayout
      title={t("tools.prayerSummary.title")}
      subtitle={t("tools.prayerSummary.subtitle")}
    >
      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginVertical: 32 }} />
      ) : !timings ? (
        <Text style={[styles.note, rtlTextStyle, { textAlign: "center" }]}>
          {t("home.prayerUnavailable")}
        </Text>
      ) : (
        <>
          {next ? (
            <View style={styles.highlight}>
              <Text style={[styles.highlightLabel, rtlTextStyle]}>
                {t("tools.prayerSummary.nextPrayer")}
              </Text>
              <Text
                style={[
                  styles.highlightValue,
                  { color: colors.text, fontSize: 30 },
                ]}
              >
                {next.label}
              </Text>
              <Text
                style={[
                  styles.highlightSub,
                  { color: colors.accent, fontFamily: "PlusJakartaSans-SemiBold" },
                ]}
              >
                {t("tools.prayerSummary.in", {
                  time: formatCountdown(next.inMinutes),
                })}
              </Text>
              <Text style={styles.highlightSub}>
                {timings[next.name as keyof typeof timings]}
              </Text>
            </View>
          ) : null}

          <View style={[styles.list, rtlViewStyle]}>
            {SALAT_ORDER.map((key) => (
              <View key={key} style={styles.listRow}>
                <AppIcon name="sunrise" size={16} color={colors.iconMuted} />
                <Text style={styles.listRowLabel}>{key}</Text>
                <Text style={styles.listRowValue}>{timings[key]}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push("/(root)/(tabs)/qibla")}
            style={styles.primaryBtn}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>
              {t("tools.prayerSummary.openPrayers")}
            </Text>
          </Pressable>
        </>
      )}
    </ToolScreenLayout>
  );
}
