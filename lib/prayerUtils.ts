import type { PrayerTimes } from "./usePrayerTimes";

const MECCA_LAT = 21.4225;
const MECCA_LON = 39.8262;

export function getQiblaBearing(lat: number, lon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const lat1 = toRad(lat);
  const lon1 = toRad(lon);
  const lat2 = toRad(MECCA_LAT);
  const lon2 = toRad(MECCA_LON);
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

const SALAT_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function getNowMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

const SALAT_LABELS: Record<string, string> = {
  Fajr: "Fajr",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
};

/** Prochaine prière (aujourd'hui ou demain Fajr si on est après Isha) */
export function getNextPrayerInfo(
  timings: PrayerTimes
): { name: string; label: string; inMinutes: number } | null {
  const now = getNowMinutes();
  for (const key of SALAT_KEYS) {
    const t = timings[key];
    if (!t) continue;
    const prayerMins = parseTimeToMinutes(t);
    if (prayerMins > now) {
      return {
        name: key,
        label: SALAT_LABELS[key] ?? key,
        inMinutes: prayerMins - now,
      };
    }
  }
  // Après Isha : prochaine prière = Fajr demain
  const fajr = timings.Fajr;
  if (!fajr) return null;
  const [h, m] = fajr.split(":").map(Number);
  const nowDate = new Date();
  const tomorrowFajr = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate() + 1,
    h ?? 0,
    m ?? 0,
    0,
    0
  );
  const inMinutes = Math.max(0, Math.floor((tomorrowFajr.getTime() - nowDate.getTime()) / 60000));
  return {
    name: "Fajr",
    label: "Fajr",
    inMinutes,
  };
}

/** Prière dont il est encore temps (dernière dont l'heure est passée, avant la suivante) */
export function getCurrentPrayer(
  timings: PrayerTimes
): { name: string; label: string } | null {
  const now = getNowMinutes();
  let lastPassed: { name: string; label: string } | null = null;
  for (const key of SALAT_KEYS) {
    const t = timings[key];
    if (!t) continue;
    const prayerMins = parseTimeToMinutes(t);
    if (prayerMins <= now) {
      lastPassed = { name: key, label: SALAT_LABELS[key] ?? key };
    } else break;
  }
  return lastPassed;
}

export function getRemainingPrayersCount(_timings: PrayerTimes): number {
  // Déprécié : ne plus utiliser (reste pour compat). Le comptage se fait côté UI via les coches.
  const now = getNowMinutes();
  let count = 0;
  for (const key of SALAT_KEYS) {
    const t = _timings[key];
    if (!t) continue;
    if (parseTimeToMinutes(t) > now) count++;
  }
  return count;
}

export function formatCountdown(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/** Timestamp (ms) de la prochaine prière (aujourd'hui ou demain Fajr si après Isha) */
export function getNextPrayerTimestamp(timings: PrayerTimes): number | null {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const nowMins = getNowMinutes();
  for (const key of SALAT_KEYS) {
    const t = timings[key];
    if (!t) continue;
    const [h, m] = t.split(":").map(Number);
    const prayerMins = (h ?? 0) * 60 + (m ?? 0);
    if (prayerMins > nowMins) {
      const ms = (prayerMins * 60) * 1000;
      return todayStart + ms;
    }
  }
  // Après Isha : prochaine = Fajr demain (même heure qu'aujourd'hui)
  const fajr = timings.Fajr;
  if (!fajr) return null;
  const [fajrH, fajrM] = fajr.split(":").map(Number);
  const tomorrowFajr = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    fajrH ?? 0,
    fajrM ?? 0,
    0,
    0
  );
  return tomorrowFajr.getTime();
}

/** Formate un nombre de secondes en HH:MM:SS */
export function formatCountdownHMS(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
