/**
 * Service API AlQuran Cloud.
 * Toutes les requêtes passent ici pour faciliter cache, retry et évolution offline.
 */

import type {
  SuraListResponse,
  SuraEditionResponse,
  SuraMeta,
  SuraContent,
  AyahText,
} from "./types";
import {
  QURAN_UTHMANI_EDITION,
  FR_TRANSLATION_EDITION,
  DEFAULT_AUDIO_RECITER,
  AUDIO_BITRATE,
} from "./types";

const BASE = "https://api.alquran.cloud/v1";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

/** Liste des 114 sourates */
export async function fetchSuraList(): Promise<SuraMeta[]> {
  const out = await fetchJson<SuraListResponse>(`${BASE}/surah`);
  if (out.code !== 200 || !out.data) throw new Error("Invalid sura list response");
  return out.data;
}

/** Contenu d'une sourate en arabe (Uthmani) */
export async function fetchSuraArabic(suraNumber: number): Promise<SuraContent> {
  const out = await fetchJson<SuraEditionResponse>(
    `${BASE}/surah/${suraNumber}/${QURAN_UTHMANI_EDITION}`
  );
  if (out.code !== 200 || !out.data) throw new Error(`Sura ${suraNumber} Arabic failed`);
  return out.data;
}

/** Contenu d'une sourate en français (traduction) */
export async function fetchSuraTranslation(suraNumber: number): Promise<AyahText[]> {
  const out = await fetchJson<SuraEditionResponse>(
    `${BASE}/surah/${suraNumber}/${FR_TRANSLATION_EDITION}`
  );
  if (out.code !== 200 || !out.data?.ayahs) throw new Error(`Sura ${suraNumber} translation failed`);
  return out.data.ayahs;
}

/** Une sourate complète : arabe + traduction (deux appels en parallèle) */
export async function fetchSuraFull(suraNumber: number): Promise<{
  arabic: SuraContent;
  translation: AyahText[];
}> {
  const [arabic, translation] = await Promise.all([
    fetchSuraArabic(suraNumber),
    fetchSuraTranslation(suraNumber),
  ]);
  return { arabic, translation };
}

/** Un Juz (1-30) avec édition */
export async function fetchJuz(juzNumber: number, edition: string = QURAN_UTHMANI_EDITION) {
  const url = `${BASE}/juz/${juzNumber}/${edition}`;
  return fetchJson(url);
}

/** Verset aléatoire (pour "Verset du jour" etc.) */
export async function fetchRandomAyah() {
  const url = `${BASE}/ayah/random`;
  return fetchJson(url);
}

/** URL audio : sourate entière (CDN Islamic Network) */
export function getSuraAudioUrl(suraNumber: number, reciter: string = DEFAULT_AUDIO_RECITER): string {
  return `https://cdn.islamic.network/quran/audio-surah/${AUDIO_BITRATE}/${reciter}/${suraNumber}.mp3`;
}

/** URL audio : un verset (numéro global 1-6236) */
export function getAyahAudioUrl(globalAyahNumber: number, reciter: string = DEFAULT_AUDIO_RECITER): string {
  return `https://cdn.islamic.network/quran/audio/${AUDIO_BITRATE}/${reciter}/${globalAyahNumber}.mp3`;
}
