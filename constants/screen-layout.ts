import type { ViewStyle } from "react-native";

import {
  CARD_RADIUS,
  LIST_GAP,
  SECTION_GAP,
  SECTION_TITLE_GAP,
  SPACE,
} from "@/lib/ui/spacing";

export {
  CARD_RADIUS,
  LIST_GAP,
  SECTION_GAP,
  SECTION_TITLE_GAP,
  SPACE,
};

/** Marge horizontale unique : titres et contenu alignés sur le même axe */
export const SCREEN_EDGE_PADDING = 28;

/** En-tête hors ScrollView (défaut ScreenPageHeader + espacement vertical) */
export const screenPageHeaderSpacing: ViewStyle = {
  paddingTop: 8,
  paddingBottom: 4,
};

/** Contenu scrollable sous un en-tête frère */
export const screenScrollContent: ViewStyle = {
  paddingHorizontal: SCREEN_EDGE_PADDING,
  paddingBottom: 120,
};

/** En-tête à l'intérieur d'un ScrollView déjà paddé — annule le double décalage */
export const screenHeaderInsideScroll: ViewStyle = {
  paddingHorizontal: SCREEN_EDGE_PADDING,
  paddingTop: 8,
  paddingBottom: 4,
  marginHorizontal: -SCREEN_EDGE_PADDING,
  marginBottom: 8,
};
