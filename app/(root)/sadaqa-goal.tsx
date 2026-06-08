import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import {
  getSadaqaMonthDone,
  getSadaqaMonthlyGoal,
  setSadaqaMonthDone,
  setSadaqaMonthlyGoal,
} from "@/lib/tools/sadaqa-goal";
import { createToolScreenStyles } from "@/lib/tool-screen-styles";

function parseAmount(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export default function SadaqaGoalScreen() {
  const colors = useAppTheme();
  const styles = useMemo(() => createToolScreenStyles(colors), [colors]);
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
    <ToolScreenLayout
      title={t("tools.sadaqa.title")}
      subtitle={t("tools.sadaqa.subtitle")}
    >
      <View style={styles.field}>
        <Text style={[styles.fieldLabel, rtlTextStyle]}>
          {t("tools.sadaqa.monthlyGoal")}
        </Text>
        <TextInput
          value={goalStr}
          onChangeText={setGoalStr}
          onBlur={saveGoal}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.inputMuted, rtlTextStyle]}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, rtlTextStyle]}>
          {t("tools.sadaqa.monthDone")}
        </Text>
        <TextInput
          value={doneStr}
          onChangeText={setDoneStr}
          onBlur={saveDone}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.inputMuted, rtlTextStyle]}
        />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={[styles.body, rtlTextStyle, { marginBottom: 24 }]}>
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
        style={styles.primaryBtn}
      >
        <Text style={styles.primaryBtnText}>{t("common.save")}</Text>
      </Pressable>
    </ToolScreenLayout>
  );
}
