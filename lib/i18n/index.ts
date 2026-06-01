import { useCallback, useMemo } from "react";
import type { TextStyle, ViewStyle } from "react-native";

import {
  useAppPreferences,
  type LanguageLocale,
  type ThemeMode,
  type IconStyleMode,
  type TextSizeMode,
  type AccentColorKey,
} from "@/lib/app-preferences";
import type { TabBarVariant } from "@/lib/tab-bar-preference";

import { TRANSLATIONS } from "./translations";

export { TRANSLATIONS };

type Path = string;

function resolvePath(tree: Record<string, unknown>, path: Path): string | undefined {
  const value = path.split(".").reduce<unknown>((node, segment) => {
    if (node && typeof node === "object" && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, tree);
  return typeof value === "string" ? value : undefined;
}

export function translate(
  locale: LanguageLocale,
  path: Path,
  params?: Record<string, string | number>
): string {
  let text =
    resolvePath(TRANSLATIONS[locale] as unknown as Record<string, unknown>, path) ??
    resolvePath(TRANSLATIONS.fr as unknown as Record<string, unknown>, path) ??
    path;

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      text = text.replace(`{{${key}}}`, String(value));
    }
  }
  return text;
}

export function useTranslation() {
  const { locale } = useAppPreferences();
  const isRTL = locale === "ar";

  const t = useCallback(
    (path: Path, params?: Record<string, string | number>) =>
      translate(locale, path, params),
    [locale]
  );

  const rtlTextStyle = useMemo(
    (): TextStyle => ({
      writingDirection: isRTL ? "rtl" : "ltr",
      textAlign: isRTL ? "right" : "left",
    }),
    [isRTL]
  );

  const rtlViewStyle = useMemo(
    (): ViewStyle => ({
      direction: isRTL ? "rtl" : "ltr",
    }),
    [isRTL]
  );

  return { t, locale, isRTL, rtlTextStyle, rtlViewStyle };
}

export function getLocaleDateString(locale: LanguageLocale, date: Date): string {
  const tag = locale === "ar" ? "ar-SA" : locale === "en" ? "en-US" : "fr-FR";
  return date.toLocaleDateString(tag, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getPreferenceSubtitle(
  locale: LanguageLocale,
  key: string,
  value: string
): string {
  const map: Record<string, Record<string, string>> = {
    theme: {
      spiritual: translate(locale, "preferences.themeSpiritual"),
      light: translate(locale, "preferences.themeLight"),
      dark: translate(locale, "preferences.themeDark"),
    },
    "tab-bar": {
      custom: translate(locale, "preferences.tabBarCustom"),
      liquid: translate(locale, "preferences.tabBarLiquid"),
      native: translate(locale, "preferences.tabBarNative"),
    },
    "icon-style": {
      outline: translate(locale, "preferences.iconOutline"),
      filled: translate(locale, "preferences.iconFilled"),
    },
    "text-size": {
      small: translate(locale, "preferences.textSmall"),
      medium: translate(locale, "preferences.textMedium"),
      large: translate(locale, "preferences.textLarge"),
    },
    accent: {
      green: translate(locale, "preferences.accentGreen"),
      blue: translate(locale, "preferences.accentBlue"),
      amber: translate(locale, "preferences.accentAmber"),
      teal: translate(locale, "preferences.accentTeal"),
      purple: translate(locale, "preferences.accentPurple"),
      rose: translate(locale, "preferences.accentRose"),
      indigo: translate(locale, "preferences.accentIndigo"),
      emerald: translate(locale, "preferences.accentEmerald"),
    },
    language: {
      fr: translate(locale, "languages.fr"),
      en: translate(locale, "languages.en"),
      ar: translate(locale, "languages.ar"),
    },
  };
  return map[key]?.[value] ?? value;
}

export function getThemeLabelI18n(locale: LanguageLocale, theme: ThemeMode): string {
  return getPreferenceSubtitle(locale, "theme", theme);
}

export function getThemeDescriptionI18n(
  locale: LanguageLocale,
  theme: ThemeMode
): string {
  const paths: Record<ThemeMode, string> = {
    spiritual: "preferences.themeSpiritualDesc",
    light: "preferences.themeLightDesc",
    dark: "preferences.themeDarkDesc",
  };
  return translate(locale, paths[theme]);
}

export function getTabBarLabelI18n(
  locale: LanguageLocale,
  variant: TabBarVariant
): string {
  return getPreferenceSubtitle(locale, "tab-bar", variant);
}

export function getIconStyleLabelI18n(
  locale: LanguageLocale,
  style: IconStyleMode
): string {
  return getPreferenceSubtitle(locale, "icon-style", style);
}

export function getTextSizeLabelI18n(
  locale: LanguageLocale,
  size: TextSizeMode
): string {
  return getPreferenceSubtitle(locale, "text-size", size);
}

export function getAccentLabelI18n(
  locale: LanguageLocale,
  accent: AccentColorKey
): string {
  return getPreferenceSubtitle(locale, "accent", accent);
}

export function getLanguageLabelI18n(
  locale: LanguageLocale,
  lang: LanguageLocale
): string {
  return getPreferenceSubtitle(locale, "language", lang);
}
