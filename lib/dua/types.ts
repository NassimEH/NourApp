/**
 * Types pour le module Invocations (Duas / Adhkar).
 * Alignés sur l'API Dua-Dhikr (dua-dhikr.vercel.app).
 */

export interface DuaCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  total?: number;
}

export interface DuaItem {
  id: number;
  title: string;
  arabic?: string;
  latin?: string;
  translation?: string;
  notes?: string;
  fawaid?: string;
  source?: string;
}

export interface DuaDetail extends DuaItem {
  categorySlug: string;
  categoryName?: string;
}

/** Clé unique pour un favori (catégorie + id) */
export interface DuaFavoriteKey {
  categorySlug: string;
  duaId: number;
}

export interface DuaFavorite extends DuaFavoriteKey {
  title: string;
  arabic?: string;
  translation?: string;
  addedAt: number;
}
