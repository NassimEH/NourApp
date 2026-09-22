/**
 * Profils publics des récitateurs :
 * portraits bundlés (instantanés) + métadonnées affichées sur la fiche.
 */

import type { ImageSource } from "expo-image";

export type ReciterBioKey =
  | "quran.reciterBioAbdulBasit"
  | "quran.reciterBioAlafasy"
  | "quran.reciterBioHusary"
  | "quran.reciterBioMinshawi"
  | "quran.reciterBioSudais"
  | "quran.reciterBioGhamdi"
  | "quran.reciterBioAjamy"
  | "quran.reciterBioMuaiqly";

export type ReciterCountryKey =
  | "quran.reciterCountryEgypt"
  | "quran.reciterCountryKuwait"
  | "quran.reciterCountrySaudi";

export type ReciterProfile = {
  /** Source locale bundlée — affichage immédiat */
  image: ImageSource;
  bioKey: ReciterBioKey;
  countryKey: ReciterCountryKey;
  /** Années d’activité / période publique (affichage libre) */
  yearsLabel: string;
};

/** Portraits locaux (assets) — plus de latence réseau. */
export const RECITER_PROFILES: Record<string, ReciterProfile> = {
  "ar.abdulbasitmurattal": {
    image: require("@/assets/images/reciters/abdulbasit.jpg"),
    bioKey: "quran.reciterBioAbdulBasit",
    countryKey: "quran.reciterCountryEgypt",
    yearsLabel: "1927 – 1988",
  },
  "ar.alafasy": {
    image: require("@/assets/images/reciters/alafasy.jpg"),
    bioKey: "quran.reciterBioAlafasy",
    countryKey: "quran.reciterCountryKuwait",
    yearsLabel: "1976 –",
  },
  "ar.husary": {
    image: require("@/assets/images/reciters/husary.jpg"),
    bioKey: "quran.reciterBioHusary",
    countryKey: "quran.reciterCountryEgypt",
    yearsLabel: "1917 – 1980",
  },
  "ar.minshawi": {
    image: require("@/assets/images/reciters/minshawi.jpg"),
    bioKey: "quran.reciterBioMinshawi",
    countryKey: "quran.reciterCountryEgypt",
    yearsLabel: "1920 – 1969",
  },
  "ar.abdurrahmaansudais": {
    image: require("@/assets/images/reciters/sudais.jpg"),
    bioKey: "quran.reciterBioSudais",
    countryKey: "quran.reciterCountrySaudi",
    yearsLabel: "1960 –",
  },
  "ar.saaborig": {
    image: require("@/assets/images/reciters/ghamdi.jpg"),
    bioKey: "quran.reciterBioGhamdi",
    countryKey: "quran.reciterCountrySaudi",
    yearsLabel: "1967 –",
  },
  "ar.ahmedajamy": {
    image: require("@/assets/images/reciters/ajamy.png"),
    bioKey: "quran.reciterBioAjamy",
    countryKey: "quran.reciterCountrySaudi",
    yearsLabel: "1968 –",
  },
  "ar.maaborig": {
    image: require("@/assets/images/reciters/muaiqly.jpg"),
    bioKey: "quran.reciterBioMuaiqly",
    countryKey: "quran.reciterCountrySaudi",
    yearsLabel: "1969 –",
  },
};

export function getReciterProfile(reciterId: string): ReciterProfile | null {
  return RECITER_PROFILES[reciterId] ?? null;
}

/** Source image locale pour un récitateur. */
export function getReciterImageSource(reciterId: string): ImageSource | null {
  return getReciterProfile(reciterId)?.image ?? null;
}

/** Toutes les sources portraits — pour warm-up cache au démarrage. */
export function getAllReciterImageSources(): ImageSource[] {
  return Object.values(RECITER_PROFILES).map((p) => p.image);
}
