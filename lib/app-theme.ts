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
    const lightBg = "#F0EEE6";
    return {
      mode,
      isDark: false,
      background: lightBg,
      backgroundSecondary: "#E8E4DC",
      text: lightText.text,
      textMuted: lightText.textMuted,
      icon: lightText.icon,
      iconMuted: lightText.iconMuted,
      accent,
      onAccent: "#FFFFFF",
      accentSurface: hexToRgba(accentBase, 0.12),
      accentBorder: hexToRgba(accentBase, 0.28),
      border: "rgba(0,0,0,0.12)",
      divider: "rgba(0,0,0,0.08)",
      card: "#FAF8F2",
      cardElevated: "#FFFFFF",
      danger: "#DC2626",
      usesBackgroundImage: false,
      statusBarStyle: "dark",
      tabBarBlurTint: "light",
      tabBarBackground: "rgba(240,238,230,0.94)",
      tabBarBorder: "rgba(0,0,0,0.1)",
      tabBarIconActive: accent,
      tabBarIconInactive: "rgba(0,0,0,0.5)",
      glassBlurTint: "light",
      glassOverlay: "rgba(240,238,230,0.75)",
      glassBorder: "rgba(0,0,0,0.1)",
      glassSurfaceAndroid: "rgba(240,238,230,0.94)",
      switchTrackOff: "#C8C4BA",
      progressTrack: hexToRgba(accentBase, 0.22),
      handle: "rgba(0,0,0,0.22)",
    };
  }

  if (mode === "dark") {
    const darkBg = "#333333";
    return {
      mode,
      isDark: true,
      background: darkBg,
      backgroundSecondary: "#3D3D3D",
      text: "#F9FAFB",
      textMuted: "#B8BEC9",
      icon: "#F3F4F6",
      iconMuted: "#9CA3AF",
      accent,
      onAccent: "#FFFFFF",
      accentSurface: hexToRgba(accent, 0.18),
      accentBorder: hexToRgba(accent, 0.45),
      border: "rgba(255,255,255,0.14)",
      divider: "rgba(255,255,255,0.1)",
      card: "#3A3A3A",
      cardElevated: "#454545",
      danger: "#F87171",
      usesBackgroundImage: false,
      statusBarStyle: "light",
      tabBarBlurTint: "dark",
      tabBarBackground: "rgba(51,51,51,0.96)",
      tabBarBorder: "rgba(255,255,255,0.12)",
      tabBarIconActive: accent,
      tabBarIconInactive: "#9CA3AF",
      glassBlurTint: "dark",
      glassOverlay: "rgba(51,51,51,0.88)",
      glassBorder: "rgba(255,255,255,0.14)",
      glassSurfaceAndroid: "rgba(51,51,51,0.96)",
      switchTrackOff: "#555555",
      progressTrack: hexToRgba(accent, 0.35),
      handle: "rgba(255,255,255,0.35)",
    };
  }

  // spiritual — fond illustré, textes sombres sur surfaces claires
  return {
    mode: "spiritual",
    isDark: false,
    background: "transparent",
    backgroundSecondary: "rgba(255,255,255,0.88)",
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
