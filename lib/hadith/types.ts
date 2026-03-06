/**
 * Types pour le module Hadiths (API Sunnah.com).
 * Alignés sur la structure Collections → Livres → Chapitres → Hadiths.
 */

/** Données multilingues (ar, en) de l'API */
export interface HadithLangEntry {
  lang: string;
  body?: string;
  chapterNumber?: string;
  chapterTitle?: string;
  urn?: number;
}

export interface BookLangEntry {
  lang: string;
  name: string;
  hadithStartNumber?: number;
  hadithEndNumber?: number;
  numberOfHadith?: number;
}

export interface ChapterLangEntry {
  lang: string;
  chapterNumber?: string;
  chapterTitle?: string;
  intro?: string | null;
  ending?: string | null;
}

export interface CollectionLangEntry {
  lang: string;
  title?: string;
  shortIntro?: string;
  totalHadith?: number;
  totalAvailableHadith?: number;
}

/** Réponse paginée API */
export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  limit?: number;
  previous?: number | null;
  next?: number | null;
}

/** Collection (recueil) */
export interface HadithCollection {
  name: string;
  hasBooks: boolean;
  hasChapters: boolean;
  collection?: CollectionLangEntry[];
}

/** Livre d'une collection */
export interface HadithBook {
  bookNumber: string;
  book?: BookLangEntry[];
}

/** Chapitre d'un livre */
export interface HadithChapter {
  bookNumber: string;
  chapterId: string;
  chapter?: ChapterLangEntry[];
}

/** Hadith (liste ou détail) */
export interface HadithGrade {
  graded_by?: string;
  grade?: string;
}

export interface HadithRecord {
  collection: string;
  bookNumber: string;
  chapterId?: string;
  hadithNumber: string;
  hadith?: HadithLangEntry[];
  grades?: HadithGrade[];
  /** Référence / source du hadith (ex. Rapporté par Al-Boukhary, Sahih n°1) */
  source?: string;
}

/** Collection avec infos d'affichage (titre localisé) */
export interface HadithCollectionDisplay extends HadithCollection {
  displayName: string;
  totalHadith?: number;
}

/** Clé unique pour un favori hadith */
export interface HadithFavoriteKey {
  collectionName: string;
  hadithNumber: string;
}

export interface HadithFavorite extends HadithFavoriteKey {
  arabicBody?: string;
  englishBody?: string;
  collectionDisplayName?: string;
  bookName?: string;
  chapterTitle?: string;
  addedAt: number;
}
