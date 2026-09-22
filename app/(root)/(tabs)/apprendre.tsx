import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";

import { AppIcon } from "@/components/AppIcon";
import { CoursePicker } from "@/components/learn/CoursePicker";
import { LearnGoalCard } from "@/components/learn/LearnGoalCard";
import { LearnHero } from "@/components/learn/LearnHero";
import {
  LearnLessonPath,
  type LearnPathItem,
} from "@/components/learn/LearnLessonPath";
import {
  LearnPlanFilters,
  type PlanLessonFilter,
} from "@/components/learn/LearnPlanFilters";
import { LearnPlanHeader } from "@/components/learn/LearnPlanHeader";
import { LearnResumeCard } from "@/components/learn/LearnResumeCard";
import { LearnWeekStrip } from "@/components/learn/LearnWeekStrip";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import {
  SCREEN_EDGE_PADDING,
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useAppPreferences } from "@/lib/app-preferences";
import { useTranslation } from "@/lib/i18n";
import { getCourseHeroColor } from "@/lib/learn/course-theme";
import {
  getLearnCourses,
  PROPHETS_COURSE_ID,
} from "@/lib/learn/courses";
import { useLearnProgress } from "@/lib/learn/hooks/useLearnProgress";
import { useLearnStreak } from "@/lib/learn/hooks/useLearnStreak";
import { useWeeklyGoal } from "@/lib/learn/hooks/useWeeklyGoal";
import type { LearnLesson, LessonStatus } from "@/lib/learn/types";
import { createLearnScreenStyles } from "@/lib/learn-screen-styles";
import { useSuraList, useRecentSuras } from "@/lib/quran/hooks";
import type { SuraMeta } from "@/lib/quran/types";
import { CARD_RADIUS, SECTION_GAP, SHADOW, SPACE } from "@/lib/ui/spacing";

const H_PADDING = SCREEN_EDGE_PADDING;

function RecentSuraTile({
  sura,
  onPress,
  styles,
}: {
  sura: SuraMeta;
  onPress: () => void;
  styles: ReturnType<typeof createLearnScreenStyles>;
}) {
  const { t, rtlTextStyle } = useTranslation();
  const revelation =
    sura.revelationType === "Meccan"
      ? t("library.suraMeccan")
      : t("library.suraMedinan");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${sura.englishName}, ${sura.name}`}
      style={({ pressed }) => [
        styles.recentTile,
        pressed && styles.recentTilePressed,
      ]}
    >
      <View style={styles.recentBadge}>
        <Text style={styles.recentNumber}>{sura.number}</Text>
      </View>
      <View>
        <Text style={styles.recentArabic} numberOfLines={1}>
          {sura.name}
        </Text>
        <Text style={[styles.recentTitle, rtlTextStyle]} numberOfLines={1}>
          {sura.englishName}
        </Text>
        <Text style={[styles.recentSub, rtlTextStyle]} numberOfLines={1}>
          {sura.numberOfAyahs} · {revelation}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ApprendreScreen() {
  const { user } = useGlobalContext();
  const { t } = useTranslation();
  const colors = useAppTheme();
  const typography = useAppTypography();
  const styles = useMemo(
    () => createLearnScreenStyles(colors, typography),
    [colors, typography]
  );
  const homeStyles = useMemo(
    () => createHomeLearnStyles(colors),
    [colors]
  );
  const { locale } = useAppPreferences();
  const courses = useMemo(() => getLearnCourses(locale), [locale]);
  const [selectedCourseId, setSelectedCourseId] = useState(PROPHETS_COURSE_ID);
  const activeCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) ?? courses[0],
    [courses, selectedCourseId]
  );
  const [activeTab, setActiveTab] = useState<"today" | "plan">("today");
  const [planFilter, setPlanFilter] = useState<PlanLessonFilter>("all");

  const tabs = useMemo(
    () => [
      { id: "today" as const, label: t("learn.tabToday") },
      { id: "plan" as const, label: t("learn.tabPlan") },
    ],
    [t]
  );

  const { list: suras } = useSuraList();
  const { recentSuraNumbers, refetch: refetchRecent } = useRecentSuras();
  const { getStatus, completedCount, totalLessons, loading: progressLoading } =
    useLearnProgress(activeCourse?.id ?? PROPHETS_COURSE_ID);
  const { goal: weeklyGoal, done: weeklyDone, setGoal } = useWeeklyGoal();
  const { streak, activeDays } = useLearnStreak();

  useFocusEffect(
    useCallback(() => {
      refetchRecent();
    }, [refetchRecent])
  );

  const recentSuras = useMemo(() => {
    const byNumber = new Map(suras.map((s) => [s.number, s]));
    return recentSuraNumbers
      .map((n) => byNumber.get(n))
      .filter((s): s is SuraMeta => s != null);
  }, [suras, recentSuraNumbers]);

  const nextLesson = useMemo((): LearnLesson | null => {
    if (progressLoading || !activeCourse) return null;
    for (let i = 0; i < activeCourse.lessons.length; i++) {
      const lesson = activeCourse.lessons[i];
      if (getStatus(lesson.id, i) === "available") return lesson;
    }
    return null;
  }, [activeCourse, getStatus, progressLoading]);

  const lastCompletedLesson = useMemo((): LearnLesson | null => {
    if (progressLoading || !activeCourse) return null;
    for (let i = activeCourse.lessons.length - 1; i >= 0; i--) {
      const lesson = activeCourse.lessons[i];
      if (getStatus(lesson.id, i) === "completed") return lesson;
    }
    return null;
  }, [activeCourse, getStatus, progressLoading]);

  const coursePercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const heroColor = getCourseHeroColor(
    activeCourse?.id ?? PROPHETS_COURSE_ID,
    colors.accent
  );

  const planItems = useMemo((): LearnPathItem[] => {
    if (!activeCourse) return [];
    return activeCourse.lessons.map((lesson, index) => {
      const status: LessonStatus = progressLoading
        ? index === 0
          ? "available"
          : "locked"
        : getStatus(lesson.id, index);
      return { lesson, index, status };
    });
  }, [activeCourse, getStatus, progressLoading]);

  const filteredPlanItems = useMemo(() => {
    switch (planFilter) {
      case "todo":
        return planItems.filter((i) => i.status !== "completed");
      case "done":
        return planItems.filter((i) => i.status === "completed");
      case "all":
        return planItems;
      default: {
        const _exhaustive: never = planFilter;
        return _exhaustive;
      }
    }
  }, [planFilter, planItems]);

  const hapticPress = () => {
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const openLesson = (lessonId: string) => {
    hapticPress();
    router.push(`/(root)/apprendre/lecon/${lessonId}` as const);
  };

  const showGoalPicker = () => {
    hapticPress();
    Alert.alert(
      t("learn.goalPickerTitle"),
      t("learn.goalPickerMessage"),
      [3, 5, 7].map((goal) => ({
        text: t("learn.goalOption", { count: goal }),
        onPress: () => void setGoal(goal),
      })),
      { cancelable: true }
    );
  };

  return (
    <ScreenBackground style={ui.background}>
      <SafeAreaView style={ui.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.learnTitle")}
          subtitle={t("screens.learnSubtitle")}
          style={screenPageHeaderSpacing}
          rightElement={
            <View style={homeStyles.headerRight}>
              <View style={homeStyles.flamePill}>
                <AppIcon name="zap" size={22} color={colors.accent} />
                <Text style={homeStyles.flameValue}>{streak}</Text>
              </View>
              <Pressable
                onPress={() => router.push("/(root)/apprendre-stats")}
                accessibilityRole="button"
                accessibilityLabel={t("learn.statsLabel")}
                style={({ pressed }) => [
                  homeStyles.statsBtn,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Image
                  source={{
                    uri:
                      user?.avatar ??
                      "https://ui-avatars.com/api/?name=U&size=80",
                  }}
                  style={homeStyles.avatar}
                />
              </Pressable>
            </View>
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[screenScrollContent, homeStyles.scrollContent]}
        >
          <View style={homeStyles.metaRow}>
            <CoursePicker
              courses={courses}
              selectedCourseId={activeCourse?.id ?? PROPHETS_COURSE_ID}
              onSelect={setSelectedCourseId}
            />
          </View>

          <View style={styles.tabsRow}>
            {tabs.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={styles.tab}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab.id }}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    { fontSize: typography.body },
                    activeTab === tab.id && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {activeTab === tab.id ? (
                  <View style={styles.tabUnderline} />
                ) : null}
              </Pressable>
            ))}
          </View>

          {activeTab === "today" && (
            <>
              <LearnWeekStrip activeDays={activeDays} />

              {nextLesson ? (
                <LearnHero
                  eyebrow={`${t("learn.continuePrefix")} · ${activeCourse?.title ?? ""}`}
                  title={`${nextLesson.title} — ${nextLesson.subtitle}`}
                  meta={
                    t("learn.progress", {
                      done: completedCount,
                      total: totalLessons,
                    }) + ` · ${coursePercent}%`
                  }
                  ctaLabel={t("learn.start")}
                  accentColor={heroColor}
                  onPress={() => openLesson(nextLesson.id)}
                />
              ) : completedCount >= totalLessons && totalLessons > 0 ? (
                <LearnHero
                  eyebrow={t("learn.tabPlan")}
                  title={t("learn.todayAllDone")}
                  meta={t("learn.progress", {
                    done: completedCount,
                    total: totalLessons,
                  })}
                  ctaLabel={t("learn.tabPlan")}
                  accentColor={heroColor}
                  onPress={() => setActiveTab("plan")}
                />
              ) : null}

              <View style={homeStyles.motivation}>
                <View
                  style={[
                    homeStyles.metricCard,
                    {
                      backgroundColor: colors.usesBackgroundImage
                        ? colors.card
                        : colors.cardElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[homeStyles.metricValue, { color: colors.text }]}>
                    {completedCount}
                  </Text>
                  <Text
                    style={[homeStyles.metricLabel, { color: colors.textMuted }]}
                  >
                    {t("learn.lessonsStat")}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <LearnGoalCard
                    label={t("learn.dailyObjective")}
                    done={weeklyDone}
                    goal={weeklyGoal > 0 ? weeklyGoal : 3}
                    unitLabel={t("learn.lessonsStat").toLowerCase()}
                    doneHint={t("learn.dailyObjectiveDone")}
                    onPress={showGoalPicker}
                  />
                </View>
              </View>

              {lastCompletedLesson ? (
                <LearnResumeCard
                  eyebrow={t("learn.resumeLabel")}
                  title={`${lastCompletedLesson.title} — ${lastCompletedLesson.subtitle}`}
                  subtitle={t("learn.resumeHint")}
                  ctaLabel={t("learn.review")}
                  onPress={() => openLesson(lastCompletedLesson.id)}
                />
              ) : null}

              <View style={styles.section}>
                <SectionHeader
                  title={t("learn.recentSuras")}
                  onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
                  seeAllLabel={t("learn.recentSeeAll")}
                />
                {recentSuras.length === 0 ? (
                  <View style={styles.emptyRow}>
                    <AppIcon name="book-open" size={22} color={colors.iconMuted} />
                    <Text style={[styles.rowSub, { flex: 1 }]}>
                      {t("learn.recentEmpty")}
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    contentContainerStyle={[
                      styles.recentScroll,
                      { paddingRight: H_PADDING },
                    ]}
                  >
                    {recentSuras.map((sura) => (
                      <RecentSuraTile
                        key={sura.number}
                        sura={sura}
                        styles={styles}
                        onPress={() => {
                          hapticPress();
                          router.push(
                            `/(root)/(tabs)/coran/${sura.number}` as const
                          );
                        }}
                      />
                    ))}
                  </ScrollView>
                )}
              </View>
            </>
          )}

          {activeTab === "plan" && (
            <>
              <LearnPlanHeader
                title={activeCourse?.title ?? ""}
                subtitle={activeCourse?.subtitle}
                done={completedCount}
                total={totalLessons}
                heroColor={heroColor}
              />
              <LearnPlanFilters value={planFilter} onChange={setPlanFilter} />
              <LearnLessonPath
                items={filteredPlanItems}
                heroColor={heroColor}
                onPressLesson={openLesson}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

function createHomeLearnStyles(colors: ReturnType<typeof useAppTheme>) {
  const cardShadow = colors.isDark ? SHADOW.dark : SHADOW.light;
  return StyleSheet.create({
    scrollContent: {
      paddingTop: SPACE.xs,
      paddingBottom: 120,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      flexShrink: 0,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      marginBottom: SPACE.sm,
    },
    flamePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 2,
    },
    flameValue: {
      fontFamily: "PlusJakartaSans-Bold",
      fontSize: 18,
      color: colors.text,
    },
    statsBtn: {
      padding: 2,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    motivation: {
      flexDirection: "row",
      gap: SPACE.sm,
      marginTop: SPACE.md,
      marginBottom: SECTION_GAP,
    },
    metricCard: {
      width: 88,
      borderRadius: CARD_RADIUS,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      ...cardShadow,
    },
    metricValue: {
      fontFamily: "PlusJakartaSans-Bold",
      fontSize: 28,
    },
    metricLabel: {
      fontFamily: "PlusJakartaSans-Regular",
      fontSize: 11,
      marginTop: 2,
    },
  });
}

const ui = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
});
