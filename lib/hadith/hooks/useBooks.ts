import { useState, useEffect, useCallback } from "react";
import { fetchBooks } from "../api";
import { getCachedBooks, setCachedBooks } from "../cache";
import type { HadithBook } from "../types";

export function useBooks(collectionName: string | null): {
  books: HadithBook[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
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
    const cached = await getCachedBooks(collectionName);
    if (cached?.length) {
      setBooks(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchBooks(collectionName);
      setBooks(data);
      if (data.length) await setCachedBooks(collectionName, data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur chargement des livres"
      );
      if (!cached?.length) setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    load();
  }, [load]);

  return { books, loading, error, refetch: load };
}
