/** Constantes éditions fawazahmed0/hadith-api (évite imports circulaires). */

export type HadithContentLang = "en" | "fr" | "ar";

export const CDN_BASE =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

const LANG_TO_EDITION: Record<HadithContentLang, string> = {
  en: "eng",
  fr: "fra",
  ar: "ara",
};

export function editionId(
  collectionName: string,
  lang: HadithContentLang
): string {
  return `${LANG_TO_EDITION[lang]}-${collectionName.toLowerCase()}`;
}

export function editionUrl(
  collectionName: string,
  lang: HadithContentLang = "en"
): string {
  return `${CDN_BASE}/${editionId(collectionName, lang)}.min.json`;
}

export function sectionUrl(
  collectionName: string,
  sectionNumber: string,
  lang: HadithContentLang = "en"
): string {
  return `${CDN_BASE}/${editionId(collectionName, lang)}/sections/${encodeURIComponent(sectionNumber)}.json`;
}

export function hadithUrl(
  collectionName: string,
  hadithNumber: string,
  lang: HadithContentLang
): string {
  return `${CDN_BASE}/${editionId(collectionName, lang)}/${encodeURIComponent(hadithNumber.trim())}.json`;
}
