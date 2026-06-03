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
  | "invocations-matin-soir"
  | "invocations-sommeil"
  | "hadiths"
  | "hadith-jour"
  | "hadiths-theme";

export type LibraryCatalogItem = {
  id: LibraryRoute;
  titleKey: string;
  shortKey: string;
  icon: AppIconName;
  soon?: boolean;
  disabled?: boolean;
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
        soon: true,
        disabled: true,
      },
      {
        id: "invocations-matin-soir",
        titleKey: "library.invocationsMorning",
        shortKey: "library.invocationsMorningShort",
        icon: "sun",
        soon: true,
        disabled: true,
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
        soon: true,
        disabled: true,
      },
      {
        id: "hadiths-theme",
        titleKey: "library.hadithThemes",
        shortKey: "library.hadithThemesShort",
        icon: "bookmark",
        soon: true,
        disabled: true,
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

