import { useCallback, useEffect, useState } from "react";

import { getDuaFavorites } from "@/lib/dua/storage";
import { getHadithFavorites } from "@/lib/hadith/storage";
import { useAppPreferences } from "@/lib/app-preferences";
import { translate } from "@/lib/i18n";
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

function mapQuran(f: QuranFavorite, locale: "fr" | "en" | "ar"): UnifiedFavoriteItem {
  const ayahPart =
    f.type === "ayah" && f.ayahNumber != null ? ` · ${f.ayahNumber}` : "";
  return {
    id: `quran-${f.suraNumber}-${f.ayahNumber ?? "sura"}`,
    kind: "quran",
    title: `${translate(locale, "favorites.kindQuran")} ${f.suraNumber}${ayahPart}`,
    subtitle:
      f.type === "ayah"
        ? translate(locale, "favorites.quranAyahFavorite")
        : translate(locale, "favorites.quranSuraFavorite"),
    route: `/(root)/(tabs)/coran/${f.suraNumber}`,
  };
}

export function useUnifiedFavorites() {
  const { locale } = useAppPreferences();
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
          subtitle: `${translate(locale, "favorites.kindHadith")} ${h.hadithNumber}`,
          route:
            "/(root)/(tabs)/coran/hadiths/collection/[name]/hadith/[hadithNumber]",
          params: {
            name: h.collectionName,
            hadithNumber: h.hadithNumber,
          },
        })),
        ...quran.map((item) => mapQuran(item, locale)),
      ];

      setItems(merged);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, loading, refetch };
}
