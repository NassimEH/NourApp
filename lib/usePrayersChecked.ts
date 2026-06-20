import { useEffect, useState, useCallback } from "react";

import {
  getTodayPrayerLogKey,
  loadPrayersChecked,
  prayersStorageAvailable,
  savePrayersChecked,
  type PrayersCheckedState,
} from "./prayer-daily-log";
import type { PrayerKey } from "./usePrayerTimes";

export type { PrayersCheckedState };

export function usePrayersChecked() {
  const [checked, setChecked] = useState<PrayersCheckedState>({});
  const [loaded, setLoaded] = useState(false);

  const key = getTodayPrayerLogKey();

  useEffect(() => {
    if (!prayersStorageAvailable) {
      setLoaded(true);
      return;
    }
    loadPrayersChecked(key)
      .then(setChecked)
      .catch(() => setChecked({}))
      .finally(() => setLoaded(true));
  }, [key]);

  const toggle = useCallback(
    (prayer: PrayerKey) => {
      setChecked((prev) => {
        const next = { ...prev, [prayer]: !prev[prayer] };
        void savePrayersChecked(key, next);
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
