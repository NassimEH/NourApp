import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { ListRow } from "@/components/ListRow";
import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { isRamadanSeason } from "@/lib/seasonal/ramadan";
import { usePrayerTimes } from "@/lib/usePrayerTimes";

export default function RamadanScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const { timings, loading, cityName } = usePrayerTimes();
  const inSeason = isRamadanSeason();

  const imsak = timings?.Fajr ?? "—";
  const iftar = timings?.Maghrib ?? "—";

  return (
    <PreferenceScreenLayout
      title={t("ramadan.screenTitle")}
      subtitle={t("ramadan.screenSubtitle")}
    >
      {!inSeason ? (
        <Text style={[styles.note, { color: colors.textMuted }, rtlTextStyle]}>
          {t("ramadan.offSeasonNote")}
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : timings ? (
        <View style={styles.timesRow}>
          <View
            style={[
              styles.timeCard,
              { borderColor: colors.border, backgroundColor: colors.accentSurface },
            ]}
          >
            <Text style={[styles.timeLabel, { color: colors.textMuted }, rtlTextStyle]}>
              {t("ramadan.imsak")}
            </Text>
            <Text style={[styles.timeValue, { color: colors.text }]}>{imsak}</Text>
            <Text style={[styles.timeHint, { color: colors.textMuted }, rtlTextStyle]}>
              {t("ramadan.imsakHint")}
            </Text>
          </View>
          <View
            style={[
              styles.timeCard,
              { borderColor: colors.border, backgroundColor: colors.accentSurface },
            ]}
          >
            <Text style={[styles.timeLabel, { color: colors.textMuted }, rtlTextStyle]}>
              {t("ramadan.iftar")}
            </Text>
            <Text style={[styles.timeValue, { color: colors.text }]}>{iftar}</Text>
            <Text style={[styles.timeHint, { color: colors.textMuted }, rtlTextStyle]}>
              {t("ramadan.iftarHint")}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.note, { color: colors.textMuted }, rtlTextStyle]}>
          {t("home.prayerUnavailable")}
        </Text>
      )}

      {cityName ? (
        <Text style={[styles.city, { color: colors.textMuted }, rtlTextStyle]}>
          {t("ramadan.location", { city: cityName })}
        </Text>
      ) : null}

      <Text style={[styles.sectionTitle, { color: colors.text }, rtlTextStyle]}>
        {t("ramadan.invocationsSection")}
      </Text>

      <ListRow
        icon="sun"
        title={t("screens.invocationsMorningCategory")}
        onPress={() =>
          router.push({
            pathname: "/(root)/(tabs)/coran/invocations/category/[slug]",
            params: { slug: "invocations-du-matin" },
          })
        }
      />
      <ListRow
        icon="moon"
        title={t("screens.invocationsEveningCategory")}
        onPress={() =>
          router.push({
            pathname: "/(root)/(tabs)/coran/invocations/category/[slug]",
            params: { slug: "invocations-du-soir" },
          })
        }
      />
      <ListRow
        icon="bookmark"
        title={t("library.invocationsAll")}
        onPress={() => router.push("/(root)/(tabs)/coran/invocations")}
      />

      <TouchableOpacity
        style={[styles.remindersBtn, { borderColor: colors.border }]}
        onPress={() => router.push("/(root)/reminders")}
        activeOpacity={0.85}
      >
        <AppIcon name="bell" size={20} color={colors.accent} />
        <Text style={[styles.remindersLabel, { color: colors.text }, rtlTextStyle]}>
          {t("ramadan.openReminders")}
        </Text>
        <AppIcon name="chevron-right" size={18} color={colors.iconMuted} />
      </TouchableOpacity>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  loader: { marginVertical: 24 },
  note: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 20,
    marginBottom: 16,
  },
  timesRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  timeCard: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  timeLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
  },
  timeValue: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans-Bold",
  },
  timeHint: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 17,
  },
  city: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 8,
  },
  remindersBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  remindersLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
