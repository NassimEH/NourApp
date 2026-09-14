import type { SuraMeta } from "./types";

/** Filtre liste de sourates par numéro / nom (recherche v1). */
export function filterSurasByQuery(list: SuraMeta[], query: string): SuraMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const asNum = parseInt(q, 10);
  return list.filter((sura) => {
    if (!Number.isNaN(asNum) && sura.number === asNum) return true;
    return (
      sura.name.toLowerCase().includes(q) ||
      sura.englishName.toLowerCase().includes(q) ||
      sura.englishNameTranslation.toLowerCase().includes(q) ||
      String(sura.number).includes(q)
    );
  });
}
