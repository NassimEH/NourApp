import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@prayer_location_v1";

export type PrayerLocationPreference =
  | { source: "device" }
  | {
      source: "manual";
      label: string;
      address: string;
      latitude?: number;
      longitude?: number;
    };

export async function getPrayerLocationPreference(): Promise<PrayerLocationPreference | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PrayerLocationPreference;
    if (parsed.source === "device") return { source: "device" };
    if (
      parsed.source === "manual" &&
      typeof parsed.label === "string" &&
      typeof parsed.address === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setPrayerLocationManual(
  location: Omit<Extract<PrayerLocationPreference, { source: "manual" }>, "source">
): Promise<void> {
  const pref: PrayerLocationPreference = { source: "manual", ...location };
  await AsyncStorage.setItem(KEY, JSON.stringify(pref));
}

export async function clearPrayerLocationPreference(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
