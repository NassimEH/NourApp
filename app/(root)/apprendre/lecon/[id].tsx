import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import {
  SCREEN_EDGE_PADDING,
  screenScrollContent,
} from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { bodyLineHeight } from "@/lib/ui/typography";
import { useTranslation } from "@/lib/i18n";
import { getLearnLesson } from "@/lib/learn/courses";
import { useAppPreferences } from "@/lib/app-preferences";
import {
  getCompletedLessonIds,
  isLessonUnlocked,
  markLessonCompleted,
} from "@/lib/learn/progress";

type Phase = "content" | "quiz" | "result";

export default function LearnLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { locale } = useAppPreferences();
  const { t, rtlTextStyle } = useTranslation();
  const paragraphLh = bodyLineHeight(typography.body);
  const resolved = useMemo(
    () => (id ? getLearnLesson(id, locale) : undefined),
    [id, locale]
  );
  const course = resolved?.course;
  const lesson = resolved?.lesson;

  const [phase, setPhase] = useState<Phase>("content");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [unlocked, setUnlocked] = useState(false);
  const [passed, setPassed] = useState(false);
  const [checking, setChecking] = useState(true);

  const lessonIndex = useMemo(
    () => course?.lessons.findIndex((l) => l.id === id) ?? -1,
    [course?.lessons, id]
  );

  const nextLesson = useMemo(() => {
    if (!course || lessonIndex < 0 || lessonIndex >= course.lessons.length - 1) {
      return null;
    }
    return course.lessons[lessonIndex + 1];
  }, [lessonIndex, course]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setChecking(true);
        const completed = await getCompletedLessonIds();
        if (cancelled || !lesson) return;
        const ok =
          !course ||
          isLessonUnlocked(lessonIndex, course.lessons, completed) ||
          completed.includes(lesson.id);
        setUnlocked(ok);
        setChecking(false);
        if (!ok) router.back();
      })();
      return () => {
        cancelled = true;
      };
    }, [lesson, lessonIndex, course?.lessons])
  );

  const score = useMemo(() => {
    if (!lesson) return 0;
    return lesson.quiz.reduce((acc, q) => {
      return answers[q.id] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  }, [lesson, answers]);

  const allAnswered = useMemo(() => {
    if (!lesson) return false;
    return lesson.quiz.every((q) => answers[q.id] !== undefined);
  }, [lesson, answers]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!lesson || !allAnswered) return;
    const total = lesson.quiz.length;
    const success = score === total;
    setPassed(success);
    setPhase("result");
    if (success) {
      await markLessonCompleted(lesson.id);
    }
  }, [lesson, allAnswered, score]);

  if (!lesson) {
    return null;
  }

  if (checking) {
    return (
      <ScreenBackground style={styles.flex}>
        <SafeAreaView style={styles.flex} edges={["top", "left", "right"]} />
      </ScreenBackground>
    );
  }

  if (!unlocked) {
    return null;
  }

  return (
    <ScreenBackground style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={lesson.title}
          subtitle={`${t("learn.lesson")} ${lesson.order} · ${lesson.subtitle}`}
          onBack={() => router.back()}
        />
        <ScrollView
          contentContainerStyle={[
            screenScrollContent,
            styles.scroll,
            { paddingHorizontal: SCREEN_EDGE_PADDING },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {phase === "content" && (
            <>
              {lesson.nameAr ? (
                <Text style={[styles.nameAr, { color: colors.accent }]}>
                  {lesson.nameAr}
                </Text>
              ) : null}
              {lesson.sections.map((section) => (
                <View
                  key={section.heading}
                  style={[
                    styles.sectionCard,
                    {
                      backgroundColor: colors.usesBackgroundImage
                        ? colors.card
                        : colors.cardElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sectionHeading,
                      { color: colors.text },
                      rtlTextStyle,
                    ]}
                  >
                    {section.heading}
                  </Text>
                  <Text
                    style={[
                      styles.sectionBody,
                      {
                        color: colors.textMuted,
                        fontSize: typography.body,
                        lineHeight: paragraphLh,
                      },
                      rtlTextStyle,
                    ]}
                  >
                    {section.body}
                  </Text>
                </View>
              ))}
              <Pressable
                onPress={() => setPhase("quiz")}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: colors.accent },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.primaryBtnText, { color: colors.onAccent }]}>
                  {t("learn.startQuiz")}
                </Text>
                <AppIcon name="chevron-right" size={18} color={colors.onAccent} />
              </Pressable>
            </>
          )}

          {phase === "quiz" && (
            <>
              <Text style={[styles.quizIntro, { color: colors.textMuted }, rtlTextStyle]}>
                {t("learn.quizIntro")}
              </Text>
              {lesson.quiz.map((q, qIndex) => (
                <View
                  key={q.id}
                  style={[
                    styles.quizBlock,
                    {
                      backgroundColor: colors.usesBackgroundImage
                        ? colors.card
                        : colors.cardElevated,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.quizQuestion, { color: colors.text }, rtlTextStyle]}>
                    {qIndex + 1}. {q.question}
                  </Text>
                  {q.options.map((option, optIndex) => {
                    const selected = answers[q.id] === optIndex;
                    return (
                      <Pressable
                        key={option}
                        onPress={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: optIndex }))
                        }
                        style={[
                          styles.option,
                          {
                            borderColor: selected ? colors.accent : colors.border,
                            backgroundColor: selected
                              ? colors.accentSurface
                              : colors.backgroundSecondary,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            {
                              color: selected ? colors.accent : colors.text,
                            },
                            rtlTextStyle,
                          ]}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
              <Pressable
                onPress={handleSubmitQuiz}
                disabled={!allAnswered}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  {
                    backgroundColor: allAnswered
                      ? colors.accent
                      : colors.progressTrack,
                  },
                  pressed && allAnswered && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.primaryBtnText,
                    {
                      color: allAnswered ? colors.onAccent : colors.textMuted,
                    },
                  ]}
                >
                  {t("learn.validateQuiz")}
                </Text>
              </Pressable>
            </>
          )}

          {phase === "result" && (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: passed
                    ? colors.accentSurface
                    : colors.cardElevated,
                  borderColor: passed ? colors.accent : colors.border,
                },
              ]}
            >
              <AppIcon
                name={passed ? "check-circle" : "x-circle"}
                size={48}
                color={passed ? colors.accent : colors.danger}
              />
              <Text style={[styles.resultTitle, { color: colors.text }, rtlTextStyle]}>
                {passed ? t("learn.quizSuccess") : t("learn.quizFail")}
              </Text>
              <Text style={[styles.resultScore, { color: colors.textMuted }, rtlTextStyle]}>
                {t("learn.quizScore", { score, total: lesson.quiz.length })}
              </Text>
              {passed ? (
                nextLesson ? (
                  <Pressable
                    onPress={() =>
                      router.replace(
                        `/(root)/apprendre/lecon/${nextLesson.id}` as const
                      )
                    }
                    style={({ pressed }) => [
                      styles.primaryBtn,
                      { backgroundColor: colors.accent },
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.primaryBtnText, { color: colors.onAccent }]}>
                      {t("learn.nextLesson")} — {nextLesson.title}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                      styles.primaryBtn,
                      { backgroundColor: colors.accent },
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.primaryBtnText, { color: colors.onAccent }]}>
                      {t("learn.courseComplete")}
                    </Text>
                  </Pressable>
                )
              ) : (
                <Pressable
                  onPress={() => {
                    setAnswers({});
                    setPhase("quiz");
                  }}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    { borderColor: colors.accent },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.secondaryBtnText, { color: colors.accent }]}>
                    {t("learn.retryQuiz")}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingTop: 8, paddingBottom: 48 },
  nameAr: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
    marginBottom: 16,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    gap: 8,
  },
  sectionHeading: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Bold",
  },
  sectionBody: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    marginTop: 12,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  pressed: { opacity: 0.88 },
  quizIntro: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 16,
    lineHeight: 20,
  },
  quizBlock: {
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
    gap: 10,
  },
  quizQuestion: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 4,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
  resultCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    marginTop: 8,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
  },
  resultScore: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
    marginBottom: 8,
  },
  bottomSpacer: { height: 32 },
});
