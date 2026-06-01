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

/** Écart vertical entre sections d'un écran */
export const SECTION_GAP = SPACE.xl;

/** Sous le titre de section, avant le contenu */
export const SECTION_TITLE_GAP = SPACE.sm;

/** Entre cartes / lignes dans une liste */
export const LIST_GAP = 10;

/** Cible accessibilité — zone tactile minimale */
export const MIN_TOUCH_TARGET = 44;
