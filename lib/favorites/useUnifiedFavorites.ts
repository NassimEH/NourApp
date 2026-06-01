import { useCallback, useEffect, useState } from "react";

import { getDuaFavorites } from "@/lib/dua/storage";
import { getHadithFavorites } from "@/lib/hadith/storage";
import { getFavorites as getQuranFavorites } from "@/lib/quran/storage";
import type { Favorite as QuranFavorite } from "@/lib/quran/types";

export type UnifiedFavoriteKind = "dua" | "hadith" | "quran";

export interface UnifiedFavoriteItem {
  id: string;
  kind: UnifiedFavoriteKind;
  title: string;
  subtitle: string;
  route: string;
  params?: Record<string, string>;
}

function mapQuran(f: QuranFavorite): UnifiedFavoriteItem {
  const ayahPart =
    f.type === "ayah" && f.ayahNumber != null ? ` · ${f.ayahNumber}` : "";
  return {
    id: `quran-${f.suraNumber}-${f.ayahNumber ?? "sura"}`,
    kind: "quran",
    title: `Sourate ${f.suraNumber}${ayahPart}`,
    subtitle: f.type === "ayah" ? "Verset favori" : "Sourate favorite",
    route: `/(root)/(tabs)/coran/${f.suraNumber}`,
  };
}

export function useUnifiedFavorites() {
  const [items, setItems] = useState<UnifiedFavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [duas, hadiths, quran] = await Promise.all([
        getDuaFavorites(),
        getHadithFavorites(),
        getQuranFavorites(),
      ]);

      const merged: UnifiedFavoriteItem[] = [
        ...duas.map((d) => ({
          id: `dua-${d.categorySlug}-${d.duaId}`,
          kind: "dua" as const,
          title: d.title,
          subtitle: d.translation || d.arabic || "",
          route: "/(root)/(tabs)/coran/invocations/dua/[slug]/[id]",
          params: { slug: d.categorySlug, id: String(d.duaId) },
        })),
        ...hadiths.map((h) => ({
          id: `hadith-${h.collectionName}-${h.hadithNumber}`,
          kind: "hadith" as const,
          title: h.collectionDisplayName || h.collectionName,
          subtitle: `Hadith ${h.hadithNumber}`,
          route:
            "/(root)/(tabs)/coran/hadiths/collection/[name]/hadith/[hadithNumber]",
          params: {
            name: h.collectionName,
            hadithNumber: h.hadithNumber,
          },
        })),
        ...quran.map(mapQuran),
      ];

      setItems(merged);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, loading, refetch };
}
