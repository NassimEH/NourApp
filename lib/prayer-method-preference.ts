import AsyncStorage from "@react-native-async-storage/async-storage";

/** Aladhan API method IDs — https://aladhan.com/calculation-methods */
export type PrayerCalculationMethod = "mwl" | "uoif";

const KEY = "@prayer_calculation_method";

const METHOD_ID: Record<PrayerCalculationMethod, number> = {
  mwl: 3,
  uoif: 12,
};

export async function getPrayerCalculationMethod(): Promise<PrayerCalculationMethod> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    return v === "uoif" ? "uoif" : "mwl";
  } catch {
    return "mwl";
  }
}

export async function setPrayerCalculationMethod(
  method: PrayerCalculationMethod
): Promise<void> {
  await AsyncStorage.setItem(KEY, method);
}

export function getAladhanMethodId(method: PrayerCalculationMethod): number {
  return METHOD_ID[method];
}
