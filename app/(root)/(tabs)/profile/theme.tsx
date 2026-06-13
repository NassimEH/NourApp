import { StyleSheet, Text, View } from "react-native";

import {
  useAppPreferences,
  type ThemeMode,
  type TextColorMode,
} from "@/lib/app-preferences";
import {
  getThemeDescriptionI18n,
  getThemeLabelI18n,
  getTextColorLabelI18n,
  useTranslation,
} from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";
import { PreferenceOptionRow } from "@/components/PreferenceOptionRow";
import { PreferenceOptionDivider } from "@/components/PreferenceOptionDivider";
import { PreferenceScreenLayout } from "@/components/PreferenceScreenLayout";

const OPTIONS: ThemeMode[] = ["spiritual", "light", "dark"];
const TEXT_COLOR_OPTIONS: TextColorMode[] = ["black", "slate", "brown"];

export default function ThemeScreen() {
  const { theme, setTheme, textColor, setTextColor } = useAppPreferences();
  const colors = useAppTheme();
  const { t, locale, rtlTextStyle } = useTranslation();

  return (
    <PreferenceScreenLayout
      title={t("preferences.themeTitle")}
      subtitle={t("screens.themePickerSubtitle")}
    >
      {OPTIONS.map((opt, index) => (
        <View
          key={opt}
          style={
            index < OPTIONS.length - 1
              ? [styles.optionWrap, { borderBottomColor: colors.border }]
              : undefined
          }
        >
          <PreferenceOptionRow
            label={getThemeLabelI18n(locale, opt)}
            description={getThemeDescriptionI18n(locale, opt)}
            descriptionStyle={rtlTextStyle}
            selected={theme === opt}
            onPress={() => setTheme(opt)}
          />
        </View>
      ))}

      <View style={[styles.sectionDivider, { borderTopColor: colors.border }]} />
      <Text style={[styles.sectionTitle, { color: colors.text }, rtlTextStyle]}>
        {t("preferences.textColorTitle")}
      </Text>
      <Text
        style={[styles.optionDescription, rtlTextStyle, { color: colors.textMuted }]}
      >
        {t("preferences.textColorSubtitle")}
      </Text>
      {TEXT_COLOR_OPTIONS.map((opt, index) => (
        <View key={opt}>
          <PreferenceOptionRow
            label={getTextColorLabelI18n(locale, opt)}
            selected={textColor === opt}
            onPress={() => setTextColor(opt)}
          />
          {index < TEXT_COLOR_OPTIONS.length - 1 ? (
            <PreferenceOptionDivider />
          ) : null}
        </View>
      ))}
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  optionWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionDivider: {
    borderTopWidth: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    paddingBottom: 12,
    lineHeight: 20,
  },
});
