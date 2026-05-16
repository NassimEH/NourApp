import { useMemo } from "react";

import { useAppPreferences, type TextSizeMode } from "@/lib/app-preferences";

export interface AppTypography {
  body: number;
  bodyMedium: number;
  subtitle: number;
  caption: number;
  sectionTitle: number;
  title: number;
  pageTitle: number;
  arabic: number;
  translation: number;
  lineHeightBody: number;
  lineHeightArabic: number;
}

export const APP_TYPOGRAPHY: Record<TextSizeMode, AppTypography> = {
  small: {
    body: 14,
    bodyMedium: 15,
    subtitle: 13,
    caption: 11,
    sectionTitle: 12,
    title: 18,
    pageTitle: 24,
    arabic: 22,
    translation: 13,
    lineHeightBody: 1.45,
    lineHeightArabic: 1.65,
  },
  medium: {
    body: 16,
    bodyMedium: 17,
    subtitle: 15,
    caption: 13,
    sectionTitle: 13,
    title: 20,
    pageTitle: 28,
    arabic: 28,
    translation: 16,
    lineHeightBody: 1.5,
    lineHeightArabic: 1.7,
  },
  large: {
    body: 19,
    bodyMedium: 20,
    subtitle: 17,
    caption: 15,
    sectionTitle: 14,
    title: 24,
    pageTitle: 32,
    arabic: 34,
    translation: 19,
    lineHeightBody: 1.55,
    lineHeightArabic: 1.75,
  },
};

export type TypographyVariant = keyof Pick<
  AppTypography,
  | "body"
  | "bodyMedium"
  | "subtitle"
  | "caption"
  | "sectionTitle"
  | "title"
  | "pageTitle"
  | "arabic"
  | "translation"
>;

export function useAppTypography(): AppTypography {
  const { textSize } = useAppPreferences();
  return useMemo(() => APP_TYPOGRAPHY[textSize], [textSize]);
}

/** Met à l'échelle une taille de référence (medium) selon la préférence. */
export function scaleFontSize(
  baseAtMedium: number,
  textSize: TextSizeMode
): number {
  const medium = APP_TYPOGRAPHY.medium.body;
  const current = APP_TYPOGRAPHY[textSize].body;
  return Math.round(baseAtMedium * (current / medium));
}
