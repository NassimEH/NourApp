import { useState, useEffect, useCallback } from "react";
import { getDuaFavorites, setDuaFavorites, getDuaFavoriteKey } from "../storage";
import type { DuaFavorite, DuaDetail } from "../types";

export function useDuaFavorites(): {
  favorites: DuaFavorite[];
  loading: boolean;
  isFavorite: (categorySlug: string, duaId: number) => boolean;
  addFavorite: (item: DuaDetail | DuaFavorite) => Promise<void>;
  removeFavorite: (categorySlug: string, duaId: number) => Promise<void>;
  toggleFavorite: (item: DuaDetail | DuaFavorite) => Promise<void>;
  refetch: () => Promise<void>;
} {
  const [favorites, setFavoritesState] = useState<DuaFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const list = await getDuaFavorites();
    setFavoritesState(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const isFavorite = useCallback(
    (categorySlug: string, duaId: number) => {
      return favorites.some(
        (f) => f.categorySlug === categorySlug && f.duaId === duaId
      );
    },
    [favorites]
  );

  const addFavorite = useCallback(
    async (item: DuaDetail | DuaFavorite) => {
      const duaId = "duaId" in item ? item.duaId : (item as DuaDetail).id;
      const entry: DuaFavorite = {
        categorySlug: item.categorySlug,
        duaId,
        title: item.title,
        arabic: "arabic" in item ? item.arabic : undefined,
        translation: "translation" in item ? item.translation : undefined,
        addedAt: Date.now(),
      };
      const next = [...favorites.filter((f) => getDuaFavoriteKey(f.categorySlug, f.duaId) !== getDuaFavoriteKey(entry.categorySlug, entry.duaId)), entry];
      setFavoritesState(next);
      await setDuaFavorites(next);
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (categorySlug: string, duaId: number) => {
      const key = getDuaFavoriteKey(categorySlug, duaId);
      const next = favorites.filter((f) => getDuaFavoriteKey(f.categorySlug, f.duaId) !== key);
      setFavoritesState(next);
      await setDuaFavorites(next);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (item: DuaDetail | DuaFavorite) => {
      const slug = item.categorySlug;
      const id = item.duaId;
      if (isFavorite(slug, id)) await removeFavorite(slug, id);
      else await addFavorite(item);
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
