/**
 * Persistance : langue d'affichage des hadiths (EN/FR) et favoris.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getAuthenticatedUserId,
  replaceFavorites,
  fetchFavorites,
} from "@/lib/supabase/user-data";

import type { HadithFavorite } from "./types";

const KEY_FAVORITES = "@hadith_favorites";
const KEY_LANGUAGE = "@hadith_language";

export type HadithLanguage = "en" | "fr";

export async function getHadithLanguage(): Promise<HadithLanguage> {
  try {
    const raw = await AsyncStorage.getItem(KEY_LANGUAGE);
    if (raw === "fr" || raw === "en") return raw;
  } catch {}
  return "en";
}

export async function setHadithLanguage(lang: HadithLanguage): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_LANGUAGE, lang);
  } catch {}
}

export async function getHadithFavorites(): Promise<HadithFavorite[]> {
  const userId = await getAuthenticatedUserId();
  if (userId) {
    try {
      const rows = await fetchFavorites(userId, "hadith");
      const list = rows.map((r) => r.metadata as unknown as HadithFavorite);
      await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
      return list;
    } catch (e) {
      console.warn("getHadithFavorites cloud", e);
    }
  }
  try {
    const raw = await AsyncStorage.getItem(KEY_FAVORITES);
    if (!raw) return [];
    return JSON.parse(raw) as HadithFavorite[];
  } catch {
    return [];
  }
}

export async function setHadithFavorites(
  list: HadithFavorite[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
    const userId = await getAuthenticatedUserId();
    if (userId) {
      await replaceFavorites(
        userId,
        "hadith",
        list.map((f) => ({
          refKey: getHadithFavoriteKey(f.collectionName, f.hadithNumber),
          metadata: f as unknown as Record<string, unknown>,
          addedAt: f.addedAt,
        }))
      );
    }
  } catch {}
}

export function getHadithFavoriteKey(
  collectionName: string,
  hadithNumber: string
): string {
  return `${collectionName}__${hadithNumber}`;
}
