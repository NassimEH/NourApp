import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { getLastListen, getLastRead } from "@/lib/quran/storage";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { useTranslation } from "@/lib/i18n";

export type ContinueActivityKind = "listen" | "read";

export interface ContinueActivity {
  id: string;
  kind: ContinueActivityKind;
  suraNumber: number;
  suraName: string;
  suraNameAr?: string;
  subtitle: string;
  progress?: number;
  timestamp: number;
}

export function useContinueActivities() {
  const { t } = useTranslation();
  const { list: suraList } = useSuraList();
  const [items, setItems] = useState<ContinueActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const suraByNumber = useMemo(() => {
    const map = new Map<number, (typeof suraList)[number]>();
    for (const s of suraList) map.set(s.number, s);
    return map;
  }, [suraList]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [lastListen, lastRead] = await Promise.all([
        getLastListen(),
        getLastRead(),
      ]);
      const next: ContinueActivity[] = [];

      if (lastListen && lastListen.timestamp > 0) {
        const meta = suraByNumber.get(lastListen.suraNumber);
        const pct = Math.round(lastListen.progress * 100);
        next.push({
          id: `listen-${lastListen.suraNumber}`,
          kind: "listen",
          suraNumber: lastListen.suraNumber,
          suraName:
            meta?.englishName ??
            t("home.continueSuraFallback", { number: lastListen.suraNumber }),
          suraNameAr: meta?.name,
          subtitle:
            pct > 0
              ? t("home.continueListenProgress", { percent: pct })
              : t("home.continueListen"),
          progress: lastListen.progress,
          timestamp: lastListen.timestamp,
        });
      }

      if (lastRead && lastRead.timestamp > 0) {
        const meta = suraByNumber.get(lastRead.suraNumber);
        next.push({
          id: `read-${lastRead.suraNumber}`,
          kind: "read",
          suraNumber: lastRead.suraNumber,
          suraName:
            meta?.englishName ??
            t("home.continueSuraFallback", { number: lastRead.suraNumber }),
          suraNameAr: meta?.name,
          subtitle: t("home.continueRead"),
          timestamp: lastRead.timestamp,
        });
      }

      next.sort((a, b) => b.timestamp - a.timestamp);
      setItems(next.slice(0, 4));
    } finally {
      setLoading(false);
    }
  }, [suraByNumber, t]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { items, loading, refresh: load };
}
