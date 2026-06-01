import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { useAppPreferences } from "@/lib/app-preferences";
import { getLearnCourse } from "../courses";
import {
  getCompletedLessonIds,
  isLessonUnlocked,
  markLessonCompleted,
} from "../progress";
import type { LessonStatus } from "../types";

export function useLearnProgress(courseId: string) {
  const { locale } = useAppPreferences();
  const course = useMemo(
    () => getLearnCourse(courseId, locale),
    [courseId, locale]
  );
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const ids = await getCompletedLessonIds();
      setCompletedIds(ids);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const getStatus = useCallback(
    (lessonId: string, index: number): LessonStatus => {
      if (!course) return "locked";
      if (completedIds.includes(lessonId)) return "completed";
      if (isLessonUnlocked(index, course.lessons, completedIds)) {
        return "available";
      }
      return "locked";
    },
    [completedIds, course]
  );

  const completeLesson = useCallback(async (lessonId: string) => {
    await markLessonCompleted(lessonId);
    setCompletedIds((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    );
  }, []);

  const completedCount = course
    ? course.lessons.filter((l) => completedIds.includes(l.id)).length
    : 0;

  return {
    course,
    completedIds,
    loading,
    refresh,
    getStatus,
    completeLesson,
    completedCount,
    totalLessons: course?.lessons.length ?? 0,
  };
}
