import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getAuthenticatedUserId,
  fetchPrayerLog,
  upsertPrayerLog,
} from "@/lib/supabase/user-data";

import type { PrayerKey } from "./usePrayerTimes";

const STORAGE_KEY_PREFIX = "prayers_checked_";

export function getTodayPrayerLogKey(): string {
  const d = new Date();
  return `${STORAGE_KEY_PREFIX}${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getTodayPrayerLogDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export type PrayersCheckedState = Partial<Record<PrayerKey, boolean>>;

export const prayersStorageAvailable = Platform.OS !== "web";

export async function loadPrayersChecked(
  key: string
): Promise<PrayersCheckedState> {
  if (!prayersStorageAvailable) return {};

  const userId = await getAuthenticatedUserId();
  if (userId) {
    try {
      const logDate = key.replace(STORAGE_KEY_PREFIX, "");
      const cloud = await fetchPrayerLog(userId, logDate);
      if (Object.keys(cloud).length > 0) {
        await AsyncStorage.setItem(key, JSON.stringify(cloud));
        return cloud;
      }
    } catch (e) {
      console.warn("loadPrayersChecked cloud", e);
    }
  }

  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as PrayersCheckedState;
  } catch {
    return {};
  }
}

export async function savePrayersChecked(
  key: string,
  state: PrayersCheckedState
): Promise<void> {
  if (!prayersStorageAvailable) return;
  await AsyncStorage.setItem(key, JSON.stringify(state));

  const userId = await getAuthenticatedUserId();
  if (userId) {
    try {
      const logDate = key.replace(STORAGE_KEY_PREFIX, "");
      await upsertPrayerLog(userId, logDate, state as Record<string, boolean>);
    } catch (e) {
      console.warn("savePrayersChecked cloud", e);
    }
  }
}
