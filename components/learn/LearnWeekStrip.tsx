import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/lib/app-theme";
import { useAppPreferences } from "@/lib/app-preferences";
import { dayKey } from "@/lib/learn/streak";
import { SPACE } from "@/lib/ui/spacing";

type Props = {
  activeDays: string[];
};

type DayCell = {
  key: string;
  date: number;
  label: string;
  isToday: boolean;
  isFuture: boolean;
  isActive: boolean;
};

function startOfWeek(d: Date, weekStartsOnMonday: boolean): Date {
  const day = d.getDay();
  const offset = weekStartsOnMonday ? (day + 6) % 7 : day;
  const start = new Date(d);
  start.setHours(12, 0, 0, 0);
  start.setDate(d.getDate() - offset);
  return start;
}

/** Calendrier hebdo — adapté de DuolingoClone/WeekStrip. */
export function LearnWeekStrip({ activeDays }: Props) {
  const colors = useAppTheme();
  const { locale } = useAppPreferences();
  const activeSet = useMemo(() => new Set(activeDays), [activeDays]);
  const today = dayKey();
  const weekStartsOnMonday = locale !== "en";

  const days = useMemo((): DayCell[] => {
    const now = new Date();
    const start = startOfWeek(now, weekStartsOnMonday);
    const intlLocale =
      locale === "ar" ? "ar" : locale === "en" ? "en-US" : "fr-FR";
    const cells: DayCell[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = dayKey(d);
      cells.push({
        key,
        date: d.getDate(),
        label: d
          .toLocaleDateString(intlLocale, { weekday: "short" })
          .replace(".", "")
          .slice(0, 3),
        isToday: key === today,
        isFuture: key > today,
        isActive: activeSet.has(key),
      });
    }
    return cells;
  }, [activeSet, locale, today, weekStartsOnMonday]);

  return (
    <View style={styles.row}>
      {days.map((day) => {
        const labelColor = day.isToday ? colors.text : colors.textMuted;

        let circleBorder = colors.border;
        let circleBg: string = "transparent";
        let dateColor = colors.text;
        let borderStyle: "solid" | "dashed" = "dashed";

        if (day.isActive) {
          circleBorder = colors.accent;
          circleBg = colors.accent;
          dateColor = colors.onAccent;
          borderStyle = "solid";
        } else if (day.isToday) {
          circleBorder = colors.accent;
          borderStyle = "solid";
        }

        return (
          <View
            key={day.key}
            style={[styles.col, day.isFuture ? { opacity: 0.35 } : null]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: labelColor,
                  fontFamily: day.isToday
                    ? "PlusJakartaSans-SemiBold"
                    : "PlusJakartaSans-Regular",
                },
              ]}
            >
              {day.label}
            </Text>
            <View
              style={[
                styles.circle,
                {
                  borderColor: circleBorder,
                  backgroundColor: circleBg,
                  borderStyle,
                },
              ]}
            >
              <Text
                style={[
                  styles.date,
                  {
                    color: dateColor,
                    fontFamily: day.isToday
                      ? "PlusJakartaSans-SemiBold"
                      : "PlusJakartaSans-Medium",
                  },
                ]}
              >
                {day.date}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACE.lg,
    paddingHorizontal: 2,
  },
  col: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 11,
    textTransform: "capitalize",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  date: {
    fontSize: 13,
  },
});
