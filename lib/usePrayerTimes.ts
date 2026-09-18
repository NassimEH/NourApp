import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import {
  getAladhanMethodId,
  getPrayerCalculationMethod,
} from "@/lib/prayer-method-preference";
import {
  clearPrayerLocationPreference,
  getPrayerLocationPreference,
  setPrayerLocationManual,
} from "@/lib/prayer-location-preference";

const ALADHAN_BY_ADDRESS = "https://api.aladhan.com/v1/timingsByAddress";
const ALADHAN_BY_COORDS = "https://api.aladhan.com/v1/timings";
const CACHE_KEY = "@prayer_timings_cache_v1";

export type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

type CachedPrayerPayload = {
  dateKey: string;
  timings: PrayerTimes;
  cityName: string | null;
  coords: { latitude: number; longitude: number } | null;
  methodId: number;
};

const PRAYER_LABELS: Record<PrayerKey, string> = {
  Fajr: "Fajr",
  Sunrise: "Lever du soleil",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
};

export const PRAYER_ORDER: PrayerKey[] = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

export function getPrayerLabel(key: PrayerKey): string {
  return PRAYER_LABELS[key];
}

function todayDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

async function readCache(): Promise<CachedPrayerPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedPrayerPayload;
  } catch {
    return null;
  }
}

async function writeCache(payload: CachedPrayerPayload): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

async function fetchTimingsByCoords(
  latitude: number,
  longitude: number,
  methodId: number
): Promise<PrayerTimes | null> {
  const url = `${ALADHAN_BY_COORDS}?latitude=${latitude}&longitude=${longitude}&method=${methodId}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 200 || !data.data?.timings) return null;
  const t = data.data.timings;
  return {
    Fajr: t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr: t.Dhuhr,
    Asr: t.Asr,
    Maghrib: t.Maghrib,
    Isha: t.Isha,
  };
}

async function fetchTimingsByAddress(
  address: string,
  methodId: number
): Promise<PrayerTimes | null> {
  const url = `${ALADHAN_BY_ADDRESS}?address=${encodeURIComponent(address)}&method=${methodId}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 200 || !data.data?.timings) return null;
  const t = data.data.timings;
  return {
    Fajr: t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr: t.Dhuhr,
    Asr: t.Asr,
    Maghrib: t.Maghrib,
    Isha: t.Isha,
  };
}

const FALLBACK_ADDRESS = "Paris";
const FALLBACK_COORDS = { latitude: 48.8566, longitude: 2.3522 };

async function reverseGeocodeLabel(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address?.city) return address.city;
    if (address?.region) return address.region;
  } catch {
    // ignore
  }
  return null;
}

async function resolvePosition(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  const last = await Location.getLastKnownPositionAsync();
  if (last) {
    return {
      latitude: last.coords.latitude,
      longitude: last.coords.longitude,
    };
  }
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export type ApplyLocationResult =
  | { ok: true }
  | { ok: false; reason: "empty" | "not_found" | "error" };

export function usePrayerTimes() {
  const [timings, setTimings] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingLocation, setApplyingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const hasTimingsRef = useRef(false);

  useEffect(() => {
    hasTimingsRef.current = timings != null;
  }, [timings]);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    (async () => {
      const cached = await readCache();
      if (cancelled) return;

      const dateKey = todayDateKey();
      if (cached?.timings && cached.dateKey === dateKey) {
        setTimings(cached.timings);
        setCityName(cached.cityName);
        setCoords(cached.coords);
        setLoading(false);
      } else if (!hasTimingsRef.current) {
        setLoading(true);
      }

      try {
        const calcMethod = await getPrayerCalculationMethod();
        const methodId = getAladhanMethodId(calcMethod);
        const saved = await getPrayerLocationPreference();

        const commit = async (
          nextTimings: PrayerTimes,
          nextCity: string | null,
          nextCoords: { latitude: number; longitude: number } | null
        ) => {
          if (cancelled) return;
          setTimings(nextTimings);
          setCityName(nextCity);
          setCoords(nextCoords);
          setLoading(false);
          await writeCache({
            dateKey,
            timings: nextTimings,
            cityName: nextCity,
            coords: nextCoords,
            methodId,
          });
        };

        if (saved?.source === "manual") {
          let manualTimings: PrayerTimes | null = null;
          let manualCoords: { latitude: number; longitude: number } | null =
            null;
          if (
            typeof saved.latitude === "number" &&
            typeof saved.longitude === "number"
          ) {
            manualCoords = {
              latitude: saved.latitude,
              longitude: saved.longitude,
            };
            manualTimings = await fetchTimingsByCoords(
              saved.latitude,
              saved.longitude,
              methodId
            );
          } else {
            manualTimings = await fetchTimingsByAddress(
              saved.address,
              methodId
            );
          }
          if (cancelled) return;
          if (manualTimings) {
            await commit(manualTimings, saved.label, manualCoords);
            return;
          }
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;

        if (status !== "granted") {
          const fallback = await fetchTimingsByAddress(
            FALLBACK_ADDRESS,
            methodId
          );
          if (!cancelled && fallback) {
            await commit(fallback, FALLBACK_ADDRESS, FALLBACK_COORDS);
          } else if (!cancelled) {
            setError("Impossible de charger les horaires");
            setLoading(false);
          }
          return;
        }

        const position = await resolvePosition();
        if (cancelled || !position) return;

        const { latitude, longitude } = position;
        const coordsTimings = await fetchTimingsByCoords(
          latitude,
          longitude,
          methodId
        );
        if (cancelled) return;

        if (coordsTimings) {
          const label =
            (await reverseGeocodeLabel(latitude, longitude)) ?? null;
          if (cancelled) return;
          await commit(coordsTimings, label, { latitude, longitude });
        } else {
          const fallback = await fetchTimingsByAddress(
            FALLBACK_ADDRESS,
            methodId
          );
          if (!cancelled && fallback) {
            await commit(fallback, FALLBACK_ADDRESS, FALLBACK_COORDS);
          } else if (!cancelled) {
            setError("Impossible de charger les horaires");
            setLoading(false);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur de position");
          try {
            const methodId = getAladhanMethodId(
              await getPrayerCalculationMethod()
            );
            const fallback = await fetchTimingsByAddress(
              FALLBACK_ADDRESS,
              methodId
            );
            if (!cancelled && fallback) {
              setTimings(fallback);
              setCityName(FALLBACK_ADDRESS);
              setCoords(FALLBACK_COORDS);
              setError(null);
              await writeCache({
                dateKey: todayDateKey(),
                timings: fallback,
                cityName: FALLBACK_ADDRESS,
                coords: FALLBACK_COORDS,
                methodId,
              });
            }
          } catch {
            // keep error
          }
          setLoading(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refetchTrigger]);

  const refetch = useCallback(() => setRefetchTrigger((t) => t + 1), []);

  const applyLocationByQuery = useCallback(
    async (query: string): Promise<ApplyLocationResult> => {
      const trimmed = query.trim();
      if (!trimmed) return { ok: false, reason: "empty" };

      setApplyingLocation(true);
      setError(null);
      try {
        const methodId = getAladhanMethodId(await getPrayerCalculationMethod());
        const geocoded = await Location.geocodeAsync(trimmed);
        const hit = geocoded[0];

        if (hit) {
          const { latitude, longitude } = hit;
          const coordsTimings = await fetchTimingsByCoords(
            latitude,
            longitude,
            methodId
          );
          if (!coordsTimings) return { ok: false, reason: "not_found" };

          const label =
            (await reverseGeocodeLabel(latitude, longitude)) ?? trimmed;
          await setPrayerLocationManual({
            label,
            address: trimmed,
            latitude,
            longitude,
          });
          setTimings(coordsTimings);
          setCityName(label);
          setCoords({ latitude, longitude });
          await writeCache({
            dateKey: todayDateKey(),
            timings: coordsTimings,
            cityName: label,
            coords: { latitude, longitude },
            methodId,
          });
          return { ok: true };
        }

        const addressTimings = await fetchTimingsByAddress(trimmed, methodId);
        if (!addressTimings) return { ok: false, reason: "not_found" };

        await setPrayerLocationManual({
          label: trimmed,
          address: trimmed,
        });
        setTimings(addressTimings);
        setCityName(trimmed);
        setCoords(null);
        await writeCache({
          dateKey: todayDateKey(),
          timings: addressTimings,
          cityName: trimmed,
          coords: null,
          methodId,
        });
        return { ok: true };
      } catch {
        return { ok: false, reason: "error" };
      } finally {
        setApplyingLocation(false);
      }
    },
    []
  );

  const applyDeviceLocation = useCallback(async () => {
    await clearPrayerLocationPreference();
    refetch();
  }, [refetch]);

  return {
    timings,
    loading,
    applyingLocation,
    error,
    cityName,
    coords,
    refetch,
    applyLocationByQuery,
    applyDeviceLocation,
  };
}
