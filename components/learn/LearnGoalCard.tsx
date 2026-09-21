import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";
import { CARD_RADIUS, SHADOW, SPACE } from "@/lib/ui/spacing";

type Props = {
  label: string;
  done: number;
  goal: number;
  unitLabel: string;
  doneHint?: string;
  onPress?: () => void;
};

/** Objectif — adapté de DuolingoClone/ProgressCard (leçons, pas XP). */
export function LearnGoalCard({
  label,
  done,
  goal,
  unitLabel,
  doneHint,
  onPress,
}: Props) {
  const colors = useAppTheme();
  const cardShadow = colors.isDark ? SHADOW.dark : SHADOW.light;
  const goalReached = goal > 0 && done >= goal;
  const displayed = goal > 0 ? Math.min(done, goal) : done;
  const progress = goal > 0 ? Math.min((done / goal) * 100, 100) : 0;

  const content = (
    <View
      style={[
        styles.card,
        cardShadow,
        {
          backgroundColor: colors.isDark
            ? colors.cardElevated
            : colors.backgroundSecondary,
        },
      ]}
    >
      <View style={styles.textCol}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            {label}
          </Text>
          {goalReached ? (
            <AppIcon name="check" size={14} color={colors.accent} />
          ) : null}
        </View>
        <Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {displayed}
          </Text>
          <Text style={[styles.goal, { color: colors.textMuted }]}>
            {` / ${goal} ${unitLabel}`}
          </Text>
        </Text>
        {goalReached && doneHint ? (
          <Text style={[styles.hint, { color: colors.accent }]}>{doneHint}</Text>
        ) : null}
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.fill,
              {
                backgroundColor: goalReached ? colors.accent : colors.text,
                width: `${progress}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ flex: 1 }}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: CARD_RADIUS,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.lg,
    minHeight: 96,
  },
  textCol: { flex: 1, minWidth: 0 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  label: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
  },
  value: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 26,
  },
  goal: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
  },
  hint: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
    marginTop: 2,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});
