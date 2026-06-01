import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "@/components/AppIcon";
import { router } from "expo-router";

import { ScreenBackground } from "@/components/ScreenBackground";
import {
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { useProphetsProgress } from "@/lib/learn/hooks/useProphetsProgress";

export default function ApprendreStatsScreen() {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const { course, completedCount, totalLessons, completedIds } =
    useProphetsProgress();
  const pct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.learnStatsTitle")}
          subtitle={t("screens.learnStatsSubtitle")}
          style={screenPageHeaderSpacing}
          onBack={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.usesBackgroundImage
                  ? colors.card
                  : colors.cardElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t("learn.statsCourseProgress")}
            </Text>
            <View style={styles.statRow}>
              <AppIcon name="award" size={32} color={colors.accent} />
              <View style={styles.statText}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {completedCount} / {totalLessons}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                  {t("learn.statsLessonsTitle")}
                </Text>
              </View>
            </View>
            <View
              style={[styles.progressTrack, { backgroundColor: colors.divider }]}
            >
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: colors.accent, width: `${pct}%` },
                ]}
              />
            </View>
            <Text style={[styles.pctLabel, { color: colors.textMuted }]}>
              {pct} %
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.usesBackgroundImage
                  ? colors.card
                  : colors.cardElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t("learn.statsWeeklySummary")}
            </Text>
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              {t("learn.statsGoalsHint")}
            </Text>
            {course.lessons.map((lesson) => (
              <View key={lesson.id} style={styles.lessonRow}>
                <Text style={[styles.lessonName, { color: colors.text }]}>
                  {lesson.title}
                </Text>
                <AppIcon
                  name={
                    completedIds.includes(lesson.id) ? "check-circle" : "circle"
                  }
                  size={20}
                  color={
                    completedIds.includes(lesson.id)
                      ? colors.accent
                      : colors.iconMuted
                  }
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { ...screenScrollContent, paddingTop: 8, paddingBottom: 40 },
  card: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  statText: { flex: 1 },
  statValue: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 4,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: { height: "100%", borderRadius: 5 },
  pctLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "right",
  },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 20,
    marginBottom: 16,
  },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  lessonName: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
