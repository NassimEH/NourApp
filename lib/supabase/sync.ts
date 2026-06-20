/**
 * Synchronisation locale ↔ Supabase à la connexion.
 * Fusionne les données locales avec le cloud, puis recharge le cache local.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDuaFavorites } from "@/lib/dua/storage";
import { getHadithFavoriteKey, getHadithFavorites } from "@/lib/hadith/storage";
import {
  PILLARS_COURSE_ID,
  PROPHETS_COURSE_ID,
} from "@/lib/learn/courses";
import { getCompletedLessonIds } from "@/lib/learn/progress";
import {
  getWeeklyGoalLessons,
  getWeeklyLessonsDone,
} from "@/lib/learn/weekly-goal";
import {
  arePrayerNotificationsEnabled,
} from "@/lib/notifications/prayer-notifications";
import {
  isHadithReminderEnabled,
  isLessonReminderEnabled,
} from "@/lib/notifications/content-reminders";
import {
  getDhikrCount,
  getDhikrDailyGoal,
} from "@/lib/tools/dhikr-storage";
import {
  getSadaqaMonthDone,
  getSadaqaMonthlyGoal,
} from "@/lib/tools/sadaqa-goal";
import {
  getFavorites as getQuranFavorites,
  isFavoriteKey,
} from "@/lib/quran/storage";
import type { Favorite as QuranFavorite } from "@/lib/quran/types";
import type { HadithFavorite } from "@/lib/hadith/types";
import type { DuaFavorite } from "@/lib/dua/types";

import {
  fetchFavorites,
  fetchLessonCompletions,
  fetchNotificationPrefs,
  fetchQuranState,
  fetchUserPreferences,
  fetchWorshipTools,
  replaceFavorites,
  replaceLessonCompletions,
  upsertNotificationPrefs,
  upsertQuranState,
  upsertUserPreferences,
  upsertWorshipTools,
} from "./user-data";

const PREFS_KEY = "@nour_app_preferences";
const COURSE_IDS = [PROPHETS_COURSE_ID, PILLARS_COURSE_ID];

function mergeUnique<T>(a: T[], b: T[]): T[] {
  return Array.from(new Set([...a, ...b]));
}

function quranToRow(f: QuranFavorite) {
  return {
    refKey: isFavoriteKey(f.suraNumber, f.ayahNumber),
    metadata: f as unknown as Record<string, unknown>,
    addedAt: f.addedAt,
  };
}

function hadithToRow(f: HadithFavorite) {
  return {
    refKey: getHadithFavoriteKey(f.collectionName, f.hadithNumber),
    metadata: f as unknown as Record<string, unknown>,
    addedAt: f.addedAt,
  };
}

function duaToRow(f: DuaFavorite) {
  return {
    refKey: `${f.categorySlug}-${f.duaId}`,
    metadata: f as unknown as Record<string, unknown>,
    addedAt: f.addedAt,
  };
}

/** Pousse les données locales vers Supabase (fusion avec le cloud). */
export async function pushLocalDataToCloud(userId: string): Promise<void> {
  const [quranLocal, hadithLocal, duaLocal] = await Promise.all([
    getQuranFavorites(),
    getHadithFavorites(),
    getDuaFavorites(),
  ]);

  for (const kind of ["quran", "hadith", "dua"] as const) {
    const cloud = await fetchFavorites(userId, kind);
    const cloudKeys = new Set(cloud.map((r) => r.ref_key));

    const localRows =
      kind === "quran"
        ? quranLocal.map(quranToRow)
        : kind === "hadith"
          ? hadithLocal.map(hadithToRow)
          : duaLocal.map(duaToRow);

    const merged = [
      ...cloud.map((r) => ({
        refKey: r.ref_key,
        metadata: r.metadata,
        addedAt: r.added_at,
      })),
      ...localRows.filter((r) => !cloudKeys.has(r.refKey)),
    ];

    await replaceFavorites(userId, kind, merged);
  }

  for (const courseId of COURSE_IDS) {
    const localIds = await getCompletedLessonIds(courseId);
    const cloudIds = await fetchLessonCompletions(userId, courseId);
    await replaceLessonCompletions(
      userId,
      courseId,
      mergeUnique(localIds, cloudIds)
    );
  }

  const rawPrefs = await AsyncStorage.getItem(PREFS_KEY);
  const localPrefs = rawPrefs ? (JSON.parse(rawPrefs) as Record<string, unknown>) : {};
  const cloudPrefs = await fetchUserPreferences(userId);
  await upsertUserPreferences(userId, { ...cloudPrefs, ...localPrefs });

  const [dhikrCount, dhikrGoal, sadaqaGoal, sadaqaDone, weeklyGoal, weeklyDone] =
    await Promise.all([
      getDhikrCount(),
      getDhikrDailyGoal(),
      getSadaqaMonthlyGoal(),
      getSadaqaMonthDone(),
      getWeeklyGoalLessons(),
      getWeeklyLessonsDone(),
    ]);

  const cloudWorship = await fetchWorshipTools(userId);
  await upsertWorshipTools(userId, {
    dhikr_count: Math.max(dhikrCount, cloudWorship?.dhikr_count ?? 0),
    dhikr_daily_goal: dhikrGoal || cloudWorship?.dhikr_daily_goal || 33,
    sadaqa_monthly_goal: sadaqaGoal || cloudWorship?.sadaqa_monthly_goal,
    sadaqa_month_done: {
      amount: Math.max(
        sadaqaDone,
        (cloudWorship?.sadaqa_month_done as { amount?: number })?.amount ?? 0
      ),
    },
    weekly_learning: {
      goal: weeklyGoal || (cloudWorship?.weekly_learning as { goal?: number })?.goal,
      done: weeklyDone,
    },
  });

  const [prayerNotif, hadithRem, lessonRem] = await Promise.all([
    arePrayerNotificationsEnabled(),
    isHadithReminderEnabled(),
    isLessonReminderEnabled(),
  ]);
  const cloudNotif = await fetchNotificationPrefs(userId);
  await upsertNotificationPrefs(userId, {
    prayer_enabled: prayerNotif || cloudNotif?.prayer_enabled || false,
    hadith_reminder_enabled:
      hadithRem || cloudNotif?.hadith_reminder_enabled || false,
    lesson_reminder_enabled:
      lessonRem || cloudNotif?.lesson_reminder_enabled || false,
  });
}

/** Recharge le cache local depuis Supabase. */
export async function pullCloudDataToLocal(userId: string): Promise<void> {
  const quranRows = await fetchFavorites(userId, "quran");
  await AsyncStorage.setItem(
    "@quran_favorites",
    JSON.stringify(quranRows.map((r) => r.metadata as unknown as QuranFavorite))
  );

  const hadithRows = await fetchFavorites(userId, "hadith");
  await AsyncStorage.setItem(
    "@hadith_favorites",
    JSON.stringify(hadithRows.map((r) => r.metadata as unknown as HadithFavorite))
  );

  const duaRows = await fetchFavorites(userId, "dua");
  await AsyncStorage.setItem(
    "@dua_favorites",
    JSON.stringify(duaRows.map((r) => r.metadata as unknown as DuaFavorite))
  );

  for (const courseId of COURSE_IDS) {
    const ids = await fetchLessonCompletions(userId, courseId);
    await AsyncStorage.setItem(
      `@learn_completed_${courseId}`,
      JSON.stringify(ids)
    );
  }

  const prefs = await fetchUserPreferences(userId);
  if (Object.keys(prefs).length > 0) {
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }

  const quranState = await fetchQuranState(userId);
  if (quranState) {
    if (quranState.last_read) {
      await AsyncStorage.setItem(
        "@quran_last_read",
        JSON.stringify(quranState.last_read)
      );
    }
    if (quranState.last_listen) {
      await AsyncStorage.setItem(
        "@quran_last_listen",
        JSON.stringify(quranState.last_listen)
      );
    }
    await AsyncStorage.setItem(
      "@quran_recent_suras",
      JSON.stringify(quranState.recent_suras)
    );
  }

  const worship = await fetchWorshipTools(userId);
  if (worship) {
    await AsyncStorage.setItem("@dhikr_count", String(worship.dhikr_count));
    await AsyncStorage.setItem("@dhikr_daily_goal", String(worship.dhikr_daily_goal));
    if (worship.sadaqa_monthly_goal != null) {
      await AsyncStorage.setItem(
        "@sadaqa_monthly_goal",
        String(worship.sadaqa_monthly_goal)
      );
    }
    if (worship.sadaqa_month_done) {
      await AsyncStorage.setItem(
        "@sadaqa_month_done",
        JSON.stringify(worship.sadaqa_month_done)
      );
    }
    const wl = worship.weekly_learning as {
      goal?: number;
      done?: { weekKey: string; count: number };
    } | null;
    if (wl?.goal) {
      await AsyncStorage.setItem("@learn_weekly_goal", String(wl.goal));
    }
    if (wl?.done) {
      await AsyncStorage.setItem("@learn_weekly_done", JSON.stringify(wl.done));
    }
  }

  const notif = await fetchNotificationPrefs(userId);
  if (notif) {
    await AsyncStorage.setItem(
      "@prayer_notifications_enabled",
      notif.prayer_enabled ? "true" : "false"
    );
    await AsyncStorage.setItem(
      "@reminder_hadith_enabled",
      notif.hadith_reminder_enabled ? "true" : "false"
    );
    await AsyncStorage.setItem(
      "@reminder_lesson_enabled",
      notif.lesson_reminder_enabled ? "true" : "false"
    );
  }
}

/** Sync complète après connexion : merge local → cloud puis cloud → cache local. */
export async function syncUserDataWithCloud(userId: string): Promise<void> {
  try {
    await pushLocalDataToCloud(userId);
    await pullCloudDataToLocal(userId);
  } catch (e) {
    console.warn("syncUserDataWithCloud", e);
  }
}

/** Écrit une préférence Coran dans le cloud si connecté. */
export async function syncQuranStatePatch(
  userId: string,
  patch: Parameters<typeof upsertQuranState>[1]
): Promise<void> {
  try {
    await upsertQuranState(userId, patch);
  } catch (e) {
    console.warn("syncQuranStatePatch", e);
  }
}

/** Écrit les préférences app dans le cloud si connecté. */
export async function syncAppPreferencesToCloud(
  userId: string,
  prefs: Record<string, unknown>
): Promise<void> {
  try {
    await upsertUserPreferences(userId, prefs);
  } catch (e) {
    console.warn("syncAppPreferencesToCloud", e);
  }
}
