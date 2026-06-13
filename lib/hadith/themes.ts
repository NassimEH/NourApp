import type { AppIconName } from "@/components/AppIcon";

export type HadithThemeId =
  | "faith"
  | "prayer"
  | "character"
  | "knowledge"
  | "family"
  | "charity";

export type HadithThemeRef = {
  collection: string;
  hadithNumber: string;
  /** Aperçu court en français */
  previewFr: string;
};

export type HadithTheme = {
  id: HadithThemeId;
  titleKey: string;
  subtitleKey: string;
  icon: AppIconName;
  refs: HadithThemeRef[];
};

export const HADITH_THEMES: HadithTheme[] = [
  {
    id: "faith",
    titleKey: "screens.hadithThemeFaith",
    subtitleKey: "screens.hadithThemeFaithShort",
    icon: "heart",
    refs: [
      {
        collection: "bukhari",
        hadithNumber: "1",
        previewFr:
          "« Les actes ne valent que par les intentions, et chaque homme n'a que ce qu'il a eu l'intention de faire. »",
      },
      {
        collection: "muslim",
        hadithNumber: "35",
        previewFr:
          "« La foi comporte plus de soixante-dix branches. Le plus élevé est l'attestation qu'il n'y a de divinité qu'Allah. »",
      },
      {
        collection: "muslim",
        hadithNumber: "45",
        previewFr:
          "« Aucun de vous ne croit vraiment tant qu'il n'aime pour son frère ce qu'il aime pour lui-même. »",
      },
      {
        collection: "muslim",
        hadithNumber: "47",
        previewFr:
          "« Celui qui croit en Allah et au Jour dernier, qu'il dise du bien ou qu'il se taise. »",
      },
    ],
  },
  {
    id: "prayer",
    titleKey: "screens.hadithThemePrayer",
    subtitleKey: "screens.hadithThemePrayerShort",
    icon: "sun",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "82",
        previewFr:
          "« La prière est la colonne de la religion. Quiconque l'élève a établi la religion, et quiconque la détruit a détruit la religion. »",
      },
      {
        collection: "bukhari",
        hadithNumber: "528",
        previewFr:
          "« La prière est la première chose pour laquelle le serviteur sera interrogé le Jour de la Résurrection. »",
      },
      {
        collection: "abudawud",
        hadithNumber: "425",
        previewFr:
          "« La prière en congrégation vaut vingt-cinq degrés de plus que la prière à la maison ou au marché. »",
      },
      {
        collection: "tirmidhi",
        hadithNumber: "170",
        previewFr:
          "« Celui qui prie le Fajr est sous la protection d'Allah. »",
      },
    ],
  },
  {
    id: "character",
    titleKey: "screens.hadithThemeCharacter",
    subtitleKey: "screens.hadithThemeCharacterShort",
    icon: "shield",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "41",
        previewFr:
          "« Le musulman est celui dont les musulmans sont à l'abri de sa langue et de sa main. »",
      },
      {
        collection: "muslim",
        hadithNumber: "2594",
        previewFr:
          "« La douceur n'est jamais présente dans une chose sans l'embellir, et n'est jamais absente d'une chose sans l'enlaidir. »",
      },
      {
        collection: "bukhari",
        hadithNumber: "10",
        previewFr:
          "« La religion est la sincérité. » Nous avons dit : « Envers qui ? » Il dit : « Envers Allah, Son Livre, Son Messager, les dirigeants des musulmans et leurs communautés. »",
      },
      {
        collection: "tirmidhi",
        hadithNumber: "1980",
        previewFr:
          "« Les croyants les plus parfaits dans leur foi sont ceux qui ont le meilleur caractère. »",
      },
    ],
  },
  {
    id: "knowledge",
    titleKey: "screens.hadithThemeKnowledge",
    subtitleKey: "screens.hadithThemeKnowledgeShort",
    icon: "book-open",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "2699",
        previewFr:
          "« Quiconque emprunte un chemin à la recherche de la science, Allah lui facilitera un chemin vers le Paradis. »",
      },
      {
        collection: "bukhari",
        hadithNumber: "5027",
        previewFr:
          "« Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. »",
      },
      {
        collection: "ibnmajah",
        hadithNumber: "224",
        previewFr:
          "« La recherche du savoir est une obligation pour tout musulman. »",
      },
      {
        collection: "tirmidhi",
        hadithNumber: "2682",
        previewFr:
          "« L'ange déploie ses ailes pour le chercheur de science, content de ce qu'il fait. »",
      },
    ],
  },
  {
    id: "family",
    titleKey: "screens.hadithThemeFamily",
    subtitleKey: "screens.hadithThemeFamilyShort",
    icon: "users",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "45",
        previewFr:
          "« Aucun de vous ne croit vraiment tant qu'il n'aime pour son frère ce qu'il aime pour lui-même. »",
      },
      {
        collection: "tirmidhi",
        hadithNumber: "1162",
        previewFr:
          "« Le Paradis est aux pieds des mères. »",
      },
      {
        collection: "abudawud",
        hadithNumber: "5120",
        previewFr:
          "« Le meilleur d'entre vous est celui qui est le meilleur envers sa famille. »",
      },
      {
        collection: "bukhari",
        hadithNumber: "5971",
        previewFr:
          "« Celui qui n'est pas reconnaissant envers les gens n'est pas reconnaissant envers Allah. »",
      },
    ],
  },
  {
    id: "charity",
    titleKey: "screens.hadithThemeCharity",
    subtitleKey: "screens.hadithThemeCharityShort",
    icon: "gift",
    refs: [
      {
        collection: "muslim",
        hadithNumber: "2588",
        previewFr:
          "« L'aumône ne diminue pas la richesse. »",
      },
      {
        collection: "bukhari",
        hadithNumber: "1416",
        previewFr:
          "« L'aumône est une preuve. »",
      },
      {
        collection: "tirmidhi",
        hadithNumber: "664",
        previewFr:
          "« Protégez-vous du Feu ne serait-ce qu'avec une demi-datte en aumône. »",
      },
      {
        collection: "muslim",
        hadithNumber: "1009",
        previewFr:
          "« Chaque joint de la personne doit faire une aumône chaque jour. »",
      },
    ],
  },
];

export function getHadithThemes(): HadithTheme[] {
  return HADITH_THEMES;
}

export function getHadithThemeById(id: string): HadithTheme | undefined {
  return HADITH_THEMES.find((theme) => theme.id === id);
}
