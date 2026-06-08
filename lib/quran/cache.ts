/**
 * Cache local pour le module Coran.
 * Réduit les appels API, prêt pour évolution offline (persistance disque).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { QuranTranslationLang, SuraMeta, SuraContent, AyahText } from "./types";

const PREFIX = "@quran";
const SURA_LIST_KEY = `${PREFIX}_sura_list`;
const SURA_CONTENT_PREFIX = `${PREFIX}_sura_`;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h pour la liste
const CONTENT_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7j pour le contenu

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

/** Cache en mémoire pour éviter re-read AsyncStorage à chaque render */
let memorySuraList: SuraMeta[] | null = null;

export async function getCachedSuraList(): Promise<SuraMeta[] | null> {
  if (memorySuraList) return memorySuraList;
  const list = await getCached<SuraMeta[]>(SURA_LIST_KEY, CACHE_TTL_MS);
  if (list) memorySuraList = list;
  return list;
}

export async function setCachedSuraList(list: SuraMeta[]): Promise<void> {
  memorySuraList = list;
  await setCached(SURA_LIST_KEY, list);
}

function suraContentKey(suraNumber: number, translationLang: QuranTranslationLang): string {
  return `${SURA_CONTENT_PREFIX}${suraNumber}_${translationLang}`;
}

export async function getCachedSuraContent(
  suraNumber: number,
  translationLang: QuranTranslationLang
): Promise<{
  arabic: SuraContent;
  translation: AyahText[];
  translationLang: QuranTranslationLang;
} | null> {
  return getCached(suraContentKey(suraNumber, translationLang), CONTENT_TTL_MS);
}

export async function setCachedSuraContent(
  suraNumber: number,
  translationLang: QuranTranslationLang,
  content: { arabic: SuraContent; translation: AyahText[]; translationLang: QuranTranslationLang }
): Promise<void> {
  await setCached(suraContentKey(suraNumber, translationLang), content);
}

export function invalidateSuraContent(suraNumber: number, translationLang?: QuranTranslationLang): void {
  if (translationLang) {
    AsyncStorage.removeItem(suraContentKey(suraNumber, translationLang)).catch(() => {});
    return;
  }
  (["fr", "en", "ar"] as QuranTranslationLang[]).forEach((lang) => {
    AsyncStorage.removeItem(suraContentKey(suraNumber, lang)).catch(() => {});
  });
}
