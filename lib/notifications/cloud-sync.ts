import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getAuthenticatedUserId,
  upsertNotificationPrefs,
} from "@/lib/supabase/user-data";

const KEY_PRAYER = "@prayer_notifications_enabled";
const KEY_HADITH = "@reminder_hadith_enabled";
const KEY_LESSON = "@reminder_lesson_enabled";

/** Pousse les préférences de notifications vers Supabase. */
export async function syncNotificationPrefsToCloud(): Promise<void> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return;
  try {
    const [prayer, hadith, lesson] = await Promise.all([
      AsyncStorage.getItem(KEY_PRAYER),
      AsyncStorage.getItem(KEY_HADITH),
      AsyncStorage.getItem(KEY_LESSON),
    ]);
    await upsertNotificationPrefs(userId, {
      prayer_enabled: prayer === "true",
      hadith_reminder_enabled: hadith === "true",
      lesson_reminder_enabled: lesson === "true",
    });
  } catch (e) {
    console.warn("syncNotificationPrefsToCloud", e);
  }
}
