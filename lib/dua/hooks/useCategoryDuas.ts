import { useState, useEffect, useCallback } from "react";
import { fetchCategoryDuas } from "../api";
import { getCachedCategoryDuas, setCachedCategoryDuas } from "../cache";
import type { DuaItem } from "../types";
import type { DuaLanguage } from "../storage";

export function useCategoryDuas(slug: string | null, lang: DuaLanguage): {
  duas: DuaItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [duas, setDuas] = useState<DuaItem[]>([]);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!slug) {
      setDuas([]);
      setLoading(false);
      return;
    }
    setError(null);
    const cached = await getCachedCategoryDuas(slug, lang);
    if (cached?.length) {
      setDuas(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchCategoryDuas(slug, lang);
      setDuas(data);
      if (data.length) await setCachedCategoryDuas(slug, lang, data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur chargement des invocations");
      if (!cached?.length) setDuas([]);
    } finally {
      setLoading(false);
    }
  }, [slug, lang]);

  useEffect(() => {
    load();
  }, [load]);

  return { duas, loading, error, refetch: load };
}
