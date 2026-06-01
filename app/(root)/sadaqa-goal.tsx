import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import {
  getSadaqaMonthDone,
  getSadaqaMonthlyGoal,
  setSadaqaMonthDone,
  setSadaqaMonthlyGoal,
} from "@/lib/tools/sadaqa-goal";

function parseAmount(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function SadaqaGoalScreen() {
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const [goalStr, setGoalStr] = useState("");
  const [doneStr, setDoneStr] = useState("");

  useEffect(() => {
    void (async () => {
      const goal = await getSadaqaMonthlyGoal();
      const done = await getSadaqaMonthDone();
      setGoalStr(goal > 0 ? String(goal) : "");
      setDoneStr(done > 0 ? String(done) : "");
    })();
  }, []);

  const goal = parseAmount(goalStr);
  const done = parseAmount(doneStr);
  const progress = goal > 0 ? Math.min(1, done / goal) : 0;

  const saveGoal = () => {
    void setSadaqaMonthlyGoal(goal);
  };

  const saveDone = () => {
    void setSadaqaMonthDone(done);
  };

  const remaining = useMemo(() => Math.max(0, goal - done), [goal, done]);

  return (
    <PreferenceScreenLayout
      title={t("tools.sadaqa.title")}
      subtitle={t("tools.sadaqa.subtitle")}
    >
      <Text style={[styles.label, { color: colors.textMuted }, rtlTextStyle]}>
        {t("tools.sadaqa.monthlyGoal")}
      </Text>
      <TextInput
        value={goalStr}
        onChangeText={setGoalStr}
        onBlur={saveGoal}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.cardElevated,
          },
          rtlTextStyle,
        ]}
      />

      <Text style={[styles.label, { color: colors.textMuted }, rtlTextStyle]}>
        {t("tools.sadaqa.monthDone")}
      </Text>
      <TextInput
        value={doneStr}
        onChangeText={setDoneStr}
        onBlur={saveDone}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.cardElevated,
          },
          rtlTextStyle,
        ]}
      />

      <View style={[styles.progressTrack, { backgroundColor: colors.divider }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.accent, width: `${progress * 100}%` },
          ]}
        />
      </View>

      <Text style={[styles.summary, { color: colors.text }, rtlTextStyle]}>
        {goal > 0
          ? t("tools.sadaqa.progress", {
              done: done.toLocaleString(),
              goal: goal.toLocaleString(),
              remaining: remaining.toLocaleString(),
            })
          : t("tools.sadaqa.setGoalHint")}
      </Text>

      <Pressable
        onPress={() => {
          saveGoal();
          saveDone();
        }}
        style={[styles.saveBtn, { backgroundColor: colors.accent }]}
      >
        <Text style={[styles.saveText, { color: colors.onAccent }]}>
          {t("common.save")}
        </Text>
      </Pressable>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  summary: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    lineHeight: 22,
    marginBottom: 24,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  saveText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
