import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDuaLanguage, type DuaLanguage } from "../storage";
import { useAppPreferences } from "@/lib/app-preferences";

const KEY_LANGUAGE = "@dua_language";

function localeToDuaLang(locale: string): DuaLanguage {
  if (locale === "en") return "en";
  if (locale === "ar") return "ar";
  return "fr";
}

/**
 * Langue des invocations : suit la locale app (fr / en / ar).
 */
export function useDuaLanguage(): {
  language: DuaLanguage;
  setLanguage: (lang: DuaLanguage) => Promise<void>;
  isLoading: boolean;
} {
  const { locale } = useAppPreferences();
  const localeDefault = localeToDuaLang(locale);
  const [language, setLanguageState] = useState<DuaLanguage>(localeDefault);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY_LANGUAGE);
        if (cancelled) return;
        if (raw === "fr" || raw === "en" || raw === "ar") {
          setLanguageState(raw);
        } else {
          setLanguageState(localeDefault);
          await setDuaLanguage(localeDefault);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [localeDefault]);

  const setLanguage = useCallback(async (lang: DuaLanguage) => {
    setLanguageState(lang);
    await setDuaLanguage(lang);
  }, []);

  return { language, setLanguage, isLoading };
}
