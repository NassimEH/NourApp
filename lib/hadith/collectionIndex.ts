/**
 * Index d'une collection via fawazahmed0/hadith-api.
 * Charge l'édition (eng par défaut) une fois, construit livres (= sections) et hadiths.
 */

import type { HadithRecord, HadithBook, HadithChapter } from "./types";
import { editionUrl, type HadithContentLang } from "./editions";

interface FawazHadithItem {
  hadithnumber: number;
  arabicnumber?: number;
  text?: string;
  reference?: { book?: number; hadith?: number };
}

interface FawazEditionJson {
  metadata?: {
    name?: string;
    sections?: Record<string, string>;
    section_details?: Record<
      string,
      {
        hadithnumber_first?: number;
        hadithnumber_last?: number;
      }
    >;
  };
  hadiths?: FawazHadithItem[];
}

export interface CollectionIndex {
  books: HadithBook[];
  chaptersByBook: Map<string, HadithChapter[]>;
  hadithsByChapter: Map<string, HadithRecord[]>;
}

export interface CollectionIndexCache {
  index: CollectionIndex;
  lang: HadithContentLang;
}

const indexCache = new Map<string, CollectionIndexCache>();

function cacheKey(collectionName: string, lang: HadithContentLang): string {
  return `${collectionName.toLowerCase()}_${lang}`;
}

function mapItemToRecord(
  item: FawazHadithItem,
  collectionName: string,
  bookNumber: string,
  chapterId: string,
  chapterTitle: string,
  lang: HadithContentLang
): HadithRecord {
  return {
    collection: collectionName.toLowerCase(),
    bookNumber,
    chapterId,
    hadithNumber: String(item.hadithnumber),
    source: chapterTitle
      ? `${chapterTitle} · ${item.hadithnumber}`
      : String(item.hadithnumber),
    hadith: [
      {
        lang,
        body: (item.text ?? "").trim(),
        chapterTitle,
      },
    ],
  };
}

function buildIndexFromEdition(
  collectionName: string,
  json: FawazEditionJson,
  lang: HadithContentLang
): CollectionIndex {
  const sections = json.metadata?.sections ?? {};
  const hadiths = json.hadiths ?? [];

  const sectionKeys = Object.keys(sections)
    .filter((k) => k !== "0" && (sections[k] ?? "").trim().length > 0)
    .sort((a, b) => Number(a) - Number(b));

  const books: HadithBook[] = [];
  const chaptersByBook = new Map<string, HadithChapter[]>();
  const hadithsByChapter = new Map<string, HadithRecord[]>();

  for (const bookNumber of sectionKeys) {
    const name = sections[bookNumber]?.trim() || `Book ${bookNumber}`;
    const chapterId = "1";
    const list = hadiths
      .filter((h) => String(h.reference?.book ?? "") === bookNumber)
      .map((h) =>
        mapItemToRecord(h, collectionName, bookNumber, chapterId, name, lang)
      );

    books.push({
      bookNumber,
      book: [
        { lang: "en", name, numberOfHadith: list.length },
        { lang: "fr", name, numberOfHadith: list.length },
      ],
    });

    chaptersByBook.set(bookNumber, [
      {
        bookNumber,
        chapterId,
        chapter: [
          {
            lang: "en",
            chapterNumber: "01",
            chapterTitle: name,
          },
          {
            lang: "fr",
            chapterNumber: "01",
            chapterTitle: name,
          },
        ],
      },
    ]);

    hadithsByChapter.set(`${bookNumber}_${chapterId}`, list);
  }

  // Fallback: si sections vides, un seul livre avec tous les hadiths
  if (books.length === 0 && hadiths.length > 0) {
    const bookNumber = "1";
    const chapterId = "1";
    const name = json.metadata?.name ?? collectionName;
    const list = hadiths.map((h) =>
      mapItemToRecord(h, collectionName, bookNumber, chapterId, name, lang)
    );
    books.push({
      bookNumber,
      book: [{ lang: "en", name, numberOfHadith: list.length }],
    });
    chaptersByBook.set(bookNumber, [
      {
        bookNumber,
        chapterId,
        chapter: [
          { lang: "en", chapterNumber: "01", chapterTitle: name },
        ],
      },
    ]);
    hadithsByChapter.set(`${bookNumber}_${chapterId}`, list);
  }

  return { books, chaptersByBook, hadithsByChapter };
}

/**
 * Charge l'édition CDN (min.json) et construit l'index.
 * `lang` = langue des previews de liste (détail charge toujours fr+en+ar).
 */
export async function loadCollectionIndex(
  collectionName: string,
  options: { lang?: HadithContentLang } = {}
): Promise<CollectionIndex> {
  const lang = options.lang ?? "en";
  const key = cacheKey(collectionName, lang);
  const existing = indexCache.get(key);
  if (existing) return existing.index;

  const res = await fetch(editionUrl(collectionName, lang));
  if (!res.ok) throw new Error(`Hadith API error: ${res.status}`);
  const json = (await res.json()) as FawazEditionJson;
  const index = buildIndexFromEdition(collectionName, json, lang);
  indexCache.set(key, { index, lang });
  return index;
}

/** Plus de pagination : édition entière déjà chargée. */
export async function loadMoreCollectionHadiths(
  _collectionName: string,
  _batchSize = 10
): Promise<CollectionIndex | null> {
  return null;
}

export function canLoadMoreHadiths(_collectionName: string): boolean {
  return false;
}

export function getCachedCollectionIndex(
  collectionName: string,
  lang: HadithContentLang = "en"
): CollectionIndex | null {
  return indexCache.get(cacheKey(collectionName, lang))?.index ?? null;
}

export function clearCollectionIndexCache(): void {
  indexCache.clear();
}
