import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAuthenticatedUserId, upsertWorshipTools } from "@/lib/supabase/user-data";

const KEY_COUNT = "@dhikr_count";
const KEY_GOAL = "@dhikr_daily_goal";

async function syncDhikrToCloud(): Promise<void> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return;
  const [count, goal] = await Promise.all([getDhikrCount(), getDhikrDailyGoal()]);
  try {
    await upsertWorshipTools(userId, {
      dhikr_count: count,
      dhikr_daily_goal: goal,
    });
  } catch (e) {
    console.warn("syncDhikrToCloud", e);
  }
}

export async function getDhikrCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY_COUNT);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export async function setDhikrCount(count: number): Promise<void> {
  await AsyncStorage.setItem(KEY_COUNT, String(Math.max(0, count)));
  await syncDhikrToCloud();
}

export async function getDhikrDailyGoal(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY_GOAL);
    const n = raw ? parseInt(raw, 10) : 33;
    return Number.isFinite(n) && n > 0 ? n : 33;
  } catch {
    return 33;
  }
}

export async function setDhikrDailyGoal(goal: number): Promise<void> {
  const g = Math.max(1, Math.min(999, goal));
  await AsyncStorage.setItem(KEY_GOAL, String(g));
  await syncDhikrToCloud();
}
