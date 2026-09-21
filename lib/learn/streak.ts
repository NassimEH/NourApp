/**
 * Streak d'apprentissage : jours consécutifs avec ≥1 leçon complétée.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_ACTIVITY = "@learn_activity_days";

export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDay(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

async function readDays(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_ACTIVITY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

/** Enregistre une activité d'apprentissage pour aujourd'hui. */
export async function recordLearnActivityDay(date = new Date()): Promise<void> {
  const key = dayKey(date);
  const days = await readDays();
  if (days.includes(key)) return;
  const next = [...days, key].sort();
  // garder ~1 an
  const trimmed = next.slice(-400);
  await AsyncStorage.setItem(KEY_ACTIVITY, JSON.stringify(trimmed));
}

export type LearnStreakInfo = {
  streak: number;
  /** 7 booléens Lun→Dim de la semaine ISO courante (lundi = 0) */
  weekDays: boolean[];
  lastActiveDay: string | null;
  /** Toutes les dates d'activité (YYYY-MM-DD), pour WeekStrip */
  activeDays: string[];
};

function startOfIsoWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay() || 7; // Dim = 7
  d.setDate(d.getDate() - (day - 1));
  return d;
}

/** Calcule le streak courant (jours consécutifs jusqu'à aujourd'hui ou hier). */
export async function getLearnStreakInfo(
  reference = new Date()
): Promise<LearnStreakInfo> {
  const days = new Set(await readDays());
  const today = dayKey(reference);
  const yesterdayDate = new Date(reference);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = dayKey(yesterdayDate);

  let cursor = days.has(today)
    ? new Date(reference)
    : days.has(yesterday)
      ? yesterdayDate
      : null;

  let streak = 0;
  if (cursor) {
    for (;;) {
      const k = dayKey(cursor);
      if (!days.has(k)) break;
      streak += 1;
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const weekStart = startOfIsoWeek(reference);
  const weekDays: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    weekDays.push(days.has(dayKey(d)));
  }

  const sorted = [...days].sort();
  return {
    streak,
    weekDays,
    lastActiveDay: sorted.length ? sorted[sorted.length - 1]! : null,
    activeDays: sorted,
  };
}
