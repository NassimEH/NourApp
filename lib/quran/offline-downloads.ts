import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_OFFLINE_ENABLED = "@quran_offline_enabled";

/** Préférence utilisateur (téléchargement hors-ligne — à venir). */
export async function getOfflineRecitationsEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY_OFFLINE_ENABLED)) === "true";
  } catch {
    return false;
  }
}

export async function setOfflineRecitationsEnabled(
  enabled: boolean
): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_OFFLINE_ENABLED, enabled ? "true" : "false");
  } catch {
    /* ignore */
  }
}
