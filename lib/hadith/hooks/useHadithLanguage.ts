import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setHadithLanguage } from "../storage";
import type { HadithLanguage } from "../storage";
import { useAppPreferences } from "@/lib/app-preferences";

const KEY_LANGUAGE = "@hadith_language";

export function useHadithLanguage(): {
  language: HadithLanguage;
  setLanguage: (lang: HadithLanguage) => Promise<void>;
  isLoading: boolean;
} {
  const { locale } = useAppPreferences();
  const localeDefault: HadithLanguage = locale === "en" ? "en" : "fr";
  const [language, setLanguageState] = useState<HadithLanguage>(localeDefault);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY_LANGUAGE);
        if (cancelled) return;
        if (raw === "fr" || raw === "en") {
          setLanguageState(raw);
        } else {
          setLanguageState(localeDefault);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [localeDefault]);

  const setLanguage = useCallback(async (lang: HadithLanguage) => {
    setLanguageState(lang);
    await setHadithLanguage(lang);
  }, []);

  return { language, setLanguage, isLoading };
}
