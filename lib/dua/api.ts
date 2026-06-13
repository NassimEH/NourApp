/**
 * Données invocations (duas & adhkar) — français uniquement (données locales).
 */

import type { DuaCategory, DuaItem, DuaDetail } from "./types";
import type { DuaLanguage } from "./storage";
import {
  getLocalCategoriesFr,
  getLocalCategoryDuasFr,
  getLocalDuaDetailFr,
  getCategoryNameBySlugFr,
} from "./data/fr";

export function getCategoryNameForDisplay(cat: DuaCategory, _lang: DuaLanguage): string {
  return getCategoryNameBySlugFr(cat.slug) ?? cat.name ?? cat.slug;
}

/** Nom d'affichage d'une catégorie par slug (pour l'écran liste d'invocations). */
export function getCategoryDisplayNameBySlug(slug: string, _lang: DuaLanguage): string {
  return getCategoryNameBySlugFr(slug) ?? slug;
}

export async function fetchCategories(_lang: DuaLanguage): Promise<DuaCategory[]> {
  return getLocalCategoriesFr();
}

export async function fetchCategoryDuas(slug: string, _lang: DuaLanguage): Promise<DuaItem[]> {
  return getLocalCategoryDuasFr(slug);
}

export async function fetchDuaDetail(
  slug: string,
  id: number,
  _lang: DuaLanguage
): Promise<DuaDetail | null> {
  return getLocalDuaDetailFr(slug, id);
}
