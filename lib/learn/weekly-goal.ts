import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAuthenticatedUserId, upsertWorshipTools } from "@/lib/supabase/user-data";

const KEY_WEEKLY_GOAL = "@learn_weekly_goal";
const KEY_WEEKLY_DONE = "@learn_weekly_done";

async function syncWeeklyToCloud(): Promise<void> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return;
  const [goal, done] = await Promise.all([
    getWeeklyGoalLessons(),
    getWeeklyLessonsDone(),
  ]);
  try {
    await upsertWorshipTools(userId, {
      weekly_learning: { goal, done },
    });
  } catch (e) {
    console.warn("syncWeeklyToCloud", e);
  }
}

function currentWeekKey(): string {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
  );
  return `${d.getFullYear()}-W${week}`;
}

export async function getWeeklyGoalLessons(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY_WEEKLY_GOAL);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n > 0 ? Math.min(n, 21) : 0;
  } catch {
    return 0;
  }
}

export async function setWeeklyGoalLessons(count: number): Promise<void> {
  const n = Math.max(0, Math.min(21, Math.round(count)));
  if (n === 0) {
    await AsyncStorage.removeItem(KEY_WEEKLY_GOAL);
    await syncWeeklyToCloud();
    return;
  }
  await AsyncStorage.setItem(KEY_WEEKLY_GOAL, String(n));
  await syncWeeklyToCloud();
}

export async function getWeeklyLessonsDone(): Promise<{
  weekKey: string;
  count: number;
}> {
  try {
    const raw = await AsyncStorage.getItem(KEY_WEEKLY_DONE);
    if (!raw) return { weekKey: currentWeekKey(), count: 0 };
    const parsed = JSON.parse(raw) as { weekKey?: string; count?: number };
    const weekKey = currentWeekKey();
    if (parsed.weekKey !== weekKey) return { weekKey, count: 0 };
    return {
      weekKey,
      count: typeof parsed.count === "number" ? Math.max(0, parsed.count) : 0,
    };
  } catch {
    return { weekKey: currentWeekKey(), count: 0 };
  }
}

export async function incrementWeeklyLessonsDone(): Promise<void> {
  const goal = await getWeeklyGoalLessons();
  if (goal === 0) return;
  const { count } = await getWeeklyLessonsDone();
  const weekKey = currentWeekKey();
  await AsyncStorage.setItem(
    KEY_WEEKLY_DONE,
    JSON.stringify({ weekKey, count: count + 1 })
  );
  await syncWeeklyToCloud();
}
