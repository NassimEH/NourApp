/**
 * Hadiths pour la rotation quotidienne (écran Hadith du jour).
 * Un hadith différent chaque jour (index = jour de l'année % taille).
 */

export interface HadithJourItem {
  text: string;
  source: string;
}

export const HADITHS_DU_JOUR: HadithJourItem[] = [
  {
    text: "« Les actes ne valent que par les intentions, et chaque homme n'a que ce qu'il a eu l'intention de faire. »",
    source: "Al-Boukhari (1) et Mouslim (1907)",
  },
  {
    text: "« La foi comporte plus de soixante-dix branches. Le plus élevé est l'attestation qu'il n'y a de divinité qu'Allah, et le moindre est d'ôter un obstacle du chemin. »",
    source: "Mouslim (35)",
  },
  {
    text: "« Celui qui croit en Allah et au Jour dernier, qu'il dise du bien ou qu'il se taise. »",
    source: "Al-Boukhari (6018) et Mouslim (47)",
  },
  {
    text: "« Le musulman est celui dont les musulmans sont à l'abri de sa langue et de sa main. »",
    source: "Al-Boukhari (10) et Mouslim (41)",
  },
  {
    text: "« Aucun de vous ne croit vraiment tant qu'il n'aime pour son frère ce qu'il aime pour lui-même. »",
    source: "Al-Boukhari (13) et Mouslim (45)",
  },
  {
    text: "« La douceur n'est jamais présente dans une chose sans l'embellir, et n'est jamais absente d'une chose sans l'enlaidir. »",
    source: "Mouslim (2594)",
  },
  {
    text: "« Le Paradis est entouré de choses désagréables, et l'Enfer est entouré de convoitises. »",
    source: "Mouslim (2822)",
  },
  {
    text: "« Quiconque emprunte un chemin à la recherche de la science, Allah lui facilitera un chemin vers le Paradis. »",
    source: "Mouslim (2699)",
  },
  {
    text: "« Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. »",
    source: "Al-Boukhari (5027)",
  },
  {
    text: "« Celui qui ne remercie pas les gens ne remercie pas Allah. »",
    source: "At-Tirmidhi (1954)",
  },
];

/** Jour de l'année (1–366). */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getHadithDuJour(date = new Date()): HadithJourItem {
  const index = getDayOfYear(date) % HADITHS_DU_JOUR.length;
  return HADITHS_DU_JOUR[index];
}
