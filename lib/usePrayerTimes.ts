import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

const ALADHAN_BY_ADDRESS = "https://api.aladhan.com/v1/timingsByAddress";
const ALADHAN_BY_COORDS = "https://api.aladhan.com/v1/timings";

export type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

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

async function fetchTimingsByCoords(
  latitude: number,
  longitude: number
): Promise<PrayerTimes | null> {
  const url = `${ALADHAN_BY_COORDS}?latitude=${latitude}&longitude=${longitude}`;
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

async function fetchTimingsByAddress(address: string): Promise<PrayerTimes | null> {
  const url = `${ALADHAN_BY_ADDRESS}?address=${encodeURIComponent(address)}`;
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

export function usePrayerTimes() {
  const [timings, setTimings] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCityName(null);

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;

        if (status !== "granted") {
          const fallback = await fetchTimingsByAddress(FALLBACK_ADDRESS);
          if (!cancelled && fallback) {
            setTimings(fallback);
            setCityName(FALLBACK_ADDRESS);
            setCoords(FALLBACK_COORDS);
          } else if (!cancelled) setError("Impossible de charger les horaires");
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;

        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });

        const coordsTimings = await fetchTimingsByCoords(latitude, longitude);
        if (cancelled) return;

        if (coordsTimings) {
          setTimings(coordsTimings);
          try {
            const [address] = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });
            if (!cancelled && address?.city) setCityName(address.city);
            else if (!cancelled && address?.region) setCityName(address.region);
          } catch {
            // ignore geocode failure, we still have timings
          }
        } else {
          const fallback = await fetchTimingsByAddress(FALLBACK_ADDRESS);
          if (!cancelled && fallback) {
            setTimings(fallback);
            setCityName(FALLBACK_ADDRESS);
          } else if (!cancelled) setError("Impossible de charger les horaires");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur de position");
          try {
            const fallback = await fetchTimingsByAddress(FALLBACK_ADDRESS);
            if (!cancelled && fallback) {
              setTimings(fallback);
              setCityName(FALLBACK_ADDRESS);
              setCoords(FALLBACK_COORDS);
              setError(null);
            }
          } catch {
            // keep error
          }
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

  return { timings, loading, error, cityName, coords, refetch };
}
