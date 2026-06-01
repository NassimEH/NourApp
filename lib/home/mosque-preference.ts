import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_MOSQUE_NAME = "@home_mosque_name";

export async function getMosqueName(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_MOSQUE_NAME);
    return raw?.trim() || null;
  } catch {
    return null;
  }
}

export async function setMosqueName(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) {
    await AsyncStorage.removeItem(KEY_MOSQUE_NAME);
    return;
  }
  await AsyncStorage.setItem(KEY_MOSQUE_NAME, trimmed);
}
