import { useState, useEffect, useCallback } from "react";
import { getFavorites, setFavorites } from "../storage";
import type { Favorite } from "../types";

export function useFavorites(): {
  favorites: Favorite[];
  isFavorite: (suraNumber: number, ayahNumber?: number) => boolean;
  addFavorite: (suraNumber: number, ayahNumber?: number, globalAyahNumber?: number) => Promise<void>;
  removeFavorite: (suraNumber: number, ayahNumber?: number) => Promise<void>;
  toggleFavorite: (suraNumber: number, ayahNumber?: number, globalAyahNumber?: number) => Promise<void>;
} {
  const [favorites, setFavoritesState] = useState<Favorite[]>([]);

  useEffect(() => {
    getFavorites().then(setFavoritesState);
  }, []);

  const isFavorite = useCallback(
    (suraNumber: number, ayahNumber?: number) => {
      return favorites.some(
        (f) =>
          (f.type === "ayah" && f.ayahNumber === ayahNumber && f.suraNumber === suraNumber) ||
          (f.type === "sura" && f.suraNumber === suraNumber && ayahNumber == null)
      );
    },
    [favorites]
  );

  const addFavorite = useCallback(
    async (suraNumber: number, ayahNumber?: number, globalAyahNumber?: number) => {
      const next: Favorite = {
        type: ayahNumber != null ? "ayah" : "sura",
        suraNumber,
        ayahNumber,
        globalAyahNumber,
        addedAt: Date.now(),
      };
      const nextList = [...favorites.filter((f) => !(f.suraNumber === suraNumber && f.ayahNumber === ayahNumber)), next];
      await setFavorites(nextList);
      setFavoritesState(nextList);
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (suraNumber: number, ayahNumber?: number) => {
      const nextList = favorites.filter(
        (f) => !(f.suraNumber === suraNumber && (ayahNumber == null ? f.type === "sura" : f.ayahNumber === ayahNumber))
      );
      await setFavorites(nextList);
      setFavoritesState(nextList);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (suraNumber: number, ayahNumber?: number, globalAyahNumber?: number) => {
      const isFav = isFavorite(suraNumber, ayahNumber);
      if (isFav) await removeFavorite(suraNumber, ayahNumber);
      else await addFavorite(suraNumber, ayahNumber, globalAyahNumber);
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
