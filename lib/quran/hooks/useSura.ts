import { useState, useEffect, useCallback } from "react";
import { fetchSuraFull } from "../api";
import { getCachedSuraContent, setCachedSuraContent } from "../cache";
import type { SuraContent, AyahText } from "../types";

export interface SuraFull {
  arabic: SuraContent;
  translation: AyahText[];
}

export function useSura(suraNumber: number | null): {
  data: SuraFull | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<SuraFull | null>(null);
  const [loading, setLoading] = useState(!!suraNumber);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (suraNumber == null) {
      setData(null);
      setLoading(false);
      return;
    }
    setError(null);
    const cached = await getCachedSuraContent(suraNumber);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const content = await fetchSuraFull(suraNumber);
      await setCachedSuraContent(suraNumber, content);
      setData(content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur chargement de la sourate");
    } finally {
      setLoading(false);
    }
  }, [suraNumber]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
