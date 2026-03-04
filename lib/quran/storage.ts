/**
 * Persistance locale : dernière lecture, favoris.
 * Clés dédiées pour évolution (sync, backup) sans conflit.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LastRead, Favorite } from "./types";

const KEY_LAST_READ = "@quran_last_read";
const KEY_FAVORITES = "@quran_favorites";

export async function getLastRead(): Promise<LastRead | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_LAST_READ);
    if (!raw) return null;
    return JSON.parse(raw) as LastRead;
  } catch {
    return null;
  }
}

export async function setLastRead(read: LastRead): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_LAST_READ, JSON.stringify(read));
  } catch {}
}

export async function getFavorites(): Promise<Favorite[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_FAVORITES);
    if (!raw) return [];
    return JSON.parse(raw) as Favorite[];
  } catch {
    return [];
  }
}

export async function setFavorites(list: Favorite[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
  } catch {}
}

export function isFavoriteKey(suraNumber: number, ayahNumber?: number): string {
  return ayahNumber != null ? `${suraNumber}-${ayahNumber}` : `sura-${suraNumber}`;
}
