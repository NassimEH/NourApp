/**
 * Persistance : dernière lecture, favoris.
 * Connecté → Supabase (+ cache local). Invité → AsyncStorage uniquement.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getAuthenticatedUserId,
  replaceFavorites,
  fetchFavorites,
} from "@/lib/supabase/user-data";
import { syncQuranStatePatch } from "@/lib/supabase/sync";

import type { LastRead, LastListen, Favorite } from "./types";

const KEY_LAST_READ = "@quran_last_read";
const KEY_LAST_LISTEN = "@quran_last_listen";
const KEY_RECENT_SURAS = "@quran_recent_suras";
const KEY_FAVORITES = "@quran_favorites";
const MAX_RECENT_SURAS = 8;

async function syncFavoritesToCloud(list: Favorite[]): Promise<void> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return;
  await replaceFavorites(
    userId,
    "quran",
    list.map((f) => ({
      refKey: isFavoriteKey(f.suraNumber, f.ayahNumber),
      metadata: f as unknown as Record<string, unknown>,
      addedAt:
        typeof f.addedAt === "number"
          ? new Date(f.addedAt).toISOString()
          : undefined,
    }))
  );
}

export async function getLastRead(): Promise<LastRead | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_LAST_READ);
    if (!raw) return null;
    return JSON.parse(raw) as LastRead;
  } catch {
    return null;
  }
}

export async function getLastListen(): Promise<LastListen | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_LAST_LISTEN);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastListen;
    if (
      typeof parsed.suraNumber !== "number" ||
      parsed.suraNumber < 1 ||
      parsed.suraNumber > 114 ||
      typeof parsed.timestamp !== "number" ||
      parsed.timestamp <= 0
    ) {
      return null;
    }
    return {
      suraNumber: parsed.suraNumber,
      progress:
        typeof parsed.progress === "number"
          ? Math.min(1, Math.max(0, parsed.progress))
          : 0,
      timestamp: parsed.timestamp,
    };
  } catch {
    return null;
  }
}

export async function setLastListen(listen: LastListen): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_LAST_LISTEN, JSON.stringify(listen));
    if (listen.timestamp > 0) {
      await pushRecentSura(listen.suraNumber);
    }
    const userId = await getAuthenticatedUserId();
    if (userId) {
      const recent = await getRecentSuras();
      await syncQuranStatePatch(userId, {
        last_listen: listen as unknown as Record<string, unknown>,
        recent_suras: recent,
      });
    }
  } catch {}
}

export async function setLastRead(read: LastRead): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_LAST_READ, JSON.stringify(read));
    if (read.timestamp > 0) {
      await pushRecentSura(read.suraNumber);
    }
    const userId = await getAuthenticatedUserId();
    if (userId) {
      const recent = await getRecentSuras();
      await syncQuranStatePatch(userId, {
        last_read: read as unknown as Record<string, unknown>,
        recent_suras: recent,
      });
    }
  } catch {}
}

export async function getRecentSuras(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_RECENT_SURAS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => typeof n === "number" && n >= 1 && n <= 114);
  } catch {
    return [];
  }
}

export async function pushRecentSura(suraNumber: number): Promise<void> {
  if (suraNumber < 1 || suraNumber > 114) return;
  try {
    const current = await getRecentSuras();
    const next = [suraNumber, ...current.filter((n) => n !== suraNumber)].slice(
      0,
      MAX_RECENT_SURAS
    );
    await AsyncStorage.setItem(KEY_RECENT_SURAS, JSON.stringify(next));
    const userId = await getAuthenticatedUserId();
    if (userId) {
      await syncQuranStatePatch(userId, { recent_suras: next });
    }
  } catch {}
}

export async function getFavorites(): Promise<Favorite[]> {
  const userId = await getAuthenticatedUserId();
  if (userId) {
    try {
      const rows = await fetchFavorites(userId, "quran");
      const list = rows.map((r) => r.metadata as unknown as Favorite);
      await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(list));
      return list;
    } catch (e) {
      console.warn("getFavorites cloud", e);
    }
  }
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
    await syncFavoritesToCloud(list);
  } catch {}
}

export function isFavoriteKey(suraNumber: number, ayahNumber?: number): string {
  return ayahNumber != null ? `${suraNumber}-${ayahNumber}` : `sura-${suraNumber}`;
}
