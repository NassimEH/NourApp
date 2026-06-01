import { useMemo } from "react";
import {
  ACCENT_HEX,
  ACCENT_ON_DARK,
  type AccentColorKey,
} from "@/lib/accent-colors";
import type { ThemeMode } from "@/lib/app-preferences";
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

function buildTheme(mode: ThemeMode, accentKey: AccentColorKey): AppThemeColors {
  const accentBase = ACCENT_HEX[accentKey];
  const accent =
    mode === "dark" ? ACCENT_ON_DARK[accentKey] : accentBase;

  if (mode === "light") {
    return {
      mode,
      isDark: false,
      background: "#FFFFFF",
      backgroundSecondary: "#F5F5F7",
      text: "#111827",
      textMuted: "#4B5563",
      icon: "#1F2937",
      iconMuted: "#6B7280",
      accent,
      onAccent: "#FFFFFF",
      accentSurface: hexToRgba(accentBase, 0.1),
      accentBorder: hexToRgba(accentBase, 0.28),
      border: "rgba(0,0,0,0.1)",
      divider: "rgba(0,0,0,0.08)",
      card: "#FFFFFF",
      cardElevated: "#F9FAFB",
      danger: "#DC2626",
      usesBackgroundImage: false,
      statusBarStyle: "dark",
      tabBarBlurTint: "light",
      tabBarBackground: "rgba(255,255,255,0.92)",
      tabBarBorder: "rgba(0,0,0,0.1)",
      tabBarIconActive: accent,
      tabBarIconInactive: "#6B7280",
      glassBlurTint: "light",
      glassOverlay: "rgba(255,255,255,0.72)",
      glassBorder: "rgba(0,0,0,0.08)",
      glassSurfaceAndroid: "rgba(255,255,255,0.94)",
      switchTrackOff: "#D1D5DB",
      progressTrack: hexToRgba(accentBase, 0.22),
      handle: "rgba(0,0,0,0.2)",
    };
  }

  if (mode === "dark") {
    return {
      mode,
      isDark: true,
      background: "#0B0D12",
      backgroundSecondary: "#151922",
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
      card: "#1A1F2B",
      cardElevated: "#222836",
      danger: "#F87171",
      usesBackgroundImage: false,
      statusBarStyle: "light",
      tabBarBlurTint: "dark",
      tabBarBackground: "rgba(21,25,34,0.96)",
      tabBarBorder: "rgba(255,255,255,0.12)",
      tabBarIconActive: accent,
      tabBarIconInactive: "#9CA3AF",
      glassBlurTint: "dark",
      glassOverlay: "rgba(21,25,34,0.88)",
      glassBorder: "rgba(255,255,255,0.14)",
      glassSurfaceAndroid: "rgba(21,25,34,0.96)",
      switchTrackOff: "#4B5563",
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
    text: "#191D31",
    textMuted: "#5B5D5E",
    icon: "#191D31",
    iconMuted: "#6B7280",
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
  accentKey: AccentColorKey
): AppThemeColors {
  return buildTheme(mode, accentKey);
}

export function useAppTheme(): AppThemeColors {
  const { theme, accentColor } = useAppPreferences();
  return useMemo(
    () => buildTheme(theme, accentColor),
    [theme, accentColor]
  );
}
