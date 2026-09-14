/**
 * Hadiths sur la prière du vendredi — textes FR / EN / AR manuels.
 * Un hadith différent chaque vendredi (rotation par semaine ISO).
 */

import type { LanguageLocale } from "@/lib/app-preferences";
import { getHadithLocalizedText } from "./hadithsJour";

export interface HadithVendrediItem {
  fr: string;
  en: string;
  ar: string;
  source: string;
}

export { getHadithLocalizedText };

export const HADITHS_PRIERE_VENDREDI: HadithVendrediItem[] = [
  {
    fr: "« Que des gens cessent de délaisser les prières du vendredi, ou bien Allah scellera assurément leurs cœurs, puis ils feront certes partie des distraits. »",
    en: "« People must stop neglecting the Friday prayers, or else Allah will seal their hearts and they will be among the heedless. »",
    ar: "« لينتهين أقوام عن ودعهم الجمعات، أو ليختمن الله على قلوبهم، ثم ليكونن من الغافلين. »",
    source: "Rapporté par Ibn 'Omar et Abou Hourayra — Al-Boukhari et Mouslim",
  },
  {
    fr: "« Celui qui délaisse trois prières du vendredi par négligence, Allah scellera son cœur. »",
    en: "« Whoever neglects three Friday prayers out of carelessness, Allah will seal his heart. »",
    ar: "« من ترك ثلاث جمع تهاونا طبع الله على قلبه. »",
    source: "Abou Dawoud (1052), At-Tirmidhi (500), An-Nassa'i, Ibn Maja",
  },
  {
    fr: "« Tout homme pubère doit se rendre à la prière du vendredi et chacun se rendant à la prière du vendredi doit se laver. »",
    en: "« Friday prayer is obligatory upon every adult, and whoever comes to Friday prayer should perform ghusl. »",
    ar: "« الجمعة حق واجب على كل محتلم، والغسل يوم الجمعة واجب على كل محتلم. »",
    source: "Abou Dawoud (342) et An-Nassa'i (1371)",
  },
  {
    fr: "« Quiconque, le vendredi, effectue le bain rituel prescrit, puis se rend à la prière à la première heure, est tel celui qui fait l'aumône d'une chamelle. Quiconque s'y rend à la deuxième heure sera tel celui qui fait l'aumône d'une vache… Puis lorsque l'imam sort, les anges viennent écouter l'évocation d'Allah. »",
    en: "« Whoever performs the ritual bath on Friday then goes early to the prayer is like one who offers a camel… When the imam comes out, the angels come to listen to the remembrance of Allah. »",
    ar: "« من اغتسل يوم الجمعة ثم راح فكأنما قرب بدنة… فإذا خرج الإمام حضرت الملائكة يستمعون الذكر. »",
    source: "Al-Boukhari (881) et Mouslim (850)",
  },
  {
    fr: "« Le meilleur jour sur lequel le soleil se lève est le vendredi. C'est un vendredi qu'Adam fut créé, qu'on le fit entrer au Paradis et qu'on l'en fit sortir. »",
    en: "« The best day on which the sun rises is Friday. On it Adam was created, admitted to Paradise, and expelled from it. »",
    ar: "« خير يوم طلعت عليه الشمس يوم الجمعة، فيه خلق آدم، وفيه أدخل الجنة، وفيه أخرج منها. »",
    source: "Mouslim (854)",
  },
];

/** Retourne le numéro de semaine ISO (1–53) pour l'année. */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/** Hadith du vendredi pour la semaine courante (un différent chaque vendredi). */
export function getHadithVendrediDuJour(): HadithVendrediItem | null {
  const now = new Date();
  if (now.getDay() !== 5) return null;
  const week = getWeekNumber(now);
  const index = week % HADITHS_PRIERE_VENDREDI.length;
  return HADITHS_PRIERE_VENDREDI[index];
}

export function isVendredi(): boolean {
  return new Date().getDay() === 5;
}

export function getHadithVendrediText(
  item: HadithVendrediItem,
  locale: LanguageLocale
): string {
  return getHadithLocalizedText(item, locale);
}
