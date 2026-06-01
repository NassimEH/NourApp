import { StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

const REMINDER_KEYS = [
  "reminders.prayer",
  "reminders.hadith",
  "reminders.lesson",
  "reminders.ramadan",
] as const;

export default function RemindersScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();

  return (
    <PreferenceScreenLayout
      title={t("reminders.title")}
      subtitle={t("reminders.subtitle")}
    >
      <Text style={[styles.intro, { color: colors.textMuted }, rtlTextStyle]}>
        {t("reminders.intro")}
      </Text>
      {REMINDER_KEYS.map((key) => (
        <View
          key={key}
          style={[
            styles.row,
            {
              borderColor: colors.border,
              backgroundColor: colors.backgroundSecondary,
            },
          ]}
        >
          <AppIcon name="bell" size={20} color={colors.accent} />
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }, rtlTextStyle]}>
              {t(`${key}Title`)}
            </Text>
            <Text style={[styles.rowBody, { color: colors.textMuted }, rtlTextStyle]}>
              {t(`${key}Body`)}
            </Text>
          </View>
        </View>
      ))}
      <Text style={[styles.hint, { color: colors.textMuted }, rtlTextStyle]}>
        {t("reminders.enableInProfile")}
      </Text>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: "PlusJakartaSans-Regular",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  rowText: { flex: 1, gap: 4 },
  rowTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  rowBody: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 18,
  },
  hint: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 19,
  },
});
