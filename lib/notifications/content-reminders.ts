import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { requestNotificationPermission } from "@/lib/notifications/prayer-notifications";
import { syncNotificationPrefsToCloud } from "@/lib/notifications/cloud-sync";

const KEY_HADITH = "@reminder_hadith_enabled";
const KEY_LESSON = "@reminder_lesson_enabled";
const CHANNEL_ID = "content-reminders";

const HADITH_ID = "daily-hadith-reminder";
const LESSON_ID = "daily-lesson-reminder";

async function ensureChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Rappels spirituels",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function isHadithReminderEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY_HADITH)) === "true";
  } catch {
    return false;
  }
}

export async function isLessonReminderEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY_LESSON)) === "true";
  } catch {
    return false;
  }
}

async function scheduleDaily(
  identifier: string,
  hour: number,
  title: string,
  body: string
): Promise<void> {
  await ensureChannel();
  await Notifications.cancelScheduledNotificationAsync(identifier);
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
      channelId: Platform.OS === "android" ? CHANNEL_ID : undefined,
    },
  });
}

export async function setHadithReminderEnabled(
  enabled: boolean,
  labels: { title: string; body: string }
): Promise<boolean> {
  if (!enabled) {
    await AsyncStorage.setItem(KEY_HADITH, "false");
    await Notifications.cancelScheduledNotificationAsync(HADITH_ID);
    await syncNotificationPrefsToCloud();
    return true;
  }
  const granted = await requestNotificationPermission();
  if (!granted) {
    await AsyncStorage.setItem(KEY_HADITH, "false");
    return false;
  }
  await AsyncStorage.setItem(KEY_HADITH, "true");
  await scheduleDaily(HADITH_ID, 8, labels.title, labels.body);
  await syncNotificationPrefsToCloud();
  return true;
}

export async function setLessonReminderEnabled(
  enabled: boolean,
  labels: { title: string; body: string }
): Promise<boolean> {
  if (!enabled) {
    await AsyncStorage.setItem(KEY_LESSON, "false");
    await Notifications.cancelScheduledNotificationAsync(LESSON_ID);
    await syncNotificationPrefsToCloud();
    return true;
  }
  const granted = await requestNotificationPermission();
  if (!granted) {
    await AsyncStorage.setItem(KEY_LESSON, "false");
    return false;
  }
  await AsyncStorage.setItem(KEY_LESSON, "true");
  await scheduleDaily(LESSON_ID, 9, labels.title, labels.body);
  await syncNotificationPrefsToCloud();
  return true;
}
