import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { getRecentActivityLogs, type ActivityLogEntry } from "@/lib/activity-log";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import {
  isHadithReminderEnabled,
  isLessonReminderEnabled,
  setHadithReminderEnabled,
  setLessonReminderEnabled,
} from "@/lib/notifications/content-reminders";

const REMINDER_INFO_KEYS = [
  "reminders.prayer",
  "reminders.ramadan",
] as const;

export default function RemindersScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [hadithEnabled, setHadithEnabled] = useState(false);
  const [lessonEnabled, setLessonEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void getRecentActivityLogs().then((logs) => {
        if (!cancelled) setActivityLogs(logs);
      });
      void isHadithReminderEnabled().then((v) => {
        if (!cancelled) setHadithEnabled(v);
      });
      void isLessonReminderEnabled().then((v) => {
        if (!cancelled) setLessonEnabled(v);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const onToggleHadith = async (value: boolean) => {
    setHadithEnabled(value);
    const ok = await setHadithReminderEnabled(value, {
      title: t("reminders.hadithTitle"),
      body: t("reminders.hadithBody"),
    });
    if (!ok && value) {
      setHadithEnabled(false);
      Alert.alert(t("reminders.title"), t("reminders.permissionDenied"));
    }
  };

  const onToggleLesson = async (value: boolean) => {
    setLessonEnabled(value);
    const ok = await setLessonReminderEnabled(value, {
      title: t("reminders.lessonTitle"),
      body: t("reminders.lessonBody"),
    });
    if (!ok && value) {
      setLessonEnabled(false);
      Alert.alert(t("reminders.title"), t("reminders.permissionDenied"));
    }
  };

  return (
    <PreferenceScreenLayout
      title={t("reminders.title")}
      subtitle={t("reminders.subtitle")}
    >
      <Text style={[styles.intro, { color: colors.textMuted }, rtlTextStyle]}>
        {t("reminders.intro")}
      </Text>
      {activityLogs.length > 0 ? (
        <View
          style={[
            styles.logsCard,
            { borderColor: colors.border, backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Text style={[styles.logsTitle, { color: colors.text }, rtlTextStyle]}>
            {t("reminders.recentActions")}
          </Text>
          {activityLogs.slice(0, 4).map((entry) => (
            <Text key={entry.id} style={[styles.logLine, { color: colors.textMuted }, rtlTextStyle]}>
              {`• ${entry.label}`}
            </Text>
          ))}
        </View>
      ) : null}

      <ReminderToggleRow
        title={t("reminders.hadithTitle")}
        body={t("reminders.hadithBody")}
        value={hadithEnabled}
        onValueChange={(v) => void onToggleHadith(v)}
      />
      <ReminderToggleRow
        title={t("reminders.lessonTitle")}
        body={t("reminders.lessonBody")}
        value={lessonEnabled}
        onValueChange={(v) => void onToggleLesson(v)}
      />

      {REMINDER_INFO_KEYS.map((key) => (
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

function ReminderToggleRow({
  title,
  body,
  value,
  onValueChange,
}: {
  title: string;
  body: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const colors = useAppTheme();
  const { rtlTextStyle } = useTranslation();

  return (
    <View
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
          {title}
        </Text>
        <Text style={[styles.rowBody, { color: colors.textMuted }, rtlTextStyle]}>
          {body}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.divider, true: colors.accent }}
        thumbColor="#fff"
      />
    </View>
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
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  rowText: { flex: 1, gap: 4 },
  logsCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 6,
  },
  logsTitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  logLine: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "PlusJakartaSans-Regular",
  },
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
