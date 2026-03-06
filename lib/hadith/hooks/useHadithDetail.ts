import { useState, useEffect, useCallback } from "react";
import { fetchHadithDetail } from "../api";
import {
  getCachedHadithDetail,
  setCachedHadithDetail,
} from "../cache";
import type { HadithRecord } from "../types";

export function useHadithDetail(
  collectionName: string | null,
  hadithNumber: string | null
): {
  hadith: HadithRecord | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [hadith, setHadith] = useState<HadithRecord | null>(null);
  const [loading, setLoading] = useState(
    !!(collectionName && hadithNumber)
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!collectionName || !hadithNumber) {
      setHadith(null);
      setLoading(false);
      return;
    }
    setError(null);
    const cached = await getCachedHadithDetail(collectionName, hadithNumber);
    if (cached) {
      setHadith(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchHadithDetail(collectionName, hadithNumber);
      setHadith(data ?? null);
      if (data)
        await setCachedHadithDetail(collectionName, hadithNumber, data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur chargement du hadith"
      );
      if (!cached) setHadith(null);
    } finally {
      setLoading(false);
    }
  }, [collectionName, hadithNumber]);

  useEffect(() => {
    load();
  }, [load]);

  return { hadith, loading, error, refetch: load };
}
