/**
 * Persistance des favoris Invocations (Duas) et langue d'affichage.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getAuthenticatedUserId,
  replaceFavorites,
  fetchFavorites,
} from "@/lib/supabase/user-data";

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
  const userId = await getAuthenticatedUserId();
  if (userId) {
    try {
      const rows = await fetchFavorites(userId, "dua");
      const list = rows.map((r) => r.metadata as unknown as DuaFavorite);
      await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
      return list;
    } catch (e) {
      console.warn("getDuaFavorites cloud", e);
    }
  }
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
    const userId = await getAuthenticatedUserId();
    if (userId) {
      await replaceFavorites(
        userId,
        "dua",
        list.map((f) => ({
          refKey: getDuaFavoriteKey(f.categorySlug, f.duaId),
          metadata: f as unknown as Record<string, unknown>,
          addedAt: f.addedAt,
        }))
      );
    }
  } catch {}
}

export function getDuaFavoriteKey(categorySlug: string, duaId: number): string {
  return `${categorySlug}-${duaId}`;
}
