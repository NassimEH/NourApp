/**
 * Hadiths sur la prière du vendredi — liste issue de
 * https://hadith.sunnahsteps.com/fr/koleya/hadiths/la-prière-du-vendredi-153/fiqh_w_aitibae
 * Un hadith différent est affiché chaque vendredi sur l'accueil (rotation par semaine).
 */

export interface HadithVendrediItem {
  text: string;
  source: string;
}

export const HADITHS_PRIERE_VENDREDI: HadithVendrediItem[] = [
  {
    text: "« Que des gens cessent de délaisser les prières du vendredi, ou bien Allah scellera assurément leurs cœurs, puis ils feront certes partie des distraits. »",
    source: "Rapporté par Ibn 'Omar et Abou Hourayra — Al-Boukhari et Mouslim",
  },
  {
    text: "« Celui qui délaisse trois prières du vendredi par négligence, Allah scellera son cœur. »",
    source: "Abou Dawoud (1052), At-Tirmidhi (500), An-Nassa'i, Ibn Maja",
  },
  {
    text: "« Tout homme pubère doit se rendre à la prière du vendredi et chacun se rendant à la prière du vendredi doit se laver. »",
    source: "Abou Dawoud (342) et An-Nassa'i (1371)",
  },
  {
    text: "« Quiconque, le vendredi, effectue le bain rituel prescrit, puis se rend à la prière à la première heure, est tel celui qui fait l'aumône d'une chamelle. Quiconque s'y rend à la deuxième heure sera tel celui qui fait l'aumône d'une vache… Puis lorsque l'imam sort, les anges viennent écouter l'évocation d'Allah. »",
    source: "Al-Boukhari (881) et Mouslim (850)",
  },
  {
    text: "« Le meilleur jour sur lequel le soleil se lève est le vendredi. C'est un vendredi qu'Adam fut créé, qu'on le fit entrer au Paradis et qu'on l'en fit sortir. »",
    source: "Mouslim (854)",
  },
];

/** Retourne le numéro de semaine ISO (1–53) pour l'année. */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Lundi = 1, Dimanche = 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/** Hadith du vendredi pour la semaine courante (un différent chaque vendredi). */
export function getHadithVendrediDuJour(): HadithVendrediItem | null {
  const now = new Date();
  if (now.getDay() !== 5) return null; // 5 = vendredi
  const week = getWeekNumber(now);
  const index = week % HADITHS_PRIERE_VENDREDI.length;
  return HADITHS_PRIERE_VENDREDI[index];
}

export function isVendredi(): boolean {
  return new Date().getDay() === 5;
}
