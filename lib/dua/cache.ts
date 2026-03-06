/**
 * Cache local pour le module Invocations (Duas).
 * Réduit les appels API et améliore les performances.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DuaCategory, DuaItem, DuaDetail } from "./types";
import type { DuaLanguage } from "./storage";

const PREFIX = "@dua";
const CATEGORY_PREFIX = `${PREFIX}_cat_`;
const DETAIL_PREFIX = `${PREFIX}_detail_`;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const DETAIL_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7j pour le détail

interface Cached<T> {
  data: T;
  ts: number;
}

async function getCached<T>(key: string, ttlMs: number): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached<T>;
    if (Date.now() - parsed.ts > ttlMs) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

async function setCached<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export async function getCachedCategories(lang: DuaLanguage): Promise<DuaCategory[] | null> {
  return getCached<DuaCategory[]>(`${PREFIX}_categories_${lang}`, CACHE_TTL_MS);
}

export async function setCachedCategories(lang: DuaLanguage, list: DuaCategory[]): Promise<void> {
  await setCached(`${PREFIX}_categories_${lang}`, list);
}

export async function getCachedCategoryDuas(slug: string, lang: DuaLanguage): Promise<DuaItem[] | null> {
  return getCached<DuaItem[]>(`${CATEGORY_PREFIX}${slug}_${lang}`, CACHE_TTL_MS);
}

export async function setCachedCategoryDuas(slug: string, lang: DuaLanguage, list: DuaItem[]): Promise<void> {
  await setCached(`${CATEGORY_PREFIX}${slug}_${lang}`, list);
}

export async function getCachedDuaDetail(slug: string, id: number, lang: DuaLanguage): Promise<DuaDetail | null> {
  return getCached<DuaDetail>(`${DETAIL_PREFIX}${slug}_${id}_${lang}`, DETAIL_TTL_MS);
}

export async function setCachedDuaDetail(slug: string, id: number, lang: DuaLanguage, detail: DuaDetail): Promise<void> {
  await setCached(`${DETAIL_PREFIX}${slug}_${id}_${lang}`, detail);
}
