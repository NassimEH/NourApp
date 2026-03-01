import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@nour_app_preferences";

export type ThemeMode = "light" | "dark" | "system";
export type IconStyleMode = "outline" | "filled";
export type TextSizeMode = "small" | "medium" | "large";
export type AccentColorKey = "green" | "blue" | "amber";
export type LanguageLocale = "fr" | "en" | "ar";

export interface AppPreferencesState {
  theme: ThemeMode;
  iconStyle: IconStyleMode;
  textSize: TextSizeMode;
  accentColor: AccentColorKey;
  locale: LanguageLocale;
}

const DEFAULT_PREFS: AppPreferencesState = {
  theme: "system",
  iconStyle: "outline",
  textSize: "medium",
  accentColor: "green",
  locale: "fr",
};

interface AppPreferencesContextType extends AppPreferencesState {
  setTheme: (v: ThemeMode) => void;
  setIconStyle: (v: IconStyleMode) => void;
  setTextSize: (v: TextSizeMode) => void;
  setAccentColor: (v: AccentColorKey) => void;
  setLocale: (v: LanguageLocale) => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextType | undefined>(undefined);

async function loadStored(): Promise<Partial<AppPreferencesState>> {
  if (Platform.OS === "web") return {};
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<AppPreferencesState>;
    return {
      theme: ["light", "dark", "system"].includes(parsed.theme ?? "") ? parsed.theme : undefined,
      iconStyle: ["outline", "filled"].includes(parsed.iconStyle ?? "") ? parsed.iconStyle : undefined,
      textSize: ["small", "medium", "large"].includes(parsed.textSize ?? "") ? parsed.textSize : undefined,
      accentColor: ["green", "blue", "amber"].includes(parsed.accentColor ?? "") ? parsed.accentColor : undefined,
      locale: ["fr", "en", "ar"].includes(parsed.locale ?? "") ? parsed.locale : undefined,
    };
  } catch {
    return {};
  }
}

async function saveStored(prefs: AppPreferencesState) {
  if (Platform.OS === "web") return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppPreferencesState>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadStored().then((stored) => {
      setState((prev) => ({
        ...prev,
        ...stored,
      }));
      setHydrated(true);
    });
  }, []);

  const persist = useCallback((next: Partial<AppPreferencesState>) => {
    setState((prev) => {
      const nextState = { ...prev, ...next };
      saveStored(nextState);
      return nextState;
    });
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => persist({ theme }), [persist]);
  const setIconStyle = useCallback((iconStyle: IconStyleMode) => persist({ iconStyle }), [persist]);
  const setTextSize = useCallback((textSize: TextSizeMode) => persist({ textSize }), [persist]);
  const setAccentColor = useCallback((accentColor: AccentColorKey) => persist({ accentColor }), [persist]);
  const setLocale = useCallback((locale: LanguageLocale) => persist({ locale }), [persist]);

  const value: AppPreferencesContextType = {
    ...state,
    setTheme,
    setIconStyle,
    setTextSize,
    setAccentColor,
    setLocale,
  };

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences(): AppPreferencesContextType {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) {
  return {
    ...DEFAULT_PREFS,
    setTheme: () => {},
    setIconStyle: () => {},
    setTextSize: () => {},
    setAccentColor: () => {},
    setLocale: () => {},
  };
  }
  return ctx;
}

export const THEME_LABELS: Record<ThemeMode, string> = {
  light: "Clair",
  dark: "Sombre",
  system: "Système",
};

export const ICON_STYLE_LABELS: Record<IconStyleMode, string> = {
  outline: "Contour",
  filled: "Rempli",
};

export const TEXT_SIZE_LABELS: Record<TextSizeMode, string> = {
  small: "Petite",
  medium: "Normale",
  large: "Grande",
};

export const ACCENT_COLOR_LABELS: Record<AccentColorKey, string> = {
  green: "Vert",
  blue: "Bleu",
  amber: "Ambre",
};

export const LANGUAGE_LABELS: Record<LanguageLocale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};
