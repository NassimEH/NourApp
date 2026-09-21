import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { CHIP_RADIUS, SECTION_GAP, SPACE } from "@/lib/ui/spacing";

export type PlanLessonFilter = "all" | "todo" | "done";

type Props = {
  value: PlanLessonFilter;
  onChange: (value: PlanLessonFilter) => void;
};

export function LearnPlanFilters({ value, onChange }: Props) {
  const colors = useAppTheme();
  const { t } = useTranslation();

  const options: { id: PlanLessonFilter; label: string }[] = [
    { id: "all", label: t("learn.filterAll") },
    { id: "todo", label: t("learn.filterTodo") },
    { id: "done", label: t("learn.filterDone") },
  ];

  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.pill,
              {
                borderColor: active ? colors.accent : colors.border,
                backgroundColor: active ? colors.accent : "transparent",
              },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                { color: active ? colors.onAccent : colors.text },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACE.sm,
    marginBottom: SECTION_GAP,
  },
  pill: {
    paddingHorizontal: SPACE.md,
    paddingVertical: 8,
    borderRadius: CHIP_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 36,
    justifyContent: "center",
  },
  pillText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
  },
});
