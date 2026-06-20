import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { PrayerKey, PrayerTimes } from "@/lib/usePrayerTimes";
import { getNextPrayerInfo } from "@/lib/prayerUtils";
import { syncNotificationPrefsToCloud } from "@/lib/notifications/cloud-sync";

const KEY_ENABLED = "@prayer_notifications_enabled";
const CHANNEL_ID = "prayer-reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function arePrayerNotificationsEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY_ENABLED)) === "true";
  } catch {
    return false;
  }
}

export async function setPrayerNotificationsEnabled(
  enabled: boolean
): Promise<boolean> {
  if (!enabled) {
    await AsyncStorage.setItem(KEY_ENABLED, "false");
    await Notifications.cancelAllScheduledNotificationsAsync();
    await syncNotificationPrefsToCloud();
    return true;
  }

  const granted = await requestNotificationPermission();
  if (!granted) {
    await AsyncStorage.setItem(KEY_ENABLED, "false");
    return false;
  }

  await AsyncStorage.setItem(KEY_ENABLED, "true");
  await syncNotificationPrefsToCloud();
  return true;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Rappels de prière",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

function parsePrayerTimeToday(timeStr: string): Date | null {
  const parts = timeStr.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!parts) return null;
  const now = new Date();
  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(parts[1], 10),
    parseInt(parts[2], 10),
    0,
    0
  );
  if (d.getTime() <= now.getTime()) return null;
  return d;
}

/** Planifie une notification pour la prochaine prière (à rappeler à l'ouverture de l'app). */
export async function rescheduleNextPrayerNotification(
  prayerTimes: PrayerTimes
): Promise<void> {
  const enabled = await arePrayerNotificationsEnabled();
  if (!enabled) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const next = getNextPrayerInfo(prayerTimes);
  if (!next) return;

  const timeStr = prayerTimes[next.name as PrayerKey];
  if (!timeStr) return;

  const triggerDate = parsePrayerTimeToday(timeStr);
  if (!triggerDate) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Heure de prière",
      body: `C'est l'heure de ${next.label} (${timeStr})`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: Platform.OS === "android" ? CHANNEL_ID : undefined,
    },
  });
}
