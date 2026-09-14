import { useState, useEffect, useCallback } from "react";
import { fetchChapters } from "../api";
import { getCachedChapters, setCachedChapters } from "../cache";
import type { HadithChapter } from "../types";
import { useHadithLanguage } from "./useHadithLanguage";

export function useChapters(
  collectionName: string | null,
  bookNumber: string | null
): {
  chapters: HadithChapter[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const { language } = useHadithLanguage();
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
    const cached = await getCachedChapters(
      `${collectionName}_${language}`,
      bookNumber
    );
    if (cached?.length) {
      setChapters(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchChapters(collectionName, bookNumber, language);
      setChapters(data);
      if (data.length)
        await setCachedChapters(
          `${collectionName}_${language}`,
          bookNumber,
          data
        );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur chargement des chapitres"
      );
      if (!cached?.length) setChapters([]);
    } finally {
      setLoading(false);
    }
  }, [collectionName, bookNumber, language]);

  useEffect(() => {
    load();
  }, [load]);

  return { chapters, loading, error, refetch: load };
}
