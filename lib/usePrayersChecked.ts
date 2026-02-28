import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PrayerKey } from "./usePrayerTimes";

const STORAGE_KEY_PREFIX = "prayers_checked_";

function getTodayKey() {
  const d = new Date();
  return `${STORAGE_KEY_PREFIX}${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export type PrayersCheckedState = Partial<Record<PrayerKey, boolean>>;

/** AsyncStorage non disponible sur web (module natif null) */
const storageAvailable = Platform.OS !== "web";

export function usePrayersChecked() {
  const [checked, setChecked] = useState<PrayersCheckedState>({});
  const [loaded, setLoaded] = useState(false);

  const key = getTodayKey();

  useEffect(() => {
    if (!storageAvailable) {
      setLoaded(true);
      return;
    }
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw) {
          try {
            setChecked(JSON.parse(raw));
          } catch {
            setChecked({});
          }
        } else {
          setChecked({});
        }
      })
      .catch(() => setChecked({}))
      .finally(() => setLoaded(true));
  }, [key]);

  const toggle = useCallback(
    (prayer: PrayerKey) => {
      setChecked((prev) => {
        const next = { ...prev, [prayer]: !prev[prayer] };
        if (storageAvailable) {
          AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
        }
        return next;
      });
    },
    [key]
  );

  const isChecked = useCallback(
    (prayer: PrayerKey) => !!checked[prayer],
    [checked]
  );

  return { checked, toggle, isChecked, loaded };
}
