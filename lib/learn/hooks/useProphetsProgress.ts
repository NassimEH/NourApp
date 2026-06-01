import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { PROPHETS_COURSE } from "../courses/prophets";
import {
  getCompletedLessonIds,
  isLessonUnlocked,
  markLessonCompleted,
} from "../progress";
import type { LessonStatus } from "../types";

export function useProphetsProgress() {
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
      if (completedIds.includes(lessonId)) return "completed";
      if (isLessonUnlocked(index, PROPHETS_COURSE.lessons, completedIds)) {
        return "available";
      }
      return "locked";
    },
    [completedIds]
  );

  const completeLesson = useCallback(
    async (lessonId: string) => {
      await markLessonCompleted(lessonId);
      setCompletedIds((prev) =>
        prev.includes(lessonId) ? prev : [...prev, lessonId]
      );
    },
    []
  );

  const completedCount = PROPHETS_COURSE.lessons.filter((l) =>
    completedIds.includes(l.id)
  ).length;

  return {
    completedIds,
    loading,
    refresh,
    getStatus,
    completeLesson,
    completedCount,
    totalLessons: PROPHETS_COURSE.lessons.length,
  };
}
