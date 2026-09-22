import { useMemo } from "react";
import {
  ACCENT_HEX,
  ACCENT_ON_DARK,
  type AccentColorKey,
} from "@/lib/accent-colors";
import type { TextColorMode, ThemeMode } from "@/lib/app-preferences";
import { useAppPreferences } from "@/lib/app-preferences";

export { ACCENT_HEX } from "@/lib/accent-colors";
export type { AccentColorKey } from "@/lib/accent-colors";

export interface AppThemeColors {
  mode: ThemeMode;
  isDark: boolean;
  background: string;
  backgroundSecondary: string;
  text: string;
  textMuted: string;
  icon: string;
  iconMuted: string;
  accent: string;
  /** Texte / icône sur fond accent */
  onAccent: string;
  /** Fond léger teinté accent (cartes, lignes sélectionnées) */
  accentSurface: string;
  accentBorder: string;
  border: string;
  divider: string;
  card: string;
  cardElevated: string;
  danger: string;
  usesBackgroundImage: boolean;
  statusBarStyle: "light" | "dark";
  tabBarBlurTint: "light" | "dark" | "default";
  tabBarBackground: string;
  tabBarBorder: string;
  tabBarIconActive: string;
  tabBarIconInactive: string;
  /** Barre flottante (pilule) */
  glassBlurTint: "light" | "dark" | "default";
  glassOverlay: string;
  glassBorder: string;
  glassSurfaceAndroid: string;
  switchTrackOff: string;
  progressTrack: string;
  handle: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function getLightTextBase(textColor: TextColorMode): {
  text: string;
  textMuted: string;
  icon: string;
  iconMuted: string;
} {
  switch (textColor) {
    case "slate":
      return {
        text: "#1F2937",
        textMuted: "rgba(31,41,55,0.58)",
        icon: "#1F2937",
        iconMuted: "rgba(31,41,55,0.45)",
      };
    case "brown":
      return {
        text: "#3B2F2F",
        textMuted: "rgba(59,47,47,0.58)",
        icon: "#3B2F2F",
        iconMuted: "rgba(59,47,47,0.45)",
      };
    case "black":
    default:
      return {
        text: "#000000",
        textMuted: "rgba(0,0,0,0.55)",
        icon: "#000000",
        iconMuted: "rgba(0,0,0,0.45)",
      };
  }
}

function buildTheme(
  mode: ThemeMode,
  accentKey: AccentColorKey,
  textColor: TextColorMode
): AppThemeColors {
  const accentBase = ACCENT_HEX[accentKey];
  const accent =
    mode === "dark" ? ACCENT_ON_DARK[accentKey] : accentBase;
  const lightText = getLightTextBase(textColor);

  if (mode === "light") {
    // Neutre froid — distinct du thème spirituel (crème / pêche)
    const lightBg = "#F4F4F5";
    return {
      mode,
      isDark: false,
      background: lightBg,
      backgroundSecondary: "#E4E4E7",
      text: lightText.text,
      textMuted: lightText.textMuted,
      icon: lightText.icon,
      iconMuted: lightText.iconMuted,
      accent,
      onAccent: "#FFFFFF",
      accentSurface: hexToRgba(accentBase, 0.1),
      accentBorder: hexToRgba(accentBase, 0.26),
      border: "rgba(0,0,0,0.1)",
      divider: "rgba(0,0,0,0.07)",
      card: "#FFFFFF",
      cardElevated: "#FFFFFF",
      danger: "#DC2626",
      usesBackgroundImage: false,
      statusBarStyle: "dark",
      tabBarBlurTint: "light",
      tabBarBackground: "rgba(255,255,255,0.92)",
      tabBarBorder: "rgba(0,0,0,0.08)",
      tabBarIconActive: accent,
      tabBarIconInactive: "rgba(0,0,0,0.45)",
      glassBlurTint: "light",
      glassOverlay: "rgba(255,255,255,0.78)",
      glassBorder: "rgba(0,0,0,0.08)",
      glassSurfaceAndroid: "rgba(255,255,255,0.94)",
      switchTrackOff: "#D4D4D8",
      progressTrack: hexToRgba(accentBase, 0.2),
      handle: "rgba(0,0,0,0.2)",
    };
  }

  if (mode === "dark") {
    // Sombre net — pas de gris moyen « boueux »
    const darkBg = "#121214";
    return {
      mode,
      isDark: true,
      background: darkBg,
      backgroundSecondary: "#1A1A1D",
      text: "#F4F4F5",
      textMuted: "#A1A1AA",
      icon: "#FAFAFA",
      iconMuted: "#71717A",
      accent,
      onAccent: "#FFFFFF",
      accentSurface: hexToRgba(accent, 0.16),
      accentBorder: hexToRgba(accent, 0.4),
      border: "rgba(255,255,255,0.12)",
      divider: "rgba(255,255,255,0.08)",
      card: "#1C1C1F",
      cardElevated: "#27272A",
      danger: "#F87171",
      usesBackgroundImage: false,
      statusBarStyle: "light",
      tabBarBlurTint: "dark",
      tabBarBackground: "rgba(18,18,20,0.94)",
      tabBarBorder: "rgba(255,255,255,0.1)",
      tabBarIconActive: accent,
      tabBarIconInactive: "#71717A",
      glassBlurTint: "dark",
      glassOverlay: "rgba(18,18,20,0.88)",
      glassBorder: "rgba(255,255,255,0.12)",
      glassSurfaceAndroid: "rgba(28,28,31,0.96)",
      switchTrackOff: "#3F3F46",
      progressTrack: hexToRgba(accent, 0.32),
      handle: "rgba(255,255,255,0.32)",
    };
  }

  // spiritual — fond illustré crème → pêche ; surfaces semi-opaques
  // `background` doit rester opaque (jamais transparent) pour éviter le flash blanc
  // des navigateurs natifs pendant les transitions.
  return {
    mode: "spiritual",
    isDark: false,
    background: "#FAF7F2",
    backgroundSecondary: "#FAF7F2",
    text: lightText.text,
    textMuted: lightText.textMuted,
    icon: lightText.icon,
    iconMuted: lightText.iconMuted,
    accent: accentBase,
    onAccent: "#FFFFFF",
    accentSurface: hexToRgba(accentBase, 0.1),
    accentBorder: hexToRgba(accentBase, 0.28),
    border: "rgba(0,0,0,0.08)",
    divider: "rgba(0,0,0,0.06)",
    card: "rgba(255,255,255,0.92)",
    cardElevated: "rgba(255,255,255,0.96)",
    danger: "#DC2626",
    usesBackgroundImage: true,
    statusBarStyle: "dark",
    tabBarBlurTint: "light",
    tabBarBackground: "rgba(255,255,255,0.75)",
    tabBarBorder: "rgba(0,0,0,0.08)",
    tabBarIconActive: accentBase,
    tabBarIconInactive: "#5B5D5E",
    glassBlurTint: "light",
    glassOverlay: "rgba(255,255,255,0.55)",
    glassBorder: "rgba(255,255,255,0.35)",
    glassSurfaceAndroid: "rgba(255,255,255,0.88)",
    switchTrackOff: "#C4C8CC",
    progressTrack: hexToRgba(accentBase, 0.22),
    handle: "rgba(0,0,0,0.18)",
  };
}

export function getAppThemeColors(
  mode: ThemeMode,
  accentKey: AccentColorKey,
  textColor: TextColorMode
): AppThemeColors {
  return buildTheme(mode, accentKey, textColor);
}

export function useAppTheme(): AppThemeColors {
  const { theme, accentColor, textColor } = useAppPreferences();
  return useMemo(
    () => buildTheme(theme, accentColor, textColor),
    [theme, accentColor, textColor]
  );
}
