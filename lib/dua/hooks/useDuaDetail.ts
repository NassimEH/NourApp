import { useState, useEffect, useCallback } from "react";
import { fetchDuaDetail } from "../api";
import { getCachedDuaDetail, setCachedDuaDetail } from "../cache";
import type { DuaDetail } from "../types";
import type { DuaLanguage } from "../storage";

export function useDuaDetail(slug: string | null, id: number | null, lang: DuaLanguage): {
  detail: DuaDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [detail, setDetail] = useState<DuaDetail | null>(null);
  const [loading, setLoading] = useState(!!(slug && id));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!slug || id == null) {
      setDetail(null);
      setLoading(false);
      return;
    }
    setError(null);
    const cached = await getCachedDuaDetail(slug, id, lang);
    if (cached) {
      setDetail(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchDuaDetail(slug, id, lang);
      setDetail(data ?? null);
      if (data) await setCachedDuaDetail(slug, id, lang, data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur chargement de l'invocation");
      if (!cached) setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [slug, id, lang]);

  useEffect(() => {
    load();
  }, [load]);

  return { detail, loading, error, refetch: load };
}
