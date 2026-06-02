import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { useAppPreferences } from "@/lib/app-preferences";
import { getLearnCourses } from "../courses";
import { getAllCompletedLessonIds, isLessonUnlocked } from "../progress";
import type { LearnLesson } from "../types";

export function useLearnCatalog() {
  const { locale } = useAppPreferences();
  const courses = useMemo(() => getLearnCourses(locale), [locale]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setCompletedIds(await getAllCompletedLessonIds(courses.map((c) => c.id)));
    } finally {
      setLoading(false);
    }
  }, [courses]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const findNextLesson = useCallback((): LearnLesson | null => {
    for (const course of courses) {
      for (let i = 0; i < course.lessons.length; i++) {
        const lesson = course.lessons[i];
        if (completedIds.includes(lesson.id)) continue;
        if (isLessonUnlocked(i, course.lessons, completedIds)) return lesson;
      }
    }
    return null;
  }, [courses, completedIds]);

  const totalCompleted = useMemo(
    () =>
      courses.reduce(
        (n, c) =>
          n + c.lessons.filter((l) => completedIds.includes(l.id)).length,
        0
      ),
    [courses, completedIds]
  );

  const totalLessons = useMemo(
    () => courses.reduce((n, c) => n + c.lessons.length, 0),
    [courses]
  );

  return {
    courses,
    completedIds,
    loading,
    refresh,
    findNextLesson,
    totalCompleted,
    totalLessons,
  };
}
