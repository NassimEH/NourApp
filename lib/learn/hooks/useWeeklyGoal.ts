import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  getWeeklyGoalLessons,
  getWeeklyLessonsDone,
  setWeeklyGoalLessons,
} from "../weekly-goal";

export function useWeeklyGoal() {
  const [goal, setGoal] = useState(0);
  const [done, setDone] = useState(0);

  const refresh = useCallback(async () => {
    const [g, d] = await Promise.all([
      getWeeklyGoalLessons(),
      getWeeklyLessonsDone(),
    ]);
    setGoal(g);
    setDone(d.count);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const cycleGoal = useCallback(async () => {
    const steps = [0, 3, 5, 7];
    const idx = steps.indexOf(goal);
    const next = steps[(idx + 1) % steps.length];
    await setWeeklyGoalLessons(next);
    await refresh();
  }, [goal, refresh]);

  return { goal, done, refresh, cycleGoal };
}
