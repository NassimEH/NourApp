/**
 * Persistance locale des favoris Invocations (Duas) et langue d'affichage.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DuaFavorite } from "./types";

const KEY_FAVORITES = "@dua_favorites";
const KEY_LANGUAGE = "@dua_language";

export type DuaLanguage = "fr" | "en";

export async function getDuaLanguage(): Promise<DuaLanguage> {
  try {
    const raw = await AsyncStorage.getItem(KEY_LANGUAGE);
    if (raw === "fr" || raw === "en") return raw;
  } catch {}
  return "fr";
}

export async function setDuaLanguage(lang: DuaLanguage): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_LANGUAGE, lang);
  } catch {}
}

export async function getDuaFavorites(): Promise<DuaFavorite[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_FAVORITES);
    if (!raw) return [];
    return JSON.parse(raw) as DuaFavorite[];
  } catch {
    return [];
  }
}

export async function setDuaFavorites(list: DuaFavorite[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
  } catch {}
}

export function getDuaFavoriteKey(categorySlug: string, duaId: number): string {
  return `${categorySlug}-${duaId}`;
}
