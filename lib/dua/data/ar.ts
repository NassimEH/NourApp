/**
 * Catégories d'invocations en arabe (même slugs que FR/EN).
 * Corps des duas : réutilise les données FR (traduction) + champ arabic déjà présent.
 */

import type { DuaCategory, DuaDetail } from "../types";
import {
  getLocalCategoryDuasFr,
  getLocalDuaDetailFr,
} from "./fr";

export const LOCAL_CATEGORIES_AR: DuaCategory[] = [
  { id: "invocations-du-matin", name: "أذكار الصباح", slug: "invocations-du-matin" },
  { id: "invocations-du-soir", name: "أذكار المساء", slug: "invocations-du-soir" },
  { id: "doua-apres-priere", name: "دعاء بعد الصلاة", slug: "doua-apres-priere" },
  { id: "doua-avant-manger", name: "دعاء قبل الطعام", slug: "doua-avant-manger" },
  { id: "doua-avant-dormir", name: "دعاء قبل النوم", slug: "doua-avant-dormir" },
  { id: "invocations-voyage", name: "دعاء السفر", slug: "invocations-voyage" },
  { id: "doua-apres-adhan", name: "دعاء بعد الأذان", slug: "doua-apres-adhan" },
  { id: "doua-protection", name: "أدعية الحماية", slug: "doua-protection" },
  { id: "doua-tristesse", name: "دعاء الهم والحزن", slug: "doua-tristesse" },
  { id: "doua-mosquee", name: "أدعية المسجد", slug: "doua-mosquee" },
  { id: "doua-quotidien", name: "أدعية يومية", slug: "doua-quotidien" },
];

export function getLocalCategoriesAr(): DuaCategory[] {
  return LOCAL_CATEGORIES_AR.map((c) => ({
    ...c,
    total: getLocalCategoryDuasFr(c.slug).length,
  }));
}

export function getCategoryNameBySlugAr(slug: string): string | undefined {
  return LOCAL_CATEGORIES_AR.find((c) => c.slug === slug)?.name;
}

export function getLocalCategoryDuasAr(slug: string) {
  return getLocalCategoryDuasFr(slug);
}

export function getLocalDuaDetailAr(
  slug: string,
  id: number
): DuaDetail | null {
  const detail = getLocalDuaDetailFr(slug, id);
  if (!detail) return null;
  const category = LOCAL_CATEGORIES_AR.find((c) => c.slug === slug);
  return {
    ...detail,
    categoryName: category?.name ?? detail.categoryName,
  };
}
