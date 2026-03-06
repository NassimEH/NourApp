/**
 * Types pour le module Coran (AlQuran Cloud API).
 * Prêts pour évolution premium / offline.
 */

export type RevelationType = "Meccan" | "Medinan";

export interface SuraMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
}

export interface AyahText {
  number: number;
  text: string;
  numberInSurah: number;
  juz?: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean;
}

export interface SuraContent {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: RevelationType;
  numberOfAyahs: number;
  ayahs: AyahText[];
}

/** Réponse API liste des sourates */
export interface SuraListResponse {
  code: number;
  status: string;
  data: SuraMeta[];
}

/** Réponse API une sourate (texte) */
export interface SuraEditionResponse {
  code: number;
  status: string;
  data: SuraContent;
}

/** Dernière lecture sauvegardée */
export interface LastRead {
  suraNumber: number;
  scrollOffsetY: number;
  timestamp: number;
}

/** Favori (verset ou sourate) */
export type FavoriteType = "ayah" | "sura";
export interface Favorite {
  type: FavoriteType;
  suraNumber: number;
  ayahNumber?: number; // numberInSurah
  globalAyahNumber?: number;
  addedAt: number;
}

/** Identifiants d'éditions (AlQuran Cloud) */
export const QURAN_UTHMANI_EDITION = "quran-uthmani";
export const FR_TRANSLATION_EDITION = "fr.hamidullah";
/** Récitateur audio par défaut (verset par verset) */
export const DEFAULT_AUDIO_RECITER = "ar.abdulbasitmurattal";
export const AUDIO_BITRATE = "128";

/** Liste des récitateurs disponibles */
export interface Reciter {
  id: string;
  name: string;
  style: string;
}

export const AVAILABLE_RECITERS: Reciter[] = [
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit", style: "Murattal" },
  { id: "ar.alafasy", name: "Mishary Alafasy", style: "Populaire" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", style: "Classique" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi", style: "Mujawwad" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais", style: "Imam Mecque" },
  { id: "ar.saaborig", name: "Saad Al-Ghamdi", style: "Populaire" },
  { id: "ar.ahmedajamy", name: "Ahmed Al-Ajamy", style: "Doux" },
  { id: "ar.maaborig", name: "Maher Al-Muaiqly", style: "Imam Mecque" },
];
