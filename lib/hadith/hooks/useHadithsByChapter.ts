import { useState, useEffect, useCallback } from "react";
import { fetchHadithsByChapter } from "../api";
import {
  getCachedHadithsByChapter,
  setCachedHadithsByChapter,
} from "../cache";
import type { HadithRecord } from "../types";

export function useHadithsByChapter(
  collectionName: string | null,
  bookNumber: string | null,
  chapterId: string | null
): {
  hadiths: HadithRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [hadiths, setHadiths] = useState<HadithRecord[]>([]);
  const [loading, setLoading] = useState(
    !!(collectionName && bookNumber && chapterId)
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!collectionName || !bookNumber || !chapterId) {
      setHadiths([]);
      setLoading(false);
      return;
    }
    setError(null);
    const cached = await getCachedHadithsByChapter(
      collectionName,
      bookNumber,
      chapterId
    );
    if (cached?.length) {
      setHadiths(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const { data } = await fetchHadithsByChapter(
        collectionName,
        bookNumber,
        chapterId,
        1,
        200
      );
      setHadiths(data);
      if (data.length)
        await setCachedHadithsByChapter(
          collectionName,
          bookNumber,
          chapterId,
          data
        );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur chargement des hadiths"
      );
      if (!cached?.length) setHadiths([]);
    } finally {
      setLoading(false);
    }
  }, [collectionName, bookNumber, chapterId]);

  useEffect(() => {
    load();
  }, [load]);

  return { hadiths, loading, error, refetch: load };
}
