/**
 * Patches cloud légers sans importer le module sync complet
 * (évite le cycle sync.ts ↔ quran/storage.ts).
 */

import {
  upsertQuranState,
  upsertUserPreferences,
} from "./user-data";

/** Écrit une préférence Coran dans le cloud si connecté. */
export async function syncQuranStatePatch(
  userId: string,
  patch: Parameters<typeof upsertQuranState>[1]
): Promise<void> {
  try {
    await upsertQuranState(userId, patch);
  } catch (e) {
    console.warn("syncQuranStatePatch", e);
  }
}

/** Écrit les préférences app dans le cloud si connecté. */
export async function syncAppPreferencesToCloud(
  userId: string,
  prefs: Record<string, unknown>
): Promise<void> {
  try {
    await upsertUserPreferences(userId, prefs);
  } catch (e) {
    console.warn("syncAppPreferencesToCloud", e);
  }
}
