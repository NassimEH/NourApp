/**
 * Cache local pour le module Hadiths (API Sunnah.com).
 * Réduit les appels API et améliore les performances.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  HadithCollection,
  HadithBook,
  HadithChapter,
  HadithRecord,
} from "./types";

const PREFIX = "@hadith";
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

export async function getCachedCollections(): Promise<HadithCollection[] | null> {
  return getCached<HadithCollection[]>(`${PREFIX}_collections`, CACHE_TTL_MS);
}

export async function setCachedCollections(
  list: HadithCollection[]
): Promise<void> {
  await setCached(`${PREFIX}_collections`, list);
}

export async function getCachedBooks(
  collectionName: string
): Promise<HadithBook[] | null> {
  return getCached<HadithBook[]>(
    `${PREFIX}_books_${collectionName}`,
    CACHE_TTL_MS
  );
}

export async function setCachedBooks(
  collectionName: string,
  list: HadithBook[]
): Promise<void> {
  await setCached(`${PREFIX}_books_${collectionName}`, list);
}

export async function getCachedChapters(
  collectionName: string,
  bookNumber: string
): Promise<HadithChapter[] | null> {
  return getCached<HadithChapter[]>(
    `${PREFIX}_chapters_${collectionName}_${bookNumber}`,
    CACHE_TTL_MS
  );
}

export async function setCachedChapters(
  collectionName: string,
  bookNumber: string,
  list: HadithChapter[]
): Promise<void> {
  await setCached(
    `${PREFIX}_chapters_${collectionName}_${bookNumber}`,
    list
  );
}

export async function getCachedHadithsByChapter(
  collectionName: string,
  bookNumber: string,
  chapterId: string
): Promise<HadithRecord[] | null> {
  return getCached<HadithRecord[]>(
    `${PREFIX}_hadiths_${collectionName}_${bookNumber}_${chapterId}`,
    CACHE_TTL_MS
  );
}

export async function setCachedHadithsByChapter(
  collectionName: string,
  bookNumber: string,
  chapterId: string,
  list: HadithRecord[]
): Promise<void> {
  await setCached(
    `${PREFIX}_hadiths_${collectionName}_${bookNumber}_${chapterId}`,
    list
  );
}

export async function getCachedHadithDetail(
  collectionName: string,
  hadithNumber: string
): Promise<HadithRecord | null> {
  return getCached<HadithRecord>(
    `${PREFIX}_detail_${collectionName}_${hadithNumber}`,
    DETAIL_TTL_MS
  );
}

export async function setCachedHadithDetail(
  collectionName: string,
  hadithNumber: string,
  detail: HadithRecord
): Promise<void> {
  await setCached(
    `${PREFIX}_detail_${collectionName}_${hadithNumber}`,
    detail
  );
}
