/**
 * Client API Hadiths — fawazahmed0/hadith-api (CDN jsDelivr).
 * Éditions eng / fra / ara pour Bukhari, Muslim, Abu Dawud, Ibn Majah, Tirmidhi.
 */

import type {
  HadithCollection,
  HadithBook,
  HadithChapter,
  HadithRecord,
  HadithLangEntry,
} from "./types";
import {
  loadCollectionIndex,
  loadMoreCollectionHadiths,
  canLoadMoreHadiths,
} from "./collectionIndex";
import {
  CDN_BASE,
  hadithUrl,
  type HadithContentLang,
} from "./editions";

export type { HadithContentLang };
export { CDN_BASE };

/** Collections supportées — libellés FR / EN / AR */
const API_COLLECTIONS: {
  name: string;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  totalHadith: number;
}[] = [
  {
    name: "bukhari",
    titleEn: "Sahih Bukhari",
    titleFr: "Sahih al-Boukhari",
    titleAr: "صحيح البخاري",
    totalHadith: 7563,
  },
  {
    name: "muslim",
    titleEn: "Sahih Muslim",
    titleFr: "Sahih Mouslim",
    titleAr: "صحيح مسلم",
    totalHadith: 3032,
  },
  {
    name: "abudawud",
    titleEn: "Sunan Abu Dawud",
    titleFr: "Sunan Abou Dawoud",
    titleAr: "سنن أبي داود",
    totalHadith: 3998,
  },
  {
    name: "ibnmajah",
    titleEn: "Sunan Ibn Majah",
    titleFr: "Sunan Ibn Majah",
    titleAr: "سنن ابن ماجه",
    totalHadith: 4342,
  },
  {
    name: "tirmidhi",
    titleEn: "Jami' at-Tirmidhi",
    titleFr: "Jami' at-Tirmidhi",
    titleAr: "جامع الترمذي",
    totalHadith: 3956,
  },
];

export function isSupportedCollection(name: string): boolean {
  return API_COLLECTIONS.some((c) => c.name === name.toLowerCase());
}

interface FawazHadithItem {
  hadithnumber: number;
  arabicnumber?: number;
  text?: string;
  grades?: { name?: string; grade?: string }[];
  reference?: { book?: number; hadith?: number };
}

interface FawazHadithResponse {
  metadata?: {
    name?: string;
    section?: Record<string, string>;
    sections?: Record<string, string>;
  };
  hadiths?: FawazHadithItem[];
}

async function fetchEditionHadith(
  collectionName: string,
  hadithNumber: string,
  lang: HadithContentLang
): Promise<{ text: string; book?: number; source?: string } | null> {
  const res = await fetch(hadithUrl(collectionName, hadithNumber, lang));
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Hadith API error: ${res.status}`);
  }
  const json = (await res.json()) as FawazHadithResponse;
  const item = json.hadiths?.[0];
  if (!item?.text?.trim()) return null;
  const book = item.reference?.book;
  const sectionTitle =
    (book != null && json.metadata?.section?.[String(book)]) ||
    (book != null && json.metadata?.sections?.[String(book)]) ||
    undefined;
  return {
    text: item.text.trim(),
    book,
    source: sectionTitle
      ? `${sectionTitle} · ${hadithNumber}`
      : String(hadithNumber),
  };
}

function mergeLangEntries(
  parts: Partial<Record<HadithContentLang, string>>,
  chapterTitle?: string
): HadithLangEntry[] {
  const entries: HadithLangEntry[] = [];
  (["ar", "fr", "en"] as HadithContentLang[]).forEach((lang) => {
    const body = parts[lang]?.trim();
    if (body) {
      entries.push({ lang, body, chapterTitle });
    }
  });
  return entries;
}

/** Liste des collections (données locales, pas d’appel HTTP) */
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
      {
        lang: "ar",
        title: c.titleAr,
        totalHadith: c.totalHadith,
        totalAvailableHadith: c.totalHadith,
      },
    ],
  }));
}

export async function fetchBooks(
  collectionName: string,
  lang: HadithContentLang = "en"
): Promise<HadithBook[]> {
  const index = await loadCollectionIndex(collectionName, { lang });
  return index.books;
}

export async function fetchChapters(
  collectionName: string,
  bookNumber: string,
  lang: HadithContentLang = "en"
): Promise<HadithChapter[]> {
  const index = await loadCollectionIndex(collectionName, { lang });
  return index.chaptersByBook.get(bookNumber) ?? [];
}

export async function fetchHadithsByChapter(
  collectionName: string,
  bookNumber: string,
  chapterId: string,
  _page = 1,
  _limit = 100,
  lang: HadithContentLang = "en"
): Promise<{ data: HadithRecord[]; total: number; next: number | null }> {
  const index = await loadCollectionIndex(collectionName, { lang });
  const data = index.hadithsByChapter.get(`${bookNumber}_${chapterId}`) ?? [];
  return { data, total: data.length, next: null };
}

export async function fetchHadithsByBook(
  _collectionName: string,
  _bookNumber: string,
  _page = 1,
  _limit = 50
): Promise<{ data: HadithRecord[]; total: number; next: number | null }> {
  return { data: [], total: 0, next: null };
}

/**
 * Détail d’un hadith : charge eng + fra + ara en parallèle et fusionne.
 */
export async function fetchHadithDetail(
  collectionName: string,
  hadithNumber: string
): Promise<HadithRecord | null> {
  const id = hadithNumber.trim();
  if (!id || !isSupportedCollection(collectionName)) return null;

  const [en, fr, ar] = await Promise.all([
    fetchEditionHadith(collectionName, id, "en"),
    fetchEditionHadith(collectionName, id, "fr"),
    fetchEditionHadith(collectionName, id, "ar"),
  ]);

  if (!en && !fr && !ar) return null;

  const bookNumber = String(en?.book ?? fr?.book ?? ar?.book ?? 1);
  const chapterTitle =
    en?.source?.split(" · ")[0] ?? fr?.source?.split(" · ")[0];

  return {
    collection: collectionName.toLowerCase(),
    bookNumber,
    chapterId: "1",
    hadithNumber: id,
    source: en?.source ?? fr?.source ?? ar?.source,
    hadith: mergeLangEntries(
      {
        en: en?.text,
        fr: fr?.text,
        ar: ar?.text,
      },
      chapterTitle
    ),
  };
}

export const COLLECTION_DISPLAY_NAMES: Record<
  string,
  { en: string; fr: string; ar: string }
> = {
  bukhari: {
    en: "Sahih Bukhari",
    fr: "Sahih al-Boukhari",
    ar: "صحيح البخاري",
  },
  muslim: {
    en: "Sahih Muslim",
    fr: "Sahih Mouslim",
    ar: "صحيح مسلم",
  },
  abudawud: {
    en: "Sunan Abu Dawud",
    fr: "Sunan Abou Dawoud",
    ar: "سنن أبي داود",
  },
  ibnmajah: {
    en: "Sunan Ibn Majah",
    fr: "Sunan Ibn Majah",
    ar: "سنن ابن ماجه",
  },
  tirmidhi: {
    en: "Jami' at-Tirmidhi",
    fr: "Jami' at-Tirmidhi",
    ar: "جامع الترمذي",
  },
};

export function getCollectionDisplayName(
  collection: HadithCollection,
  lang: "en" | "ar" | "fr" = "fr"
): string {
  const key = collection.name.toLowerCase();
  const known = COLLECTION_DISPLAY_NAMES[key];
  if (known) {
    if (lang === "ar") return known.ar;
    if (lang === "en") return known.en;
    return known.fr;
  }
  const entry =
    collection.collection?.find((c) => c.lang === lang) ??
    collection.collection?.find((c) => c.lang === "fr") ??
    collection.collection?.[0];
  return entry?.title ?? collection.name;
}

export { loadMoreCollectionHadiths, canLoadMoreHadiths } from "./collectionIndex";

