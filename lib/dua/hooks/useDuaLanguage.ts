import { useEffect } from "react";
import { setDuaLanguage, type DuaLanguage } from "../storage";

/** Invocations : français uniquement pour l'instant. */
const DUA_LANGUAGE: DuaLanguage = "fr";

export function useDuaLanguage(): {
  language: DuaLanguage;
  setLanguage: (lang: DuaLanguage) => Promise<void>;
  isLoading: boolean;
} {
  useEffect(() => {
    void setDuaLanguage(DUA_LANGUAGE);
  }, []);

  return {
    language: DUA_LANGUAGE,
    setLanguage: async () => {},
    isLoading: false,
  };
}
