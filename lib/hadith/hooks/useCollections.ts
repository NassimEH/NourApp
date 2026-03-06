import { useState, useEffect, useCallback } from "react";
import { fetchCollections } from "../api";
import { getCachedCollections, setCachedCollections } from "../cache";
import type { HadithCollection } from "../types";

export function useCollections(): {
  collections: HadithCollection[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [collections, setCollections] = useState<HadithCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const cached = await getCachedCollections();
    if (cached?.length) {
      setCollections(cached);
      setLoading(false);
    }
    try {
      const data = await fetchCollections();
      setCollections(data);
      if (data.length) await setCachedCollections(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur chargement des collections"
      );
      if (!cached?.length) setCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { collections, loading, error, refetch: load };
}
