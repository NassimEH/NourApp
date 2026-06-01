/** Couleurs d'accent disponibles dans Profil → Couleur d'accent */
export const ACCENT_COLOR_KEYS = [
  "green",
  "blue",
  "amber",
  "teal",
  "purple",
  "rose",
  "indigo",
  "emerald",
] as const;

export type AccentColorKey = (typeof ACCENT_COLOR_KEYS)[number];

export const ACCENT_HEX: Record<AccentColorKey, string> = {
  green: "#3d6b47",
  blue: "#2563eb",
  amber: "#d97706",
  teal: "#0d9488",
  purple: "#7c3aed",
  rose: "#e11d48",
  indigo: "#4f46e5",
  emerald: "#059669",
};

/** Variantes plus claires pour le mode sombre */
export const ACCENT_ON_DARK: Record<AccentColorKey, string> = {
  green: "#7cb88a",
  blue: "#60a5fa",
  amber: "#fbbf24",
  teal: "#2dd4bf",
  purple: "#a78bfa",
  rose: "#fb7185",
  indigo: "#818cf8",
  emerald: "#34d399",
};

export function isAccentColorKey(value: unknown): value is AccentColorKey {
  return (
    typeof value === "string" &&
    (ACCENT_COLOR_KEYS as readonly string[]).includes(value)
  );
}
