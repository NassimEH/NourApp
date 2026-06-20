import { StyleSheet, Text, View } from "react-native";

import {
  useAppPreferences,
  type LanguageLocale,
} from "@/lib/app-preferences";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation, getLanguageLabelI18n } from "@/lib/i18n";
import { PreferenceOptionRow } from "@/components/PreferenceOptionRow";
import {
  PreferenceScreenLayout,
  PreferenceOptionDivider,
} from "@/components/PreferenceScreenLayout";

const OPTIONS: LanguageLocale[] = ["fr", "en", "ar"];

const PREVIEW_BY_LOCALE: Record<
  LanguageLocale,
  { greeting: string; subtitle: string }
> = {
  fr: {
    greeting: "Bienvenue sur Louma",
    subtitle: "Horaires de prière, Coran, invocations et plus.",
  },
  en: {
    greeting: "Welcome to Louma",
    subtitle: "Prayer times, Quran, invocations and more.",
  },
  ar: {
    greeting: "مرحباً بك في لومة",
    subtitle: "أوقات الصلاة، القرآن، الأذكار والمزيد.",
  },
};

export default function LanguageScreen() {
  const { locale, setLocale } = useAppPreferences();
  const colors = useAppTheme();
  const { t, rtlTextStyle } = useTranslation();
  const preview = PREVIEW_BY_LOCALE[locale];

  return (
    <PreferenceScreenLayout
      title={t("preferences.languageTitle")}
      subtitle={t("preferences.languageSubtitle")}
    >
      <View style={styles.previewBlock}>
        <Text style={[styles.previewLabel, { color: colors.textMuted }, rtlTextStyle]}>
          {t("preferences.languagePreviewLabel")} — {getLanguageLabelI18n(locale, locale)}
        </Text>
        <View style={styles.previewContent}>
          <Text style={[styles.previewGreeting, { color: colors.text }, rtlTextStyle]}>
            {preview.greeting}
          </Text>
          <Text
            style={[styles.previewSubtitle, { color: colors.textMuted }, rtlTextStyle]}
          >
            {preview.subtitle}
          </Text>
        </View>
      </View>

      {OPTIONS.map((opt, index) => (
        <View key={opt}>
          <PreferenceOptionRow
            label={getLanguageLabelI18n(locale, opt)}
            selected={locale === opt}
            onPress={() => setLocale(opt)}
          />
          {index < OPTIONS.length - 1 ? <PreferenceOptionDivider /> : null}
        </View>
      ))}
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  previewBlock: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    marginBottom: 10,
  },
  previewContent: {
    paddingVertical: 4,
  },
  previewGreeting: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
  },
  previewSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 8,
    lineHeight: 20,
  },
});
