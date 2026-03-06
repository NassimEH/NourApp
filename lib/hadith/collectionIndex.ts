/**
 * Index d'une collection : tous les hadiths chargés et regroupés par livre / chapitre.
 * Utilisé pour afficher les livres, chapitres et hadiths sans "All hadiths".
 */

import type { HadithRecord, HadithBook, HadithChapter } from "./types";

const BASE_URL = "https://hadithapi.pages.dev/api";
const PAGE_LIMIT = 100;

interface HadithApiItem {
  id: number;
  header?: string;
  hadith_english: string;
  book?: string;
  refno?: string;
  bookName?: string;
  chapterName?: string;
}

interface HadithListApiResponse {
  results: HadithApiItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

function trim(s: string | undefined): string {
  return (s ?? "").trim() || "Sans titre";
}

function mapItemToRecord(
  item: HadithApiItem,
  collectionName: string,
  bookNumber: string,
  chapterId: string,
  chapterTitle: string
): HadithRecord {
  const body = [item.header, item.hadith_english]
    .filter(Boolean)
    .map((s) => (s || "").trim())
    .join("\n\n");
  return {
    collection: collectionName,
    bookNumber,
    chapterId,
    hadithNumber: String(item.id),
    source: item.refno ?? undefined,
    hadith: [
      {
        lang: "en",
        body: body || item.hadith_english?.trim(),
        chapterTitle,
      },
    ],
  };
}

export interface CollectionIndex {
  books: HadithBook[];
  chaptersByBook: Map<string, HadithChapter[]>;
  hadithsByChapter: Map<string, HadithRecord[]>;
}

export interface CollectionIndexCache {
  index: CollectionIndex;
  rawItems: HadithApiItem[];
  lastPageFetched: number;
  totalPages: number | null;
}

const indexCache = new Map<string, CollectionIndexCache>();

function cacheKey(collectionName: string): string {
  return collectionName.toLowerCase();
}

function buildIndexFromRawItems(
  collectionName: string,
  rawItems: HadithApiItem[]
): CollectionIndex {
  const bookNamesOrdered: string[] = [];
  const bookToChaptersOrdered = new Map<string, string[]>();

  for (const item of rawItems) {
    const bookName = trim(item.bookName);
    const chapterName = trim(item.chapterName);
    if (!bookNamesOrdered.includes(bookName)) bookNamesOrdered.push(bookName);
    let chapters = bookToChaptersOrdered.get(bookName);
    if (!chapters) {
      chapters = [];
      bookToChaptersOrdered.set(bookName, chapters);
    }
    if (!chapters.includes(chapterName)) chapters.push(chapterName);
  }

  const allHadiths: HadithRecord[] = rawItems.map((item) => {
    const bookName = trim(item.bookName);
    const chapterName = trim(item.chapterName);
    const bookNumber = String(bookNamesOrdered.indexOf(bookName) + 1);
    const chapterId = String(
      bookToChaptersOrdered.get(bookName)!.indexOf(chapterName) + 1
    );
    return mapItemToRecord(
      item,
      collectionName,
      bookNumber,
      chapterId,
      chapterName
    );
  });

  const books: HadithBook[] = bookNamesOrdered.map((name, i) => {
    const bookNumber = String(i + 1);
    const count = allHadiths.filter((h) => h.bookNumber === bookNumber).length;
    return {
      bookNumber,
      book: [
        { lang: "en", name, numberOfHadith: count },
      ],
    };
  });

  const chaptersByBook = new Map<string, HadithChapter[]>();
  const hadithsByChapter = new Map<string, HadithRecord[]>();

  for (const [bookName, chapterNames] of bookToChaptersOrdered) {
    const bookNumber = String(bookNamesOrdered.indexOf(bookName) + 1);
    const chapters: HadithChapter[] = chapterNames.map((chapterName, i) => {
      const chapterId = String(i + 1);
      const num = String(i + 1).padStart(2, "0");
      return {
        bookNumber,
        chapterId,
        chapter: [
          { lang: "en", chapterNumber: num, chapterTitle: chapterName },
        ],
      };
    });
    chaptersByBook.set(bookNumber, chapters);
    for (const ch of chapters) {
      const list = allHadiths.filter(
        (h) => h.bookNumber === bookNumber && h.chapterId === ch.chapterId
      );
      hadithsByChapter.set(`${bookNumber}_${ch.chapterId}`, list);
    }
  }

  return {
    books,
    chaptersByBook,
    hadithsByChapter,
  };
}

const DEFAULT_MAX_PAGES = 10;

/** Charge les N premières pages puis construit l'index (évite le chargement en boucle). */
export async function loadCollectionIndex(
  collectionName: string,
  options: { maxPages?: number } = {}
): Promise<CollectionIndex> {
  const key = cacheKey(collectionName);
  const { maxPages = DEFAULT_MAX_PAGES } = options;
  const existing = indexCache.get(key);
  if (existing) return existing.index;

  const rawItems: HadithApiItem[] = [];
  let page = 1;
  let hasNext = true;
  let totalPages: number | null = null;

  while (hasNext && page <= maxPages) {
    const res = await fetch(
      `${BASE_URL}/${encodeURIComponent(collectionName)}?page=${page}&limit=${PAGE_LIMIT}`
    );
    if (!res.ok) throw new Error(`Hadith API error: ${res.status}`);
    const json = (await res.json()) as HadithListApiResponse;
    const results = json.results ?? [];
    const pagination = json.pagination;

    for (const item of results) {
      const bookName = trim(item.bookName);
      const chapterName = trim(item.chapterName);
      rawItems.push(item);
    }
    if (pagination?.totalPages != null) totalPages = pagination.totalPages;

    hasNext = pagination?.hasNextPage === true && results.length === PAGE_LIMIT;
    page += 1;
  }

  const index = buildIndexFromRawItems(collectionName, rawItems);
  indexCache.set(key, {
    index,
    rawItems,
    lastPageFetched: page - 1,
    totalPages,
  });
  return index;
}

/** Charge les N pages suivantes et fusionne dans l'index en cache. */
export async function loadMoreCollectionHadiths(
  collectionName: string,
  batchSize = 10
): Promise<CollectionIndex | null> {
  const key = cacheKey(collectionName);
  const existing = indexCache.get(key);
  if (!existing) return null;
  const { rawItems, lastPageFetched, totalPages } = existing;
  const nextPage = lastPageFetched + 1;
  if (totalPages != null && nextPage > totalPages) return existing.index;

  const startPage = nextPage;
  const endPage = Math.min(
    nextPage + batchSize - 1,
    totalPages ?? nextPage + batchSize - 1
  );
  const newRawItems = [...rawItems];

  for (let page = startPage; page <= endPage; page++) {
    const res = await fetch(
      `${BASE_URL}/${encodeURIComponent(collectionName)}?page=${page}&limit=${PAGE_LIMIT}`
    );
    if (!res.ok) break;
    const json = (await res.json()) as HadithListApiResponse;
    const results = json.results ?? [];
    newRawItems.push(...results);
    if (results.length < PAGE_LIMIT) break;
  }

  const index = buildIndexFromRawItems(collectionName, newRawItems);
  indexCache.set(key, {
    index,
    rawItems: newRawItems,
    lastPageFetched: endPage,
    totalPages,
  });
  return index;
}

export function canLoadMoreHadiths(collectionName: string): boolean {
  const key = cacheKey(collectionName);
  const existing = indexCache.get(key);
  if (!existing) return false;
  const { lastPageFetched, totalPages } = existing;
  if (totalPages == null) return true;
  return lastPageFetched < totalPages;
}

export function getCachedCollectionIndex(
  collectionName: string
): CollectionIndex | null {
  const cached = indexCache.get(cacheKey(collectionName));
  return cached?.index ?? null;
}
