import { useState, useEffect, useCallback } from "react";
import { fetchCategories } from "../api";
import { getCachedCategories, setCachedCategories } from "../cache";
import type { DuaCategory } from "../types";
import type { DuaLanguage } from "../storage";

export function useDuaCategories(lang: DuaLanguage): {
  categories: DuaCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const cached = await getCachedCategories(lang);
    if (cached?.length) {
      setCategories(cached);
      setLoading(false);
    }
    try {
      const data = await fetchCategories(lang);
      setCategories(data);
      if (data.length) await setCachedCategories(lang, data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur chargement des catégories");
      if (!cached?.length) setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, loading, error, refetch: load };
}
