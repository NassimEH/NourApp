import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  isAccentColorKey,
  type AccentColorKey,
} from "@/lib/accent-colors";
import {
  AVAILABLE_RECITERS,
  DEFAULT_AUDIO_RECITER,
  type QuranTranslationLang,
} from "@/lib/quran/types";

const STORAGE_KEY = "@nour_app_preferences";

export type ThemeMode = "spiritual" | "light" | "dark";
export type IconStyleMode = "outline" | "filled";
export type TextSizeMode = "small" | "medium" | "large";
export type TextColorMode = "black" | "slate" | "brown";
export type { AccentColorKey } from "@/lib/accent-colors";
export type LanguageLocale = "fr" | "en" | "ar";

export interface AppPreferencesState {
  theme: ThemeMode;
  iconStyle: IconStyleMode;
  textSize: TextSizeMode;
  textColor: TextColorMode;
  accentColor: AccentColorKey;
  locale: LanguageLocale;
  quranReciter: string;
  quranTranslationLang: QuranTranslationLang;
}

const DEFAULT_PREFS: AppPreferencesState = {
  theme: "spiritual",
  iconStyle: "outline",
  textSize: "medium",
  textColor: "black",
  accentColor: "green",
  locale: "fr",
  quranReciter: DEFAULT_AUDIO_RECITER,
  quranTranslationLang: "fr",
};

interface AppPreferencesContextType extends AppPreferencesState {
  setTheme: (v: ThemeMode) => void;
  setIconStyle: (v: IconStyleMode) => void;
  setTextSize: (v: TextSizeMode) => void;
  setTextColor: (v: TextColorMode) => void;
  setAccentColor: (v: AccentColorKey) => void;
  setLocale: (v: LanguageLocale) => void;
  setQuranReciter: (v: string) => void;
  setQuranTranslationLang: (v: QuranTranslationLang) => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextType | undefined>(undefined);

async function loadStored(): Promise<Partial<AppPreferencesState>> {
  if (Platform.OS === "web") return {};
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<AppPreferencesState>;
    return {
      theme: normalizeThemeMode(parsed.theme),
      iconStyle: ["outline", "filled"].includes(parsed.iconStyle ?? "") ? parsed.iconStyle : undefined,
      textSize: ["small", "medium", "large"].includes(parsed.textSize ?? "") ? parsed.textSize : undefined,
      textColor: ["black", "slate", "brown"].includes(parsed.textColor ?? "") ? parsed.textColor : undefined,
      accentColor: isAccentColorKey(parsed.accentColor)
        ? parsed.accentColor
        : undefined,
      locale: ["fr", "en", "ar"].includes(parsed.locale ?? "") ? parsed.locale : undefined,
      quranReciter: AVAILABLE_RECITERS.some((r) => r.id === parsed.quranReciter)
        ? parsed.quranReciter
        : undefined,
      quranTranslationLang: ["fr", "en", "ar"].includes(parsed.quranTranslationLang ?? "")
        ? parsed.quranTranslationLang
        : undefined,
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
  const hydrationPendingRef = useRef(true);

  useEffect(() => {
    loadStored().then((stored) => {
      setState((prev) => {
        const hydrated = { ...DEFAULT_PREFS, ...stored };
        if (!hydrationPendingRef.current) {
          return { ...hydrated, ...prev };
        }
        hydrationPendingRef.current = false;
        return hydrated;
      });
    });
  }, []);

  const persist = useCallback((next: Partial<AppPreferencesState>) => {
    hydrationPendingRef.current = false;
    setState((prev) => {
      const hasChange = (Object.keys(next) as (keyof AppPreferencesState)[]).some(
        (key) => next[key] !== prev[key]
      );
      if (!hasChange) return prev;

      const nextState = { ...prev, ...next };
      void saveStored(nextState);
      return nextState;
    });
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => persist({ theme }), [persist]);
  const setIconStyle = useCallback((iconStyle: IconStyleMode) => persist({ iconStyle }), [persist]);
  const setTextSize = useCallback((textSize: TextSizeMode) => persist({ textSize }), [persist]);
  const setTextColor = useCallback((textColor: TextColorMode) => persist({ textColor }), [persist]);
  const setAccentColor = useCallback((accentColor: AccentColorKey) => persist({ accentColor }), [persist]);
  const setLocale = useCallback((locale: LanguageLocale) => persist({ locale }), [persist]);
  const setQuranReciter = useCallback((quranReciter: string) => {
    if (!AVAILABLE_RECITERS.some((r) => r.id === quranReciter)) return;
    persist({ quranReciter });
  }, [persist]);
  const setQuranTranslationLang = useCallback(
    (quranTranslationLang: QuranTranslationLang) => persist({ quranTranslationLang }),
    [persist]
  );

  const value = useMemo<AppPreferencesContextType>(
    () => ({
      ...state,
      setTheme,
      setIconStyle,
      setTextSize,
      setTextColor,
      setAccentColor,
      setLocale,
      setQuranReciter,
      setQuranTranslationLang,
    }),
    [
      state,
      setTheme,
      setIconStyle,
      setTextSize,
      setTextColor,
      setAccentColor,
      setLocale,
      setQuranReciter,
      setQuranTranslationLang,
    ]
  );

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
    setTextColor: () => {},
    setAccentColor: () => {},
    setLocale: () => {},
    setQuranReciter: () => {},
    setQuranTranslationLang: () => {},
  };
  }
  return ctx;
}

function normalizeThemeMode(value: unknown): ThemeMode | undefined {
  if (value === "spiritual" || value === "light" || value === "dark") return value;
  // Anciens réglages : "system" = apparence spirituelle par défaut
  if (value === "system") return "spiritual";
  return undefined;
}

export const THEME_LABELS: Record<ThemeMode, string> = {
  spiritual: "Thème spirituel",
  light: "Clair",
  dark: "Sombre",
};

/** Libellé affiché dans Profil → Thème (avec repli si valeur inconnue) */
export function getThemeLabel(theme: ThemeMode | string | undefined): string {
  if (theme === "spiritual" || theme === "light" || theme === "dark") {
    return THEME_LABELS[theme];
  }
  return THEME_LABELS.spiritual;
}

export const THEME_DESCRIPTIONS: Record<ThemeMode, string> = {
  spiritual: "Fond illustré, ambiance douce et spirituelle",
  light: "Fond blanc, textes sombres (modèle de base)",
  dark: "Fond sombre, textes clairs",
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

export const TEXT_COLOR_LABELS: Record<TextColorMode, string> = {
  black: "Noir",
  slate: "Ardoise",
  brown: "Brun",
};

export const LANGUAGE_LABELS: Record<LanguageLocale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};
