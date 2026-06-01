import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PROGRESS = "@learn_completed_lessons";

export async function getCompletedLessonIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_PROGRESS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export async function markLessonCompleted(lessonId: string): Promise<void> {
  const current = await getCompletedLessonIds();
  if (current.includes(lessonId)) return;
  await AsyncStorage.setItem(
    KEY_PROGRESS,
    JSON.stringify([...current, lessonId])
  );
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
