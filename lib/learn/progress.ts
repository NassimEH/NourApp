import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAuthenticatedUserId, upsertLessonCompletion } from "@/lib/supabase/user-data";

import { incrementWeeklyLessonsDone } from "./weekly-goal";

const KEY_PROGRESS_LEGACY = "@learn_completed_lessons";

function keyForCourse(courseId: string) {
  return `@learn_completed_${courseId}`;
}

function sanitizeIds(parsed: unknown): string[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((id): id is string => typeof id === "string");
}

export async function getCompletedLessonIds(courseId: string): Promise<string[]> {
  try {
    const scopedKey = keyForCourse(courseId);
    const scopedRaw = await AsyncStorage.getItem(scopedKey);
    if (scopedRaw) {
      return sanitizeIds(JSON.parse(scopedRaw) as unknown);
    }

    // Migration douce : on lit l'ancienne clé globale puis on recopie dans la clé du parcours.
    const legacyRaw = await AsyncStorage.getItem(KEY_PROGRESS_LEGACY);
    if (!legacyRaw) return [];
    const legacyIds = sanitizeIds(JSON.parse(legacyRaw) as unknown);
    if (legacyIds.length > 0) {
      await AsyncStorage.setItem(scopedKey, JSON.stringify(legacyIds));
    }
    return legacyIds;
  } catch {
    return [];
  }
}

export async function getAllCompletedLessonIds(courseIds: string[]): Promise<string[]> {
  const perCourse = await Promise.all(courseIds.map((id) => getCompletedLessonIds(id)));
  return Array.from(new Set(perCourse.flat()));
}

export async function markLessonCompleted(
  courseId: string,
  lessonId: string
): Promise<void> {
  const current = await getCompletedLessonIds(courseId);
  if (current.includes(lessonId)) return;
  await AsyncStorage.setItem(
    keyForCourse(courseId),
    JSON.stringify([...current, lessonId])
  );
  const userId = await getAuthenticatedUserId();
  if (userId) {
    try {
      await upsertLessonCompletion(userId, courseId, lessonId);
    } catch (e) {
      console.warn("markLessonCompleted cloud", e);
    }
  }
  await incrementWeeklyLessonsDone();
}

export function getLessonStatus(
  lessonIndex: number,
  lessonId: string,
  completedIds: string[]
): import("./types").LessonStatus {
  if (completedIds.includes(lessonId)) return "completed";
  if (lessonIndex === 0) return "available";
  return "locked";
}

export function isLessonUnlocked(
  lessonIndex: number,
  lessons: { id: string }[],
  completedIds: string[]
): boolean {
  if (lessonIndex === 0) return true;
  const previousId = lessons[lessonIndex - 1]?.id;
  return previousId != null && completedIds.includes(previousId);
}
