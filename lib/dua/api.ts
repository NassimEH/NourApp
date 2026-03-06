/**
 * Client API Dua-Dhikr (duas & adhkar).
 * Base: https://dua-dhikr.vercel.app
 * Fallback: https://dua-dhikr.onrender.com
 */

import type { DuaCategory, DuaItem, DuaDetail } from "./types";
import type { DuaLanguage } from "./storage";
import {
  getLocalCategoriesFr,
  getLocalCategoryDuasFr,
  getLocalDuaDetailFr,
  getCategoryNameBySlugFr,
} from "./data/fr";

const BASE_URLS = [
  "https://dua-dhikr.vercel.app",
  "https://dua-dhikr.onrender.com",
];

function apiLang(_lang: DuaLanguage): string {
  return "en";
} // API: id, en (fr non disponible pour l'instant)

/** Catégories statiques si l’API est indisponible ou renvoie 400 (langue non supportée) */
const FALLBACK_CATEGORIES_EN: DuaCategory[] = [
  { id: "morning-dhikr", name: "Morning Dhikr", slug: "morning-dhikr" },
  { id: "evening-dhikr", name: "Evening Dhikr", slug: "evening-dhikr" },
  { id: "daily-dua", name: "Daily Dua", slug: "daily-dua" },
  { id: "selected-dua", name: "Selected Dua", slug: "selected-dua" },
  { id: "dhikr-after-salah", name: "Dhikr After Salah", slug: "dhikr-after-salah" },
];
const SLUG_TO_NAME_FR: Record<string, string> = {};

async function fetchWithLang<T>(path: string, lang: DuaLanguage): Promise<T> {
  const acceptLang = apiLang(lang);
  const url = `${BASE_URLS[0]}${path}`;
  const res = await fetch(url, { headers: { "Accept-Language": acceptLang } });
  if (!res.ok) {
    const fallbackUrl = `${BASE_URLS[1]}${path}`;
    const res2 = await fetch(fallbackUrl, { headers: { "Accept-Language": acceptLang } });
    if (!res2.ok) throw new Error(`API ${res2.status}: ${path}`);
    return res2.json() as Promise<T>;
  }
  return res.json() as Promise<T>;
}

export function getCategoryNameForDisplay(cat: DuaCategory, lang: DuaLanguage): string {
  if (lang === "fr") {
    const localName = getCategoryNameBySlugFr(cat.slug);
    if (localName) return localName;
  }
  if (SLUG_TO_NAME_FR[cat.slug]) return SLUG_TO_NAME_FR[cat.slug];
  return cat.name;
}

/** Nom d'affichage d'une catégorie par slug (pour l'écran liste d'invocations). */
export function getCategoryDisplayNameBySlug(slug: string, lang: DuaLanguage): string {
  if (lang === "fr") {
    const name = getCategoryNameBySlugFr(slug);
    if (name) return name;
  }
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface ApiResponse<T> {
  statusCode?: number;
  code?: string;
  data: T;
}

/** Réponse /categories : tableau ou objet avec data */
interface CategoriesResponse {
  data?: Array<{ id?: string; name: string; slug: string; description?: string; total?: number }>;
}

/** Réponse /categories/:slug : tableau de duas */
interface CategoryDuasResponse {
  data?: Array<{
    id: number;
    title: string;
    arabic?: string;
    latin?: string;
    translation?: string;
    notes?: string;
    fawaid?: string;
    source?: string;
  }>;
}

/** Réponse /categories/:slug/:id : un dua */
interface DuaDetailResponse {
  data?: {
    id: number;
    title: string;
    arabic?: string;
    latin?: string;
    translation?: string;
    notes?: string;
    fawaid?: string;
    source?: string;
  };
}

export async function fetchCategories(lang: DuaLanguage): Promise<DuaCategory[]> {
  if (lang === "fr") {
    return getLocalCategoriesFr();
  }
  const fallback = FALLBACK_CATEGORIES_EN;
  try {
    const res = await fetchWithLang<ApiResponse<DuaCategory[]> | CategoriesResponse>(
      "/categories",
      lang
    );
    const data = "data" in res ? res.data : (res as ApiResponse<DuaCategory[]>).data;
    if (!Array.isArray(data)) return fallback;
    return data.map((c) => ({
      id: (c as DuaCategory).id ?? (c as { slug: string }).slug,
      name: (c as DuaCategory).name ?? (c as { name: string }).name,
      slug: (c as DuaCategory).slug ?? (c as { slug: string }).slug,
      description: (c as DuaCategory).description,
      total: (c as DuaCategory).total,
    }));
  } catch {
    return fallback;
  }
}

export async function fetchCategoryDuas(slug: string, lang: DuaLanguage): Promise<DuaItem[]> {
  if (lang === "fr") {
    return getLocalCategoryDuasFr(slug);
  }
  const res = await fetchWithLang<ApiResponse<DuaItem[]> | CategoryDuasResponse>(
    `/categories/${encodeURIComponent(slug)}`,
    lang
  );
  const data = "data" in res ? res.data : (res as ApiResponse<DuaItem[]>).data;
  if (!Array.isArray(data)) return [];
  return data.map((d) => ({
    id: d.id,
    title: d.title,
    arabic: d.arabic,
    latin: d.latin,
    translation: d.translation,
    notes: d.notes,
    fawaid: d.fawaid,
    source: d.source,
  }));
}

export async function fetchDuaDetail(
  slug: string,
  id: number,
  lang: DuaLanguage
): Promise<DuaDetail | null> {
  if (lang === "fr") {
    return getLocalDuaDetailFr(slug, id);
  }
  const res = await fetchWithLang<DuaDetailResponse>(
    `/categories/${encodeURIComponent(slug)}/${id}`,
    lang
  );
  const data = res.data;
  if (!data) return null;
  return {
    ...data,
    categorySlug: slug,
  };
}
