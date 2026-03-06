import { useState, useEffect, useCallback } from "react";
import {
  getHadithFavorites,
  setHadithFavorites,
  getHadithFavoriteKey,
} from "../storage";
import type { HadithFavorite, HadithRecord } from "../types";

export function useHadithFavorites(): {
  favorites: HadithFavorite[];
  loading: boolean;
  isFavorite: (collectionName: string, hadithNumber: string) => boolean;
  addFavorite: (item: HadithRecord | HadithFavorite, meta?: { collectionDisplayName?: string; bookName?: string; chapterTitle?: string }) => Promise<void>;
  removeFavorite: (collectionName: string, hadithNumber: string) => Promise<void>;
  toggleFavorite: (item: HadithRecord | HadithFavorite, meta?: { collectionDisplayName?: string; bookName?: string; chapterTitle?: string }) => Promise<void>;
  refetch: () => Promise<void>;
} {
  const [favorites, setFavoritesState] = useState<HadithFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const list = await getHadithFavorites();
    setFavoritesState(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const isFavorite = useCallback(
    (collectionName: string, hadithNumber: string) => {
      return favorites.some(
        (f) =>
          f.collectionName === collectionName && f.hadithNumber === hadithNumber
      );
    },
    [favorites]
  );

  const addFavorite = useCallback(
    async (
      item: HadithRecord | HadithFavorite,
      meta?: { collectionDisplayName?: string; bookName?: string; chapterTitle?: string }
    ) => {
      const isRecord = "collection" in item && "hadith" in item;
      const collectionName = isRecord
        ? (item as HadithRecord).collection
        : (item as HadithFavorite).collectionName;
      const hadithNumber = isRecord
        ? (item as HadithRecord).hadithNumber
        : (item as HadithFavorite).hadithNumber;
      let arabicBody: string | undefined;
      let englishBody: string | undefined;
      if (isRecord) {
        const ar = (item as HadithRecord).hadith?.find((h) => h.lang === "ar");
        const en = (item as HadithRecord).hadith?.find((h) => h.lang === "en");
        arabicBody = ar?.body;
        englishBody = en?.body;
      } else {
        arabicBody = (item as HadithFavorite).arabicBody;
        englishBody = (item as HadithFavorite).englishBody;
      }
      const entry: HadithFavorite = {
        collectionName,
        hadithNumber,
        arabicBody,
        englishBody,
        collectionDisplayName: meta?.collectionDisplayName,
        bookName: meta?.bookName,
        chapterTitle: meta?.chapterTitle,
        addedAt: Date.now(),
      };
      const key = getHadithFavoriteKey(collectionName, hadithNumber);
      const next = [
        ...favorites.filter(
          (f) =>
            getHadithFavoriteKey(f.collectionName, f.hadithNumber) !== key
        ),
        entry,
      ];
      setFavoritesState(next);
      await setHadithFavorites(next);
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (collectionName: string, hadithNumber: string) => {
      const key = getHadithFavoriteKey(collectionName, hadithNumber);
      const next = favorites.filter(
        (f) => getHadithFavoriteKey(f.collectionName, f.hadithNumber) !== key
      );
      setFavoritesState(next);
      await setHadithFavorites(next);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (
      item: HadithRecord | HadithFavorite,
      meta?: { collectionDisplayName?: string; bookName?: string; chapterTitle?: string }
    ) => {
      const collectionName =
        "collectionName" in item ? item.collectionName : item.collection;
      const hadithNumber =
        "hadithNumber" in item ? item.hadithNumber : (item as HadithRecord).hadithNumber;
      if (isFavorite(collectionName, hadithNumber))
        await removeFavorite(collectionName, hadithNumber);
      else await addFavorite(item as HadithRecord, meta);
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refetch,
  };
}
