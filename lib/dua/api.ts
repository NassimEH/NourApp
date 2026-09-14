/**
 * Données invocations (duas & adhkar) — FR / EN / AR (catégories).
 */

import type { DuaCategory, DuaItem, DuaDetail } from "./types";
import type { DuaLanguage } from "./storage";
import {
  getLocalCategoriesFr,
  getLocalCategoryDuasFr,
  getLocalDuaDetailFr,
  getCategoryNameBySlugFr,
} from "./data/fr";
import {
  getLocalCategoriesEn,
  getLocalCategoryDuasEn,
  getLocalDuaDetailEn,
  getCategoryNameBySlugEn,
} from "./data/en";
import {
  getLocalCategoriesAr,
  getLocalCategoryDuasAr,
  getLocalDuaDetailAr,
  getCategoryNameBySlugAr,
} from "./data/ar";

export function getCategoryNameForDisplay(
  cat: DuaCategory,
  lang: DuaLanguage
): string {
  const fromLang =
    lang === "en"
      ? getCategoryNameBySlugEn(cat.slug)
      : lang === "ar"
        ? getCategoryNameBySlugAr(cat.slug)
        : getCategoryNameBySlugFr(cat.slug);
  return fromLang ?? cat.name ?? cat.slug;
}

export function getCategoryDisplayNameBySlug(
  slug: string,
  lang: DuaLanguage
): string {
  const name =
    lang === "en"
      ? getCategoryNameBySlugEn(slug)
      : lang === "ar"
        ? getCategoryNameBySlugAr(slug)
        : getCategoryNameBySlugFr(slug);
  return name ?? slug;
}

export async function fetchCategories(lang: DuaLanguage): Promise<DuaCategory[]> {
  if (lang === "en") return getLocalCategoriesEn();
  if (lang === "ar") return getLocalCategoriesAr();
  return getLocalCategoriesFr();
}

export async function fetchCategoryDuas(
  slug: string,
  lang: DuaLanguage
): Promise<DuaItem[]> {
  if (lang === "en") return getLocalCategoryDuasEn(slug);
  if (lang === "ar") return getLocalCategoryDuasAr(slug);
  return getLocalCategoryDuasFr(slug);
}

export async function fetchDuaDetail(
  slug: string,
  id: number,
  lang: DuaLanguage
): Promise<DuaDetail | null> {
  if (lang === "en") return getLocalDuaDetailEn(slug, id);
  if (lang === "ar") return getLocalDuaDetailAr(slug, id);
  return getLocalDuaDetailFr(slug, id);
}
