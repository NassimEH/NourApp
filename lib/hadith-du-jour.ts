import {
  HADITHS_DU_JOUR,
  type HadithJourItem,
} from "@/constants/hadithsJour";
import { getLocaleDateString } from "@/lib/i18n";
import type { LanguageLocale } from "@/lib/app-preferences";

export { getHadithDuJour } from "@/constants/hadithsJour";
export type { HadithJourItem };

export type HadithDuJourEntry = {
  index: number;
  hadith: HadithJourItem;
  /** Dernière date (≤ aujourd'hui) où ce hadith était le hadith du jour */
  featuredDate: Date;
  isToday: boolean;
};

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getHadithDuJourIndex(date = new Date()): number {
  return getDayOfYear(date) % HADITHS_DU_JOUR.length;
}

/** Dernière date calendaire où l'index donné était le hadith du jour (≤ reference). */
export function getLastFeaturedDateForIndex(
  index: number,
  reference = new Date()
): Date {
  const pool = HADITHS_DU_JOUR.length;
  const ref = new Date(reference);
  ref.setHours(12, 0, 0, 0);

  for (let offset = 0; offset < 400; offset++) {
    const candidate = new Date(ref);
    candidate.setDate(candidate.getDate() - offset);
    if (getDayOfYear(candidate) % pool === index) {
      return candidate;
    }
  }
  return ref;
}

/** Catalogue complet : chaque hadith + date de dernière mise en avant. */
export function buildHadithDuJourCatalog(reference = new Date()): HadithDuJourEntry[] {
  const todayIndex = getHadithDuJourIndex(reference);
  return HADITHS_DU_JOUR.map((hadith, index) => ({
    index,
    hadith,
    featuredDate: getLastFeaturedDateForIndex(index, reference),
    isToday: index === todayIndex,
  }));
}

export function formatHadithFeaturedDate(
  date: Date,
  locale: LanguageLocale
): string {
  return getLocaleDateString(locale, date);
}
