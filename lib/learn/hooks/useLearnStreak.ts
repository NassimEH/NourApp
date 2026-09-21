import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  getLearnStreakInfo,
  type LearnStreakInfo,
} from "@/lib/learn/streak";

const EMPTY: LearnStreakInfo = {
  streak: 0,
  weekDays: Array(7).fill(false) as boolean[],
  lastActiveDay: null,
  activeDays: [],
};

export function useLearnStreak() {
  const [info, setInfo] = useState<LearnStreakInfo>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setInfo(await getLearnStreakInfo());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return { ...info, loading, refresh };
}
