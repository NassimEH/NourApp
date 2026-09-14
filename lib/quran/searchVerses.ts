import type { LanguageLocale } from "@/lib/app-preferences";

const EDITIONS: Record<LanguageLocale, string> = {
  fr: "fr.hamidullah",
  en: "en.sahih",
  ar: "ar.muyassar",
};

export type VerseSearchResult = {
  surahNumber: number;
  ayahNumber: number;
  text: string;
};

type ApiMatch = {
  numberInSurah?: number;
  text?: string;
  surah?: { number?: number };
};

type ApiResponse = {
  code?: number;
  data?: { matches?: ApiMatch[] };
};

export async function searchVerses(
  keyword: string,
  locale: LanguageLocale,
  signal?: AbortSignal
): Promise<VerseSearchResult[]> {
  const edition = EDITIONS[locale];
  const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(keyword.trim())}/all/${edition}`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Quran search failed: ${response.status}`);

  const payload = (await response.json()) as ApiResponse;
  if (payload.code !== 200 || !Array.isArray(payload.data?.matches)) {
    throw new Error("Invalid Quran search response");
  }

  return payload.data.matches
    .flatMap((match): VerseSearchResult[] => {
      const surahNumber = match.surah?.number;
      const ayahNumber = match.numberInSurah;
      if (
        typeof surahNumber !== "number" ||
        typeof ayahNumber !== "number" ||
        typeof match.text !== "string"
      ) {
        return [];
      }
      return [{ surahNumber, ayahNumber, text: match.text }];
    })
    .slice(0, 30);
}
