import { useState, useEffect, useCallback } from "react";
import { fetchSuraList } from "../api";
import { getCachedSuraList, setCachedSuraList } from "../cache";
import type { SuraMeta } from "../types";

export function useSuraList(): {
  list: SuraMeta[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [list, setList] = useState<SuraMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const cached = await getCachedSuraList();
    if (cached?.length) {
      setList(cached);
      setLoading(false);
      // Optionnel : rafraîchir en arrière-plan
      try {
        const fresh = await fetchSuraList();
        await setCachedSuraList(fresh);
        setList(fresh);
      } catch {
        // garder le cache
      }
      return;
    }
    setLoading(true);
    try {
      const data = await fetchSuraList();
      await setCachedSuraList(data);
      setList(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur chargement des sourates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { list, loading, error, refetch: load };
}
