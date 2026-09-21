import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { SPACE } from "@/lib/ui/spacing";

type Props = {
  title: string;
  subtitle?: string;
  done: number;
  total: number;
  heroColor: string;
};

export function LearnPlanHeader({
  title,
  subtitle,
  done,
  total,
  heroColor,
}: Props) {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {subtitle}
        </Text>
      ) : null}

      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            { backgroundColor: heroColor, width: `${pct}%` },
          ]}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {done}/{total}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>
            {t("learn.lessonsStat")}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: heroColor }]}>{pct}%</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>
            {t("learn.planProgressLabel")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SPACE.xxl,
    gap: SPACE.md,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 22,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: SPACE.sm,
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACE.sm,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    marginVertical: 6,
  },
  statValue: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
  },
  statLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
  },
});
