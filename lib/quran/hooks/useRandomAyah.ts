import { useState, useEffect, useCallback } from "react";
import { fetchRandomAyah, fetchSuraTranslation } from "../api";

export interface RandomAyahData {
  suraNumber: number;
  ayahNumber: number;
  textAr: string;
  textFr: string;
}

export function useRandomAyah(): {
  ayah: RandomAyahData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [ayah, setAyah] = useState<RandomAyahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = (await fetchRandomAyah()) as {
        code?: number;
        data?: {
          surah?: { number: number };
          numberInSurah?: number;
          text?: string;
        };
      };
      if (!res?.data?.surah) {
        setLoading(false);
        return;
      }
      const suraNumber = res.data.surah.number;
      const ayahNumber = res.data.numberInSurah ?? 0;
      const textAr = res.data.text ?? "";

      let textFr = "";
      try {
        const translation = await fetchSuraTranslation(suraNumber);
        const frAyah = translation.find((a) => a.numberInSurah === ayahNumber);
        textFr = frAyah?.text ?? "";
      } catch {
        // garde textFr vide si la traduction échoue
      }

      setAyah({
        suraNumber,
        ayahNumber,
        textAr,
        textFr,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ayah, loading, error, refetch: load };
}
