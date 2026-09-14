import { useState, useEffect, useCallback } from "react";
import { fetchBooks } from "../api";
import { getCachedBooks, setCachedBooks } from "../cache";
import type { HadithBook } from "../types";
import { useHadithLanguage } from "./useHadithLanguage";

export function useBooks(collectionName: string | null): {
  books: HadithBook[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const { language } = useHadithLanguage();
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(!!collectionName);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!collectionName) {
      setBooks([]);
      setLoading(false);
      return;
    }
    setError(null);
    const cacheKey = `${collectionName}_${language}`;
    const cached = await getCachedBooks(cacheKey);
    if (cached?.length) {
      setBooks(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchBooks(collectionName, language);
      setBooks(data);
      if (data.length) await setCachedBooks(cacheKey, data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur chargement des livres"
      );
      if (!cached?.length) setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [collectionName, language]);

  useEffect(() => {
    load();
  }, [load]);

  return { books, loading, error, refetch: load };
}
