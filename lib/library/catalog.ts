import type { AppIconName } from "@/components/AppIcon";

export type LibraryRoute =
  | "sourates"
  | "recherche"
  | "recitateurs"
  | "recitateur-detail"
  | "tafsir"
  | "traduction"
  | "memorisation"
  | "juz"
  | "player"
  | "invocations"
  | "invocations-meteo"
  | "invocations-morning"
  | "invocations-evening"
  | "invocations-sleep"
  | "invocations-after-prayer"
  | "invocations-protection"
  | "invocations-travel"
  | "invocations-before-meal"
  | "invocations-matin-soir"
  | "invocations-sommeil"
  | "hadiths"
  | "hadith-jour"
  | "hadith-bukhari"
  | "hadith-muslim"
  | "hadith-abudawud"
  | "hadith-tirmidhi"
  | "hadith-ibnmajah"
  | "hadiths-theme";

export type LibraryCatalogItem = {
  id: LibraryRoute;
  titleKey: string;
  shortKey: string;
  icon: AppIconName;
  soon?: boolean;
  disabled?: boolean;
  /** Navigation directe vers une catégorie d'invocations */
  invocationSlug?: string;
  /** Navigation directe vers un recueil de hadiths */
  hadithCollectionName?: string;
};

export type LibraryCatalogSection = {
  id: "quran" | "invocations" | "hadiths";
  titleKey: string;
  items: LibraryCatalogItem[];
};

export const LIBRARY_CARD_GAP = 16;
export const LIBRARY_CARD_HEIGHT = 188;
export const LIBRARY_ICON_SIZE = 56;
export const LIBRARY_SNAP_EXTRA = LIBRARY_CARD_GAP;

export const LIBRARY_CATALOG: LibraryCatalogSection[] = [
  {
    id: "quran",
    titleKey: "library.sectionQuran",
    items: [
      {
        id: "sourates",
        titleKey: "library.sourates",
        shortKey: "library.souratesShort",
        icon: "book-open",
      },
      {
        id: "recitateurs",
        titleKey: "library.reciters",
        shortKey: "library.recitersShort",
        icon: "mic",
      },
      {
        id: "recherche",
        titleKey: "screens.searchTitle",
        shortKey: "library.searchShort",
        icon: "search",
      },
      {
        id: "tafsir",
        titleKey: "screens.tafsirTitle",
        shortKey: "library.tafsirShort",
        icon: "book",
      },
      {
        id: "traduction",
        titleKey: "screens.translationTitle",
        shortKey: "library.translationShort",
        icon: "globe",
      },
      {
        id: "memorisation",
        titleKey: "screens.memorisationTitle",
        shortKey: "library.memorisationShort",
        icon: "bookmark",
      },
      {
        id: "juz",
        titleKey: "screens.juzTitle",
        shortKey: "library.juzShort",
        icon: "layers",
      },
    ],
  },
  {
    id: "invocations",
    titleKey: "library.sectionInvocations",
    items: [
      {
        id: "invocations",
        titleKey: "library.invocationsAll",
        shortKey: "library.invocationsAllShort",
        icon: "bookmark",
      },
      {
        id: "invocations-meteo",
        titleKey: "library.invocationsWeather",
        shortKey: "library.invocationsWeatherShort",
        icon: "cloud",
      },
      {
        id: "invocations-morning",
        titleKey: "screens.invocationsMorningCategory",
        shortKey: "library.invocationsMorningCardShort",
        icon: "sun",
        invocationSlug: "invocations-du-matin",
      },
      {
        id: "invocations-evening",
        titleKey: "screens.invocationsEveningCategory",
        shortKey: "library.invocationsEveningCardShort",
        icon: "moon",
        invocationSlug: "invocations-du-soir",
      },
      {
        id: "invocations-sleep",
        titleKey: "screens.invocationsSleepTitle",
        shortKey: "library.invocationsSleepShort",
        icon: "moon",
        invocationSlug: "doua-avant-dormir",
      },
      {
        id: "invocations-after-prayer",
        titleKey: "library.invocationsAfterPrayer",
        shortKey: "library.invocationsAfterPrayerShort",
        icon: "heart",
        invocationSlug: "doua-apres-priere",
      },
      {
        id: "invocations-protection",
        titleKey: "library.invocationsProtection",
        shortKey: "library.invocationsProtectionShort",
        icon: "shield",
        invocationSlug: "doua-protection",
      },
      {
        id: "invocations-travel",
        titleKey: "library.invocationsTravel",
        shortKey: "library.invocationsTravelShort",
        icon: "map-pin",
        invocationSlug: "invocations-voyage",
      },
      {
        id: "invocations-before-meal",
        titleKey: "library.invocationsBeforeMeal",
        shortKey: "library.invocationsBeforeMealShort",
        icon: "book-open",
        invocationSlug: "doua-avant-manger",
      },
    ],
  },
  {
    id: "hadiths",
    titleKey: "library.sectionHadiths",
    items: [
      {
        id: "hadiths",
        titleKey: "library.hadithAll",
        shortKey: "library.hadithAllShort",
        icon: "book-open",
      },
      {
        id: "hadith-jour",
        titleKey: "library.hadithDay",
        shortKey: "library.hadithDayShort",
        icon: "message-circle",
      },
      {
        id: "hadiths-theme",
        titleKey: "library.hadithThemes",
        shortKey: "library.hadithThemesShort",
        icon: "layers",
      },
      {
        id: "hadith-bukhari",
        titleKey: "library.hadithBukhari",
        shortKey: "library.hadithBukhariShort",
        icon: "book",
        hadithCollectionName: "bukhari",
      },
      {
        id: "hadith-muslim",
        titleKey: "library.hadithMuslim",
        shortKey: "library.hadithMuslimShort",
        icon: "book",
        hadithCollectionName: "muslim",
      },
      {
        id: "hadith-abudawud",
        titleKey: "library.hadithAbudawud",
        shortKey: "library.hadithAbudawudShort",
        icon: "book-open",
        hadithCollectionName: "abudawud",
      },
      {
        id: "hadith-tirmidhi",
        titleKey: "library.hadithTirmidhi",
        shortKey: "library.hadithTirmidhiShort",
        icon: "book-open",
        hadithCollectionName: "tirmidhi",
      },
      {
        id: "hadith-ibnmajah",
        titleKey: "library.hadithIbnMajah",
        shortKey: "library.hadithIbnMajahShort",
        icon: "book-open",
        hadithCollectionName: "ibnmajah",
      },
    ],
  },
];

/** Largeur carte : ~2 visibles + aperçu du suivant */
export function getLibraryCardWidth(
  screenWidth: number,
  horizontalPadding: number
): number {
  const inner = screenWidth - horizontalPadding * 2;
  const raw = (inner - LIBRARY_CARD_GAP * 2) / 2.12;
  return Math.round(Math.min(176, Math.max(152, raw)));
}

