import { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import {
  getDhikrCount,
  getDhikrDailyGoal,
  setDhikrCount,
  setDhikrDailyGoal,
} from "@/lib/tools/dhikr-storage";

const GOAL_OPTIONS = [33, 99, 100];

export default function DhikrScreen() {
  const colors = useAppTheme();
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
    <PreferenceScreenLayout
      title={t("tools.dhikr.title")}
      subtitle={t("tools.dhikr.subtitle")}
    >
      <Pressable
        onPress={increment}
        accessibilityRole="button"
        accessibilityLabel={t("tools.dhikr.tapToCount")}
        style={({ pressed }) => [
          styles.counterZone,
          {
            backgroundColor: colors.accentSurface,
            borderColor: colors.accentBorder,
          },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.count, { color: colors.accent }]}>{count}</Text>
        <Text style={[styles.hint, { color: colors.textMuted }, rtlTextStyle]}>
          {t("tools.dhikr.tapToCount")}
        </Text>
      </Pressable>

      <View style={[styles.progressTrack, { backgroundColor: colors.divider }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.accent, width: `${progress * 100}%` },
          ]}
        />
      </View>
      <Text style={[styles.goalLabel, { color: colors.textMuted }, rtlTextStyle]}>
        {t("tools.dhikr.goalProgress", { count, goal })}
      </Text>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }, rtlTextStyle]}>
        {t("tools.dhikr.dailyGoal")}
      </Text>
      <View style={styles.goalRow}>
        {GOAL_OPTIONS.map((g) => (
          <Pressable
            key={g}
            onPress={() => pickGoal(g)}
            style={[
              styles.goalChip,
              {
                borderColor: colors.border,
                backgroundColor: goal === g ? colors.accent : colors.cardElevated,
              },
            ]}
          >
            <Text
              style={[
                styles.goalChipText,
                { color: goal === g ? colors.onAccent : colors.text },
              ]}
            >
              {g}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={reset}
        style={[styles.resetBtn, { borderColor: colors.border }]}
        accessibilityRole="button"
        accessibilityLabel={t("tools.dhikr.reset")}
      >
        <Text style={[styles.resetText, { color: colors.text }, rtlTextStyle]}>
          {t("tools.dhikr.reset")}
        </Text>
      </Pressable>
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  counterZone: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    minHeight: 160,
  },
  pressed: {
    opacity: 0.92,
  },
  count: {
    fontSize: 64,
    fontFamily: "PlusJakartaSans-Bold",
    lineHeight: 72,
  },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  goalLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 10,
  },
  goalRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  goalChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 56,
    alignItems: "center",
  },
  goalChipText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  resetBtn: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
    justifyContent: "center",
  },
  resetText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
