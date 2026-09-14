/**
 * Hadiths pour la rotation quotidienne (écran Hadith du jour).
 * Textes FR / EN / AR manuels — un hadith différent chaque jour.
 */

import type { LanguageLocale } from "@/lib/app-preferences";

export interface HadithJourItem {
  fr: string;
  en: string;
  ar: string;
  source: string;
  /** Réf. collection API pour favori / navigation (optionnel) */
  collection?: string;
  hadithNumber?: string;
}

export function getHadithLocalizedText(
  item: Pick<HadithJourItem, "fr" | "en" | "ar">,
  locale: LanguageLocale
): string {
  if (locale === "en") return item.en;
  if (locale === "ar") return item.ar;
  return item.fr;
}

export const HADITHS_DU_JOUR: HadithJourItem[] = [
  {
    fr: "« Les actes ne valent que par les intentions, et chaque homme n'a que ce qu'il a eu l'intention de faire. »",
    en: "« Actions are but by intention, and every man shall have only that which he intended. »",
    ar: "« إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى. »",
    source: "Al-Boukhari (1) et Mouslim (1907)",
    collection: "bukhari",
    hadithNumber: "1",
  },
  {
    fr: "« La foi comporte plus de soixante-dix branches. Le plus élevé est l'attestation qu'il n'y a de divinité qu'Allah, et le moindre est d'ôter un obstacle du chemin. »",
    en: "« Faith has over seventy branches. The most excellent is the declaration that there is no god but Allah, and the least is removing a harmful object from the road. »",
    ar: "« الإيمان بضع وسبعون شعبة، أعلاها قول لا إله إلا الله، وأدناها إماطة الأذى عن الطريق. »",
    source: "Mouslim (35)",
    collection: "muslim",
    hadithNumber: "35",
  },
  {
    fr: "« Celui qui croit en Allah et au Jour dernier, qu'il dise du bien ou qu'il se taise. »",
    en: "« Whoever believes in Allah and the Last Day should speak good or remain silent. »",
    ar: "« من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت. »",
    source: "Al-Boukhari (6018) et Mouslim (47)",
    collection: "muslim",
    hadithNumber: "47",
  },
  {
    fr: "« Le musulman est celui dont les musulmans sont à l'abri de sa langue et de sa main. »",
    en: "« The Muslim is the one from whose tongue and hand the Muslims are safe. »",
    ar: "« المسلم من سلم المسلمون من لسانه ويده. »",
    source: "Al-Boukhari (10) et Mouslim (41)",
    collection: "bukhari",
    hadithNumber: "10",
  },
  {
    fr: "« Aucun de vous ne croit vraiment tant qu'il n'aime pour son frère ce qu'il aime pour lui-même. »",
    en: "« None of you truly believes until he loves for his brother what he loves for himself. »",
    ar: "« لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه. »",
    source: "Al-Boukhari (13) et Mouslim (45)",
    collection: "muslim",
    hadithNumber: "45",
  },
  {
    fr: "« La douceur n'est jamais présente dans une chose sans l'embellir, et n'est jamais absente d'une chose sans l'enlaidir. »",
    en: "« Gentleness is not found in anything except that it beautifies it, and it is not removed from anything except that it disfigures it. »",
    ar: "« إن الرفق لا يكون في شيء إلا زانه، ولا ينزع من شيء إلا شانه. »",
    source: "Mouslim (2594)",
    collection: "muslim",
    hadithNumber: "2594",
  },
  {
    fr: "« Le Paradis est entouré de choses désagréables, et l'Enfer est entouré de convoitises. »",
    en: "« Paradise is surrounded by hardships, and Hellfire is surrounded by desires. »",
    ar: "« حفت الجنة بالمكاره، وحفت النار بالشهوات. »",
    source: "Mouslim (2822)",
    collection: "muslim",
    hadithNumber: "2822",
  },
  {
    fr: "« Quiconque emprunte un chemin à la recherche de la science, Allah lui facilitera un chemin vers le Paradis. »",
    en: "« Whoever follows a path in search of knowledge, Allah will make easy for him a path to Paradise. »",
    ar: "« من سلك طريقا يلتمس فيه علما، سهل الله له به طريقا إلى الجنة. »",
    source: "Mouslim (2699)",
    collection: "muslim",
    hadithNumber: "2699",
  },
  {
    fr: "« Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. »",
    en: "« The best among you are those who learn the Qur'an and teach it. »",
    ar: "« خيركم من تعلم القرآن وعلمه. »",
    source: "Al-Boukhari (5027)",
    collection: "bukhari",
    hadithNumber: "5027",
  },
  {
    fr: "« Celui qui ne remercie pas les gens ne remercie pas Allah. »",
    en: "« He who does not thank people does not thank Allah. »",
    ar: "« من لا يشكر الناس لا يشكر الله. »",
    source: "At-Tirmidhi (1954)",
    collection: "tirmidhi",
    hadithNumber: "1954",
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
