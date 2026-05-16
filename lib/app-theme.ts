import { useMemo } from "react";
import type { AccentColorKey, ThemeMode } from "@/lib/app-preferences";
import { useAppPreferences } from "@/lib/app-preferences";

export const ACCENT_HEX: Record<AccentColorKey, string> = {
  green: "#3d6b47",
  blue: "#2563eb",
  amber: "#d97706",
};

export interface AppThemeColors {
  mode: ThemeMode;
  background: string;
  backgroundSecondary: string;
  text: string;
  textMuted: string;
  icon: string;
  accent: string;
  border: string;
  card: string;
  danger: string;
  /** Fond d'écran image (thème spirituel uniquement) */
  usesBackgroundImage: boolean;
  statusBarStyle: "light" | "dark";
  tabBarBlurTint: "light" | "dark";
}

function buildTheme(mode: ThemeMode, accentKey: AccentColorKey): AppThemeColors {
  const accent = ACCENT_HEX[accentKey];

  if (mode === "light") {
    return {
      mode,
      background: "#FFFFFF",
      backgroundSecondary: "#F5F5F7",
      text: "#000000",
      textMuted: "#666876",
      icon: "#191D31",
      accent,
      border: "rgba(0,0,0,0.08)",
      card: "#FFFFFF",
      danger: "#dc2626",
      usesBackgroundImage: false,
      statusBarStyle: "dark",
      tabBarBlurTint: "light",
    };
  }

  if (mode === "dark") {
    return {
      mode,
      background: "#0f1117",
      backgroundSecondary: "#1a1d26",
      text: "#F5F5F7",
      textMuted: "rgba(255,255,255,0.55)",
      icon: "#F5F5F7",
      accent: accentKey === "green" ? "#6b9f76" : accent,
      border: "rgba(255,255,255,0.1)",
      card: "#1a1d26",
      danger: "#f87171",
      usesBackgroundImage: false,
      statusBarStyle: "light",
      tabBarBlurTint: "dark",
    };
  }

  // spiritual (défaut actuel de l'app)
  return {
    mode: "spiritual",
    background: "transparent",
    backgroundSecondary: "rgba(255,255,255,0.85)",
    text: "#191D31",
    textMuted: "rgba(0,0,0,0.5)",
    icon: "#191D31",
    accent,
    border: "rgba(0,0,0,0.08)",
    card: "rgba(255,255,255,0.9)",
    danger: "#dc2626",
    usesBackgroundImage: true,
    statusBarStyle: "dark",
    tabBarBlurTint: "light",
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
