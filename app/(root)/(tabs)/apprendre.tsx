import { useCallback, useMemo, useState } from "react";
import {
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
import { LibrarySectionDivider } from "@/components/library/LibraryEntry";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SectionHeader } from "@/components/SectionHeader";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
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
import {
  getLearnCourses,
  PROPHETS_COURSE_ID,
} from "@/lib/learn/courses";
import { useLearnCatalog } from "@/lib/learn/hooks/useLearnCatalog";
import { useLearnProgress } from "@/lib/learn/hooks/useLearnProgress";
import { useWeeklyGoal } from "@/lib/learn/hooks/useWeeklyGoal";
import type { LessonStatus } from "@/lib/learn/types";
import { createLearnScreenStyles } from "@/lib/learn-screen-styles";
import { useSuraList, useRecentSuras } from "@/lib/quran/hooks";
import type { SuraMeta } from "@/lib/quran/types";

const H_PADDING = SCREEN_EDGE_PADDING;

function LearnDivider({ tight }: { tight?: boolean }) {
  const colors = useAppTheme();
  const styles = useMemo(() => createLearnScreenStyles(colors), [colors]);
  return <View style={tight ? styles.dividerTight : styles.divider} />;
}

function RecentSuraTile({
  sura,
  onPress,
  styles,
}: {
  sura: SuraMeta;
  onPress: () => void;
  styles: ReturnType<typeof createLearnScreenStyles>;
}) {
  const { rtlTextStyle } = useTranslation();
  const revelation =
    sura.revelationType === "Meccan" ? "Mecquoise" : "Médinoise";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={sura.englishName}
      style={({ pressed }) => [
        styles.recentTile,
        pressed && styles.recentTilePressed,
      ]}
    >
      <Text style={styles.recentNumber}>{sura.number}</Text>
      <Text style={[styles.recentTitle, rtlTextStyle]} numberOfLines={1}>
        {sura.englishName}
      </Text>
      <Text style={[styles.recentSub, rtlTextStyle]} numberOfLines={2}>
        {sura.numberOfAyahs} · {revelation}
      </Text>
    </Pressable>
  );
}

export default function ApprendreScreen() {
  const { user } = useGlobalContext();
  const { t } = useTranslation();
  const colors = useAppTheme();
  const styles = useMemo(() => createLearnScreenStyles(colors), [colors]);
  const typography = useAppTypography();
  const { locale } = useAppPreferences();
  const courses = useMemo(() => getLearnCourses(locale), [locale]);
  const [selectedCourseId, setSelectedCourseId] = useState(PROPHETS_COURSE_ID);
  const activeCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) ?? courses[0],
    [courses, selectedCourseId]
  );
  const [activeTab, setActiveTab] = useState<"today" | "plan">("today");

  const tabs = useMemo(
    () => [
      { id: "today" as const, label: t("learn.tabToday") },
      { id: "plan" as const, label: t("learn.tabPlan") },
    ],
    [t]
  );

  const { list: suras } = useSuraList();
  const { recentSuraNumbers, refetch: refetchRecent } = useRecentSuras();
  const { findNextLesson, totalCompleted, loading: catalogLoading } =
    useLearnCatalog();
  const { getStatus, completedCount, totalLessons, loading: progressLoading } =
    useLearnProgress(activeCourse?.id ?? PROPHETS_COURSE_ID);
  const { goal: weeklyGoal, done: weeklyDone, cycleGoal } = useWeeklyGoal();

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

  const nextLesson = useMemo(() => {
    if (catalogLoading) return null;
    return findNextLesson();
  }, [catalogLoading, findNextLesson]);

  const hapticPress = () => {
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <ScreenBackground style={ui.background}>
      <SafeAreaView style={ui.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.learnTitle")}
          subtitle={`${t("screens.learnSubtitle")} · ${user?.name ?? t("home.defaultUser")}`}
          style={screenPageHeaderSpacing}
          rightElement={
            <View style={styles.headerRight}>
              <View style={styles.streakBadge}>
                <AppIcon name="zap" size={22} color={colors.accent} />
                <Text style={styles.streakCount}>{totalCompleted}</Text>
              </View>
              <Pressable
                onPress={() => router.push("/apprendre-stats")}
                accessibilityRole="button"
                style={({ pressed }) => pressed && { opacity: 0.85 }}
              >
                <Image
                  source={{
                    uri:
                      user?.avatar ??
                      "https://ui-avatars.com/api/?name=U&size=80",
                  }}
                  style={styles.headerAvatar}
                />
              </Pressable>
            </View>
          }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[screenScrollContent, styles.scrollContent]}
        >
          <LibrarySectionDivider variant="header" />

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
              <Pressable
                onPress={() => {
                  hapticPress();
                  cycleGoal();
                }}
                style={({ pressed }) => [
                  styles.rowPressable,
                  pressed && styles.rowPressablePressed,
                ]}
                accessibilityRole="button"
              >
                <View style={styles.iconWrap}>
                  <AppIcon name="flag" size={22} color={colors.accent} />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{t("learn.setWeeklyGoal")}</Text>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {weeklyGoal > 0
                      ? t("learn.weeklyGoalProgress", {
                          done: weeklyDone,
                          goal: weeklyGoal,
                        })
                      : t("learn.weeklyGoalTap")}
                  </Text>
                </View>
                <AppIcon name="chevron-right" size={18} color={colors.iconMuted} />
              </Pressable>

              <LearnDivider tight />

              {completedCount < totalLessons && nextLesson ? (
                <Pressable
                  onPress={() => {
                    hapticPress();
                    router.push(
                      `/(root)/apprendre/lecon/${nextLesson.id}` as const
                    );
                  }}
                  style={({ pressed }) => [
                    styles.highlightBlock,
                    pressed && { opacity: 0.92 },
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={styles.highlightLabel}>
                    {t("learn.todayNextLesson")}
                  </Text>
                  <Text style={styles.highlightTitle} numberOfLines={2}>
                    {nextLesson.title} — {nextLesson.subtitle}
                  </Text>
                  <View style={styles.highlightCta}>
                    <Text style={styles.rowAction}>{t("learn.start")}</Text>
                    <AppIcon name="chevron-right" size={16} color={colors.accent} />
                  </View>
                </Pressable>
              ) : completedCount >= totalLessons ? (
                <View style={styles.highlightBlock}>
                  <Text style={styles.highlightTitle}>
                    {t("learn.todayAllDone")}
                  </Text>
                </View>
              ) : null}

              <LearnDivider />

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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.chipScroll,
                  { paddingRight: H_PADDING },
                ]}
              >
                {courses.map((course) => {
                  const selected = course.id === activeCourse?.id;
                  return (
                    <Pressable
                      key={course.id}
                      onPress={() => setSelectedCourseId(course.id)}
                      style={[
                        styles.chip,
                        selected && styles.chipActive,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selected && styles.chipTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {course.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{activeCourse?.title}</Text>
                <Text style={styles.planSub}>
                  {activeCourse?.subtitle} ·{" "}
                  {t("learn.progress", {
                    done: completedCount,
                    total: totalLessons,
                  })}
                </Text>
              </View>

              <LearnDivider tight />

              <View style={styles.lessonList}>
                {(activeCourse?.lessons ?? []).map((lesson, index) => {
                  const status: LessonStatus = progressLoading
                    ? index === 0
                      ? "available"
                      : "locked"
                    : getStatus(lesson.id, index);
                  const locked = status === "locked";
                  const completed = status === "completed";

                  const openLesson = () => {
                    if (locked) return;
                    hapticPress();
                    router.push(
                      `/(root)/apprendre/lecon/${lesson.id}` as const
                    );
                  };

                  return (
                    <Pressable
                      key={lesson.id}
                      onPress={openLesson}
                      disabled={locked}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: locked }}
                      style={({ pressed }) => [
                        styles.lessonRow,
                        locked && styles.lessonRowLocked,
                        pressed && !locked && styles.lessonRowPressed,
                      ]}
                    >
                      {!locked ? (
                        <View style={styles.lessonAccentBar} />
                      ) : (
                        <View style={[styles.iconWrap, styles.iconWrapMuted]}>
                          <AppIcon name="lock" size={20} color={colors.iconMuted} />
                        </View>
                      )}
                      <View style={styles.rowBody}>
                        <Text style={styles.lessonMeta}>
                          {t("learn.lesson")} {lesson.order}
                          {completed ? ` · ${t("learn.lessonCompleted")}` : ""}
                        </Text>
                        <Text style={styles.lessonTitle} numberOfLines={2}>
                          {lesson.title}
                          {lesson.subtitle ? ` — ${lesson.subtitle}` : ""}
                        </Text>
                        {!locked ? (
                          <Text style={styles.rowAction}>
                            {completed ? t("learn.review") : t("learn.start")}
                          </Text>
                        ) : (
                          <Text style={styles.rowSub} numberOfLines={1}>
                            {t("learn.lessonLocked")}
                          </Text>
                        )}
                      </View>
                      {!locked ? (
                        <AppIcon
                          name="chevron-right"
                          size={18}
                          color={colors.iconMuted}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const ui = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
});
