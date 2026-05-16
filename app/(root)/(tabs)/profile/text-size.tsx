import { StyleSheet, Text, View } from "react-native";

import {
  useAppPreferences,
  type TextSizeMode,
  type LanguageLocale,
} from "@/lib/app-preferences";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation, getTextSizeLabelI18n } from "@/lib/i18n";
import { AppText } from "@/components/AppText";
import { PreferenceOptionRow } from "@/components/PreferenceOptionRow";
import {
  PreferenceScreenLayout,
  PreferenceOptionDivider,
} from "@/components/PreferenceScreenLayout";

const OPTIONS: TextSizeMode[] = ["small", "medium", "large"];

const PREVIEW_ARABIC =
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const PREVIEW_TRANSLATION: Record<LanguageLocale, string> = {
  fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
  en: "In the name of Allah, the Most Gracious, the Most Merciful.",
  ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
};

export default function TextSizeScreen() {
  const { textSize, setTextSize } = useAppPreferences();
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t, locale, rtlTextStyle } = useTranslation();

  const previewTranslation = PREVIEW_TRANSLATION[locale];

  return (
    <PreferenceScreenLayout
      title={t("preferences.textSizeTitle")}
      subtitle={t("preferences.textSizeSubtitle")}
    >
      <View style={styles.previewBlock}>
        <Text style={[styles.previewLabel, { color: colors.textMuted }, rtlTextStyle]}>
          {t("preferences.textSizePreviewLabel")} — {getTextSizeLabelI18n(locale, textSize)}
        </Text>
        <View
          style={[
            styles.previewCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <AppText
            variant="arabic"
            style={[styles.previewArabic, { color: colors.text }]}
          >
            {PREVIEW_ARABIC}
          </AppText>
          <AppText
            variant="translation"
            style={[styles.previewTranslation, { color: colors.textMuted }]}
          >
            {previewTranslation}
          </AppText>
          <AppText
            variant="body"
            style={{ color: colors.text, marginTop: 12 }}
          >
            {t("preferences.textSizeBodySample", { size: typography.body })}
          </AppText>
        </View>
      </View>

      {OPTIONS.map((opt, index) => (
        <View key={opt}>
          <PreferenceOptionRow
            label={getTextSizeLabelI18n(locale, opt)}
            selected={textSize === opt}
            onPress={() => setTextSize(opt)}
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
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  previewArabic: {
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "right",
    writingDirection: "rtl",
  },
  previewTranslation: {
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 12,
  },
});
