/**
 * Téléchargements audio Coran hors-ligne (1–3 sourates par récitateur).
 * Fichiers dans documentDirectory/quran-audio/{reciter}/{sura}.mp3
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

import { getSuraAudioUrl } from "./api";
import { AUDIO_BITRATE } from "./types";

const KEY_OFFLINE_ENABLED = "@quran_offline_enabled";
const KEY_DOWNLOADS = "@quran_offline_downloads";
const MAX_DOWNLOADS = 3;

export type OfflineDownload = {
  suraNumber: number;
  reciterId: string;
  localUri: string;
  downloadedAt: number;
  bytes?: number;
};

function audioDir(reciterId: string): string {
  return `${FileSystem.documentDirectory}quran-audio/${reciterId}/`;
}

function audioPath(reciterId: string, suraNumber: number): string {
  return `${audioDir(reciterId)}${suraNumber}.mp3`;
}

export async function getOfflineRecitationsEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY_OFFLINE_ENABLED)) === "true";
  } catch {
    return false;
  }
}

export async function setOfflineRecitationsEnabled(
  enabled: boolean
): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY_OFFLINE_ENABLED, enabled ? "true" : "false");
  } catch {
    /* ignore */
  }
}

async function readIndex(): Promise<OfflineDownload[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_DOWNLOADS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OfflineDownload[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIndex(list: OfflineDownload[]): Promise<void> {
  await AsyncStorage.setItem(KEY_DOWNLOADS, JSON.stringify(list));
}

export async function listOfflineDownloads(): Promise<OfflineDownload[]> {
  const list = await readIndex();
  const existing: OfflineDownload[] = [];
  for (const item of list) {
    const info = await FileSystem.getInfoAsync(item.localUri).catch(() => null);
    if (info?.exists) existing.push(item);
  }
  if (existing.length !== list.length) await writeIndex(existing);
  return existing;
}

export async function getLocalSuraAudioUri(
  suraNumber: number,
  reciterId: string
): Promise<string | null> {
  const enabled = await getOfflineRecitationsEnabled();
  if (!enabled) return null;
  const path = audioPath(reciterId, suraNumber);
  const info = await FileSystem.getInfoAsync(path).catch(() => null);
  return info?.exists ? path : null;
}

/** Résout URI locale si dispo, sinon URL CDN. */
export async function resolveSuraAudioUri(
  suraNumber: number,
  reciterId: string
): Promise<string> {
  const local = await getLocalSuraAudioUri(suraNumber, reciterId);
  return local ?? getSuraAudioUrl(suraNumber, reciterId);
}

export async function isSuraDownloaded(
  suraNumber: number,
  reciterId: string
): Promise<boolean> {
  return (await getLocalSuraAudioUri(suraNumber, reciterId)) != null;
}

export async function downloadSuraAudio(
  suraNumber: number,
  reciterId: string,
  onProgress?: (ratio: number) => void
): Promise<OfflineDownload> {
  const list = await listOfflineDownloads();
  const existing = list.find(
    (d) => d.suraNumber === suraNumber && d.reciterId === reciterId
  );
  if (existing) return existing;

  if (list.length >= MAX_DOWNLOADS) {
    throw new Error(`MAX_DOWNLOADS_${MAX_DOWNLOADS}`);
  }

  const dir = audioDir(reciterId);
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(
    () => undefined
  );

  const dest = audioPath(reciterId, suraNumber);
  const remote = getSuraAudioUrl(suraNumber, reciterId);

  const result = await FileSystem.downloadAsync(remote, dest);
  if (result.status !== 200) {
    await FileSystem.deleteAsync(dest, { idempotent: true }).catch(() => {});
    throw new Error(`Download failed: ${result.status}`);
  }

  onProgress?.(1);

  const info = await FileSystem.getInfoAsync(dest);
  const entry: OfflineDownload = {
    suraNumber,
    reciterId,
    localUri: dest,
    downloadedAt: Date.now(),
    bytes: info.exists && "size" in info ? (info.size as number) : undefined,
  };

  await writeIndex([...list, entry]);
  await setOfflineRecitationsEnabled(true);
  return entry;
}

export async function deleteOfflineDownload(
  suraNumber: number,
  reciterId: string
): Promise<void> {
  const path = audioPath(reciterId, suraNumber);
  await FileSystem.deleteAsync(path, { idempotent: true }).catch(() => {});
  const next = (await readIndex()).filter(
    (d) => !(d.suraNumber === suraNumber && d.reciterId === reciterId)
  );
  await writeIndex(next);
}

export async function clearAllOfflineDownloads(): Promise<void> {
  const list = await readIndex();
  await Promise.all(
    list.map((d) =>
      FileSystem.deleteAsync(d.localUri, { idempotent: true }).catch(() => {})
    )
  );
  await writeIndex([]);
}

export { MAX_DOWNLOADS, AUDIO_BITRATE };
