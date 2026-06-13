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

/** Collections supportées — libellés FR / EN */
const API_COLLECTIONS: {
  name: string;
  titleEn: string;
  titleFr: string;
  totalHadith: number;
}[] = [
  { name: "bukhari", titleEn: "Sahih Bukhari", titleFr: "Sahih al-Boukhari", totalHadith: 7563 },
  { name: "muslim", titleEn: "Sahih Muslim", titleFr: "Sahih Mouslim", totalHadith: 3032 },
  { name: "abudawud", titleEn: "Sunan Abu Dawud", titleFr: "Sunan Abou Dawoud", totalHadith: 3998 },
  { name: "ibnmajah", titleEn: "Sunan Ibn Majah", titleFr: "Sunan Ibn Majah", totalHadith: 4342 },
  { name: "tirmidhi", titleEn: "Jami' at-Tirmidhi", titleFr: "Jami' at-Tirmidhi", totalHadith: 3956 },
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
        title: c.titleEn,
        totalHadith: c.totalHadith,
        totalAvailableHadith: c.totalHadith,
      },
      {
        lang: "fr",
        title: c.titleFr,
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

/** Noms d’affichage des collections */
export const COLLECTION_DISPLAY_NAMES: Record<
  string,
  { en: string; fr: string }
> = {
  bukhari: { en: "Sahih Bukhari", fr: "Sahih al-Boukhari" },
  muslim: { en: "Sahih Muslim", fr: "Sahih Mouslim" },
  abudawud: { en: "Sunan Abu Dawud", fr: "Sunan Abou Dawoud" },
  ibnmajah: { en: "Sunan Ibn Majah", fr: "Sunan Ibn Majah" },
  tirmidhi: { en: "Jami' at-Tirmidhi", fr: "Jami' at-Tirmidhi" },
};

/** Nom d’affichage d’une collection */
export function getCollectionDisplayName(
  collection: HadithCollection,
  lang: "en" | "ar" | "fr" = "fr"
): string {
  const key = collection.name.toLowerCase();
  const known = COLLECTION_DISPLAY_NAMES[key];
  if (known) {
    return lang === "en" ? known.en : known.fr;
  }
  const entry =
    collection.collection?.find((c) => c.lang === lang) ??
    collection.collection?.find((c) => c.lang === "fr") ??
    collection.collection?.[0];
  return entry?.title ?? collection.name;
}

export { loadMoreCollectionHadiths, canLoadMoreHadiths } from "./collectionIndex";
