/**
 * Persistance locale : langue d'affichage des hadiths (EN/FR) et favoris.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
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
  } catch {}
}

export function getHadithFavoriteKey(
  collectionName: string,
  hadithNumber: string
): string {
  return `${collectionName}__${hadithNumber}`;
}
