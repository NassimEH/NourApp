/** Grille d'espacement (multiples de 4) — à utiliser à la place des valeurs magiques */
export const SPACE = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

/** Rayon des cartes et lignes de liste */
export const CARD_RADIUS = 16;

/** Chips / filtres compacts */
export const CHIP_RADIUS = 12;

/** Surfaces glass (tab bar, mini-player) */
export const GLASS_RADIUS = 20;

/** Pills pleine largeur (tab bar liquid) */
export const PILL_RADIUS = 32;

/** Ombres légères (light / dark) */
export const SHADOW = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  dark: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

/** Écart vertical entre sections d'un écran */
export const SECTION_GAP = SPACE.xl;

/** Sous le titre de section, avant le contenu */
export const SECTION_TITLE_GAP = SPACE.sm;

/** Entre cartes / lignes dans une liste */
export const LIST_GAP = 10;

/** Cible accessibilité — zone tactile minimale */
export const MIN_TOUCH_TARGET = 44;
