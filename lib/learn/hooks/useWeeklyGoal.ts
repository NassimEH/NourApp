import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  getWeeklyGoalLessons,
  getWeeklyLessonsDone,
  setWeeklyGoalLessons,
} from "../weekly-goal";

export function useWeeklyGoal() {
  const [goal, setGoalState] = useState(0);
  const [done, setDone] = useState(0);

  const refresh = useCallback(async () => {
    const [g, d] = await Promise.all([
      getWeeklyGoalLessons(),
      getWeeklyLessonsDone(),
    ]);
    setGoalState(g);
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

  const setGoal = useCallback(
    async (nextGoal: number) => {
      await setWeeklyGoalLessons(nextGoal);
      await refresh();
    },
    [refresh]
  );

  return { goal, done, refresh, cycleGoal, setGoal };
}
