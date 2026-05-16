import { useEffect } from "react";
import { I18nManager } from "react-native";

import { useAppPreferences } from "@/lib/app-preferences";

/** Active le mode RTL lorsque la langue est l'arabe. */
export function LocaleSync() {
  const { locale } = useAppPreferences();

  useEffect(() => {
    const shouldRtl = locale === "ar";
    if (I18nManager.isRTL !== shouldRtl) {
      I18nManager.allowRTL(shouldRtl);
      I18nManager.forceRTL(shouldRtl);
    }
  }, [locale]);

  return null;
}
