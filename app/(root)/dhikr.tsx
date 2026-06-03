import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import {
  getDhikrCount,
  getDhikrDailyGoal,
  setDhikrCount,
  setDhikrDailyGoal,
} from "@/lib/tools/dhikr-storage";
import { createToolScreenStyles } from "@/lib/tool-screen-styles";

const GOAL_OPTIONS = [33, 99, 100];

export default function DhikrScreen() {
  const colors = useAppTheme();
  const styles = useMemo(() => createToolScreenStyles(colors), [colors]);
  const { t, rtlTextStyle } = useTranslation();
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(33);

  useEffect(() => {
    void (async () => {
      setCount(await getDhikrCount());
      setGoal(await getDhikrDailyGoal());
    })();
  }, []);

  const increment = useCallback(() => {
    setCount((c) => {
      const next = c + 1;
      void setDhikrCount(next);
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCount(0);
    void setDhikrCount(0);
  }, []);

  const pickGoal = useCallback((g: number) => {
    setGoal(g);
    void setDhikrDailyGoal(g);
  }, []);

  const progress = goal > 0 ? Math.min(1, count / goal) : 0;

  return (
    <ToolScreenLayout
      title={t("tools.dhikr.title")}
      subtitle={t("tools.dhikr.subtitle")}
    >
      <Pressable
        onPress={increment}
        accessibilityRole="button"
        accessibilityLabel={t("tools.dhikr.tapToCount")}
        style={({ pressed }) => [
          styles.counterZone,
          pressed && { opacity: 0.88 },
        ]}
      >
        <Text style={styles.counterValue}>{count}</Text>
        <Text style={[styles.counterHint, rtlTextStyle]}>
          {t("tools.dhikr.tapToCount")}
        </Text>
      </Pressable>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={[styles.note, rtlTextStyle, { marginBottom: 20 }]}>
        {t("tools.dhikr.goalProgress", { count, goal })}
      </Text>

      <Text style={[styles.sectionLabel, rtlTextStyle]}>
        {t("tools.dhikr.dailyGoal")}
      </Text>
      <View style={[styles.chipRow, { marginBottom: 24 }]}>
        {GOAL_OPTIONS.map((g) => {
          const active = goal === g;
          return (
            <Pressable
              key={g}
              onPress={() => pickGoal(g)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, active && styles.chipTextActive]}
              >
                {g}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={reset}
        style={styles.ghostBtn}
        accessibilityRole="button"
        accessibilityLabel={t("tools.dhikr.reset")}
      >
        <Text style={[styles.ghostBtnText, rtlTextStyle]}>
          {t("tools.dhikr.reset")}
        </Text>
      </Pressable>
    </ToolScreenLayout>
  );
}
