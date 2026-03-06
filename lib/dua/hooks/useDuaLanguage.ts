import { useState, useEffect, useCallback } from "react";
import { getDuaLanguage, setDuaLanguage, type DuaLanguage } from "../storage";

export function useDuaLanguage(): {
  language: DuaLanguage;
  setLanguage: (lang: DuaLanguage) => Promise<void>;
  isLoading: boolean;
} {
  const [language, setLanguageState] = useState<DuaLanguage>("fr");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDuaLanguage().then((lang) => {
      setLanguageState(lang);
      setIsLoading(false);
    });
  }, []);

  const setLanguage = useCallback(async (lang: DuaLanguage) => {
    setLanguageState(lang);
    await setDuaLanguage(lang);
  }, []);

  return { language, setLanguage, isLoading };
}
