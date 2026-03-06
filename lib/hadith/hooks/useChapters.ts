import { useState, useEffect, useCallback } from "react";
import { fetchChapters } from "../api";
import { getCachedChapters, setCachedChapters } from "../cache";
import type { HadithChapter } from "../types";

export function useChapters(
  collectionName: string | null,
  bookNumber: string | null
): {
  chapters: HadithChapter[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [chapters, setChapters] = useState<HadithChapter[]>([]);
  const [loading, setLoading] = useState(
    !!(collectionName && bookNumber)
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!collectionName || !bookNumber) {
      setChapters([]);
      setLoading(false);
      return;
    }
    setError(null);
    const cached = await getCachedChapters(collectionName, bookNumber);
    if (cached?.length) {
      setChapters(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchChapters(collectionName, bookNumber);
      setChapters(data);
      if (data.length)
        await setCachedChapters(collectionName, bookNumber, data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur chargement des chapitres"
      );
      if (!cached?.length) setChapters([]);
    } finally {
      setLoading(false);
    }
  }, [collectionName, bookNumber]);

  useEffect(() => {
    load();
  }, [load]);

  return { chapters, loading, error, refetch: load };
}
