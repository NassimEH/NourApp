/**
 * Client API Hadiths — Hadith API (https://hadithapi.pages.dev).
 * Collections, livres/chapitres virtuels, liste paginée et détail par hadith.
 */

import type {
  HadithCollection,
  HadithBook,
  HadithChapter,
  HadithRecord,
} from "./types";
import {
  loadCollectionIndex,
  loadMoreCollectionHadiths,
  canLoadMoreHadiths,
} from "./collectionIndex";

const BASE_URL = "https://hadithapi.pages.dev/api";

/** Réponse d’un hadith depuis l’API */
interface HadithApiItem {
  id: number;
  header?: string;
  hadith_english: string;
  book?: string;
  refno?: string;
  bookName?: string;
  chapterName?: string;
}

/** Collections supportées par l’API (nom interne, libellé, total) */
const API_COLLECTIONS: { name: string; title: string; totalHadith: number }[] = [
  { name: "bukhari", title: "Sahih Bukhari", totalHadith: 7563 },
  { name: "muslim", title: "Sahih Muslim", totalHadith: 3032 },
  { name: "abudawud", title: "Sunan Abu Dawud", totalHadith: 3998 },
  { name: "ibnmajah", title: "Sunan Ibn Majah", totalHadith: 4342 },
  { name: "tirmidhi", title: "Jami' at-Tirmidhi", totalHadith: 3956 },
];

function mapApiItemToRecord(
  item: HadithApiItem,
  collectionName: string
): HadithRecord {
  const body = [item.header, item.hadith_english]
    .filter(Boolean)
    .map((s) => (s || "").trim())
    .join("\n\n");
  return {
    collection: collectionName,
    bookNumber: "1",
    chapterId: "all",
    hadithNumber: String(item.id),
    source: item.refno ?? undefined,
    hadith: [
      {
        lang: "en",
        body: body || item.hadith_english?.trim(),
        chapterTitle: item.chapterName?.trim(),
      },
    ],
  };
}

/** Liste des collections (données dérivées de l’API, pas d’appel HTTP) */
export async function fetchCollections(): Promise<HadithCollection[]> {
  return API_COLLECTIONS.map((c) => ({
    name: c.name,
    hasBooks: true,
    hasChapters: true,
    collection: [
      {
        lang: "en",
        title: c.title,
        totalHadith: c.totalHadith,
        totalAvailableHadith: c.totalHadith,
      },
    ],
  }));
}

/** Un seul « livre » virtuel par collection (tous les hadiths) */
export async function fetchBooks(
  collectionName: string
): Promise<HadithBook[]> {
  const index = await loadCollectionIndex(collectionName);
  return index.books;
}

/** Un seul « chapitre » virtuel (tous les hadiths de la collection) */
export async function fetchChapters(
  collectionName: string,
  bookNumber: string
): Promise<HadithChapter[]> {
  const index = await loadCollectionIndex(collectionName);
  const chapters = index.chaptersByBook.get(bookNumber);
  return chapters ?? [];
}

/** Hadiths d’une collection (paginé via l’API) */
export async function fetchHadithsByChapter(
  collectionName: string,
  bookNumber: string,
  chapterId: string,
  _page = 1,
  _limit = 100
): Promise<{ data: HadithRecord[]; total: number; next: number | null }> {
  const index = await loadCollectionIndex(collectionName);
  const data = index.hadithsByChapter.get(`${bookNumber}_${chapterId}`) ?? [];
  return {
    data,
    total: data.length,
    next: null,
  };
}

/** Hadiths d’un livre (non utilisé avec cette API, compatibilité) */
export async function fetchHadithsByBook(
  _collectionName: string,
  _bookNumber: string,
  _page = 1,
  _limit = 50
): Promise<{ data: HadithRecord[]; total: number; next: number | null }> {
  return { data: [], total: 0, next: null };
}

/** Détail d’un hadith par ID */
export async function fetchHadithDetail(
  collectionName: string,
  hadithNumber: string
): Promise<HadithRecord | null> {
  const id = hadithNumber.trim();
  if (!id) return null;
  const res = await fetch(
    `${BASE_URL}/${encodeURIComponent(collectionName)}/${encodeURIComponent(id)}`
  );
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Hadith API error: ${res.status}`);
  }
  const item = (await res.json()) as HadithApiItem;
  return mapApiItemToRecord(item, collectionName);
}

/** Noms d’affichage des collections (fallback) */
export const COLLECTION_DISPLAY_NAMES: Record<string, string> = {
  bukhari: "Sahih Bukhari",
  muslim: "Sahih Muslim",
  abudawud: "Sunan Abu Dawud",
  ibnmajah: "Sunan Ibn Majah",
  tirmidhi: "Jami' at-Tirmidhi",
};

/** Nom d’affichage d’une collection */
export function getCollectionDisplayName(
  collection: HadithCollection,
  _lang: "en" | "ar" = "en"
): string {
  const key = collection.name.toLowerCase();
  if (COLLECTION_DISPLAY_NAMES[key]) return COLLECTION_DISPLAY_NAMES[key];
  const entry = collection.collection?.[0];
  return entry?.title ?? collection.name;
}

export { loadMoreCollectionHadiths, canLoadMoreHadiths } from "./collectionIndex";
