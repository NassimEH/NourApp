import {

  Image,

  ScrollView,

  StyleSheet,

  Text,

  TouchableOpacity,

  View,

} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/AppIcon";

import { useMemo, useState , useCallback } from "react";

import { router, useFocusEffect } from "expo-router";





import { useGlobalContext } from "@/lib/global-provider";

import {
  SCREEN_EDGE_PADDING,
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { ScreenBackground } from "@/components/ScreenBackground";

import { SectionHeader } from "@/components/SectionHeader";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";

import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { MIN_TOUCH_TARGET, SECTION_GAP } from "@/lib/ui/spacing";

import { useSuraList, useRecentSuras } from "@/lib/quran/hooks";

import type { SuraMeta } from "@/lib/quran/types";



import {
  getLearnCourses,
  PROPHETS_COURSE_ID,
} from "@/lib/learn/courses";
import { useAppPreferences } from "@/lib/app-preferences";
import { useLearnProgress } from "@/lib/learn/hooks/useLearnProgress";
import { useLearnCatalog } from "@/lib/learn/hooks/useLearnCatalog";
import { useWeeklyGoal } from "@/lib/learn/hooks/useWeeklyGoal";
import type { LessonStatus } from "@/lib/learn/types";



const H_PADDING = SCREEN_EDGE_PADDING;

function hairlineBorder(borderColor: string) {
  return { borderWidth: StyleSheet.hairlineWidth, borderColor } as const;
}






const LESSON_COLORS = [
  "#3d6b47",
  "#2d6a7a",
  "#a65c3e",
  "#5c4a8a",
  "#2d5a8a",
] as const;



function RecentSuraCard({

  sura,

  onPress,

}: {

  sura: SuraMeta;

  onPress: () => void;

}) {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const revelation =
    sura.revelationType === "Meccan"
      ? t("library.suraMeccan")
      : t("library.suraMedinan");

  return (
    <TouchableOpacity
      style={[styles.recentSuraCard, hairlineBorder(colors.border)]}

      onPress={onPress}

      activeOpacity={0.8}

    >

      <View style={[styles.recentSuraNumberWrap, hairlineBorder(colors.border)]}>

        <Text style={[styles.recentSuraNumber, { color: colors.text }]}>
          {sura.number}
        </Text>

      </View>

      <Text style={[styles.recentSuraTitle, { color: colors.text }]} numberOfLines={1}>

        {sura.englishName}

      </Text>

      <Text
        style={[styles.recentSuraSubtitle, { color: colors.textMuted }]}
        numberOfLines={2}
      >

        {sura.numberOfAyahs} versets · {revelation}

      </Text>

    </TouchableOpacity>

  );

}



export default function ApprendreScreen() {

  const { user } = useGlobalContext();

  const { t } = useTranslation();
  const colors = useAppTheme();
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

  const typography = useAppTypography();
  const cardBorder = hairlineBorder(colors.border);

  return (
    <ScreenBackground style={styles.background}>

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.learnTitle")}
          subtitle={`${t("screens.learnSubtitle")} · ${user?.name ?? t("home.defaultUser")}`}
          style={screenPageHeaderSpacing}
          rightElement={
            <View style={styles.headerRight}>
              <View style={[styles.streakBadge, cardBorder]}>
                <AppIcon name="zap" size={28} color={colors.accent} />
                <Text style={[styles.streakCount, { color: colors.text }]}>
                  {totalCompleted}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(root)/apprendre-stats")}
                activeOpacity={0.8}
                style={styles.avatarTouchable}
              >
                <Image
                  source={{
                    uri:
                      user?.avatar ??
                      "https://ui-avatars.com/api/?name=U&size=80",
                  }}
                  style={[styles.headerAvatar, cardBorder]}
                />
              </TouchableOpacity>
            </View>
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.tabsRow, cardBorder]}>

            {tabs.map((tab) => (

              <TouchableOpacity

                key={tab.id}

                style={styles.tab}

                onPress={() => setActiveTab(tab.id)}

                activeOpacity={0.7}

              >

                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color:
                        activeTab === tab.id ? colors.text : colors.textMuted,
                      fontSize: typography.body,
                    },
                    activeTab === tab.id && styles.tabLabelActive,
                  ]}
                >

                  {tab.label}

                </Text>

                {activeTab === tab.id ? (
                  <View
                    style={[styles.tabUnderline, { backgroundColor: colors.accent }]}
                  />
                ) : null}

              </TouchableOpacity>

            ))}

          </View>



          {activeTab === "today" && (
            <>
          <TouchableOpacity
            style={[styles.goalCard, cardBorder]}
            activeOpacity={0.8}
            onPress={cycleGoal}
          >
            <View style={[styles.goalIconWrap, cardBorder]}>
              <AppIcon name="flag" size={24} color={colors.textMuted} />
            </View>
            <View style={styles.goalTextWrap}>
              <Text style={[styles.goalText, { color: colors.text }]}>
                {t("learn.setWeeklyGoal")}
              </Text>
              {weeklyGoal > 0 ? (
                <Text style={[styles.goalSub, { color: colors.textMuted }]}>
                  {t("learn.weeklyGoalProgress", {
                    done: weeklyDone,
                    goal: weeklyGoal,
                  })}
                </Text>
              ) : (
                <Text style={[styles.goalSub, { color: colors.textMuted }]}>
                  {t("learn.weeklyGoalTap")}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {completedCount < totalLessons && nextLesson ? (
            <TouchableOpacity
              style={[styles.nextLessonCard, cardBorder, { borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() =>
                router.push(`/(root)/apprendre/lecon/${nextLesson.id}` as const)
              }
            >
              <Text style={[styles.nextLessonLabel, { color: colors.textMuted }]}>
                {t("learn.todayNextLesson")}
              </Text>
              <Text style={[styles.nextLessonTitle, { color: colors.text }]}>
                {nextLesson.title} — {nextLesson.subtitle}
              </Text>
              <View style={styles.nextLessonCta}>
                <Text style={[styles.nextLessonCtaText, { color: colors.accent }]}>
                  {t("learn.start")}
                </Text>
                <AppIcon name="chevron-right" size={18} color={colors.accent} />
              </View>
            </TouchableOpacity>
          ) : completedCount >= totalLessons ? (
            <View style={[styles.nextLessonCard, cardBorder, { borderColor: colors.border }]}>
              <Text style={[styles.nextLessonTitle, { color: colors.text }]}>
                {t("learn.todayAllDone")}
              </Text>
            </View>
          ) : null}

          <View style={styles.recentSection}>
            <SectionHeader
              title={t("learn.recentSuras")}
              onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
              seeAllLabel={t("learn.recentSeeAll")}
            />

            {recentSuras.length === 0 ? (

              <View style={[styles.recentEmpty, cardBorder]}>

                <AppIcon name="book-open" size={22} color={colors.iconMuted} />

                <Text style={[styles.recentEmptyText, { color: colors.textMuted }]}>
                  {t("learn.recentEmpty")}
                </Text>

              </View>

            ) : (

              <ScrollView

                horizontal

                showsHorizontalScrollIndicator={false}

                contentContainerStyle={styles.recentScroll}

              >

                {recentSuras.map((sura) => (

                  <RecentSuraCard

                    key={sura.number}

                    sura={sura}

                    onPress={() =>

                      router.push(`/(root)/(tabs)/coran/${sura.number}` as const)

                    }

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
            contentContainerStyle={styles.courseChips}
          >
            {courses.map((course) => {
              const selected = course.id === activeCourse?.id;
              return (
                <TouchableOpacity
                  key={course.id}
                  style={[
                    styles.courseChip,
                    cardBorder,
                    {
                      backgroundColor: selected
                        ? colors.accent
                        : colors.card,
                    },
                  ]}
                  onPress={() => setSelectedCourseId(course.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.courseChipText,
                      {
                        color: selected ? "#fff" : colors.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {course.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.courseTitle, { color: colors.text }]}>
            {activeCourse?.title}
          </Text>
          <Text style={[styles.courseSubtitle, { color: colors.textMuted }]}>
            {activeCourse?.subtitle} ·{" "}
            {t("learn.progress", { done: completedCount, total: totalLessons })}
          </Text>

          {(activeCourse?.lessons ?? []).map((lesson, index) => {
            const status: LessonStatus = progressLoading
              ? index === 0
                ? "available"
                : "locked"
              : getStatus(lesson.id, index);
            const locked = status === "locked";
            const completed = status === "completed";
            const color = LESSON_COLORS[index % LESSON_COLORS.length];
            const cardColor = locked ? `${color}18` : color;

            const openLesson = () => {
              if (locked) return;
              router.push(`/(root)/apprendre/lecon/${lesson.id}` as const);
            };

            return (
              <View key={lesson.id} style={styles.lessonCardWrap}>
                {locked ? (
                  <View
                    style={[
                      styles.lessonCardRect,
                      styles.lessonCardLocked,
                      cardBorder,
                      { backgroundColor: cardColor },
                    ]}
                  >
                    <View style={[styles.lockIconWrap, cardBorder]}>
                      <AppIcon name="lock" size={20} color={colors.icon} />
                    </View>
                    <View style={styles.lessonCardLockedText}>
                      <Text style={styles.lessonLockedTitle} numberOfLines={1}>
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonLockedSubtitle}>
                        {t("learn.lesson")} {lesson.order} · {t("learn.lessonLocked")}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.lessonCardRect,
                      styles.lessonCardActive,
                      cardBorder,
                      { backgroundColor: cardColor },
                    ]}
                  >
                    <View style={styles.lessonCardActiveContent}>
                      <Text style={styles.lessonActiveBadge}>
                        {t("learn.lesson")} {lesson.order}
                        {completed ? ` · ${t("learn.lessonCompleted")}` : ""}
                      </Text>
                      <Text style={styles.lessonActiveTitle} numberOfLines={2}>
                        {lesson.title} — {lesson.subtitle}
                      </Text>
                      <View style={styles.lessonActiveVisual}>
                        <View style={[styles.lessonVisualPlaceholder, cardBorder]}>
                          <AppIcon
                            name={completed ? "check-circle" : "star"}
                            size={36}
                            color="rgba(255,255,255,0.85)"
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        style={[styles.startButton, cardBorder]}
                        activeOpacity={0.8}
                        onPress={openLesson}
                      >
                        <Text style={styles.startButtonText}>
                          {completed ? t("learn.review") : t("learn.start")}
                        </Text>
                        <AppIcon name="chevron-right" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
            </>
          )}

          <View style={styles.bottomSpacer} />

        </ScrollView>

      </SafeAreaView>

    </ScreenBackground>

  );

}



const styles = StyleSheet.create({

  background: { flex: 1 },

  safeArea: { flex: 1, backgroundColor: "transparent" },

  scrollContent: {
    ...screenScrollContent,
    paddingTop: 8,
  },

  headerRight: {

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

  },

  streakBadge: {

    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: "rgba(255,255,255,0.65)",

  },

  streakCount: {

    fontSize: 20,

    fontFamily: "PlusJakartaSans-Bold",

  },

  avatarTouchable: {},

  headerAvatar: {

    width: 44,

    height: 44,

    borderRadius: 22,

  },



  tabsRow: {

    flexDirection: "row",

    marginBottom: 24,

    gap: 24,

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 12,

    backgroundColor: "rgba(255,255,255,0.55)",

  },

  tab: {
    paddingVertical: 8,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: "center",
  },

  tabLabel: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
  },

  tabLabelActive: {
    fontFamily: "PlusJakartaSans-Bold",

  },

  tabUnderline: {

    position: "absolute",

    left: 0,

    right: 0,

    bottom: 0,

    height: 3,

    backgroundColor: "transparent",

    borderRadius: 2,

  },



  goalCard: {

    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 16,

    paddingHorizontal: 18,

    marginBottom: 28,

    backgroundColor: "rgba(255,255,255,0.6)",

    borderRadius: 16,

  },

  goalIconWrap: {

    width: 48,

    height: 48,

    borderRadius: 24,

    backgroundColor: "rgba(0,0,0,0.06)",

    alignItems: "center",

    justifyContent: "center",

    marginRight: 14,

  },

  goalTextWrap: {
    flex: 1,
    gap: 4,
  },
  goalText: {

    fontSize: 16,

    fontFamily: "PlusJakartaSans-SemiBold",


  },
  goalSub: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 18,
  },



  recentSection: {

    marginBottom: 28,

  },

  recentSectionHeader: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 14,

  },

  recentSectionTitle: {

    fontSize: 20,

    fontFamily: "PlusJakartaSans-Bold",


  },

  recentSeeAll: {

    fontSize: 13,

    fontFamily: "PlusJakartaSans-SemiBold",


  },

  recentScroll: {

    flexDirection: "row",

    gap: 12,

    paddingRight: 4,

  },

  recentSuraCard: {

    width: 132,

    padding: 12,

    borderRadius: 12,

    backgroundColor: "rgba(255,255,255,0.72)",

  },

  recentSuraNumberWrap: {

    width: 32,

    height: 32,

    borderRadius: 8,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 10,

    backgroundColor: "rgba(61, 107, 71, 0.12)",

  },

  recentSuraNumber: {

    fontSize: 14,

    fontFamily: "PlusJakartaSans-Bold",


  },

  recentSuraTitle: {

    fontSize: 14,

    fontFamily: "PlusJakartaSans-SemiBold",


    marginBottom: 4,

  },

  recentSuraSubtitle: {

    fontSize: 11,

    fontFamily: "PlusJakartaSans-Regular",


    lineHeight: 15,

  },

  recentEmpty: {

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    padding: 16,

    borderRadius: 12,

    backgroundColor: "rgba(255,255,255,0.55)",

  },

  recentEmptyText: {

    flex: 1,

    fontSize: 14,

    fontFamily: "PlusJakartaSans-Regular",


    lineHeight: 20,

  },



  courseChips: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    paddingRight: H_PADDING,
  },
  courseChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: 220,
  },
  courseChipText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  courseTitle: {

    fontSize: 20,

    fontFamily: "PlusJakartaSans-Bold",


    marginBottom: 6,

  },

  courseSubtitle: {

    fontSize: 14,

    fontFamily: "PlusJakartaSans-Regular",


    marginBottom: 20,

    lineHeight: 20,

  },

  nextLessonCard: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "rgba(255,255,255,0.65)",
    gap: 8,
  },
  nextLessonLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  nextLessonTitle: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Bold",
  },
  nextLessonCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  nextLessonCtaText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },

  lessonCardWrap: {

    marginBottom: 16,

  },

  lessonCardRect: {

    borderRadius: 16,

    overflow: "hidden",

    shadowColor: "#000",

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.12,

    shadowRadius: 12,

    elevation: 6,

    minHeight: 140,

  },

  lessonCardLocked: {

    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 18,

    paddingHorizontal: 20,

  },

  lockIconWrap: {

    width: 48,

    height: 48,

    borderRadius: 24,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 16,

    backgroundColor: "rgba(255,255,255,0.95)",

  },

  lessonCardLockedText: { flex: 1 },

  lessonCardArrow: {

    padding: 8,

  },

  lessonLockedTitle: {

    fontSize: 16,

    fontFamily: "PlusJakartaSans-SemiBold",


  },

  lessonLockedSubtitle: {

    fontSize: 13,

    fontFamily: "PlusJakartaSans-Regular",


    marginTop: 2,

  },



  lessonCardActive: {

    overflow: "hidden",

  },

  lessonCardActiveContent: {

    padding: 20,

    minHeight: 140,

    justifyContent: "space-between",

  },

  lessonActiveBadge: {

    fontSize: 12,

    fontFamily: "PlusJakartaSans-Medium",

    color: "rgba(255,255,255,0.9)",

    marginBottom: 4,

  },

  lessonActiveTitle: {

    fontSize: 18,

    fontFamily: "PlusJakartaSans-Bold",

    color: "#fff",

    marginBottom: 10,

  },

  lessonActiveVisual: {

    marginBottom: 12,

  },

  lessonVisualPlaceholder: {

    height: 72,

    borderRadius: 12,

    backgroundColor: "rgba(0,0,0,0.2)",

    alignItems: "center",

    justifyContent: "center",

  },

  startButton: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    alignSelf: "flex-start",

    paddingVertical: 12,

    paddingHorizontal: 20,

    backgroundColor: "rgba(0,0,0,0.35)",

    borderRadius: 12,

  },

  startButtonText: {

    fontSize: 15,

    fontFamily: "PlusJakartaSans-SemiBold",

    color: "#fff",

  },



  bottomSpacer: { height: 24 },

});


