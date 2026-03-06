import { useState, useEffect, useCallback } from "react";
import { getHadithLanguage, setHadithLanguage } from "../storage";
import type { HadithLanguage } from "../storage";

export function useHadithLanguage(): {
  language: HadithLanguage;
  setLanguage: (lang: HadithLanguage) => Promise<void>;
  isLoading: boolean;
} {
  const [language, setLanguageState] = useState<HadithLanguage>("en");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getHadithLanguage().then((lang) => {
      setLanguageState(lang);
      setLoading(false);
    });
  }, []);

  const setLanguage = useCallback(async (lang: HadithLanguage) => {
    setLanguageState(lang);
    await setHadithLanguage(lang);
  }, []);

  return { language, setLanguage, isLoading };
}
