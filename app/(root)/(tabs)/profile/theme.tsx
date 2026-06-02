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
import {
  PreferenceScreenLayout,
  PreferenceOptionDivider,
} from "@/components/PreferenceScreenLayout";

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
          style={[
            styles.optionWrap,
            index < OPTIONS.length - 1 && {
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <PreferenceOptionRow
            label={getThemeLabelI18n(locale, opt)}
            selected={theme === opt}
            onPress={() => setTheme(opt)}
          />
          <Text
            style={[
              styles.optionDescription,
              rtlTextStyle,
              { color: colors.textMuted },
            ]}
          >
            {getThemeDescriptionI18n(locale, opt)}
          </Text>
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
      {TEXT_COLOR_OPTIONS.map((opt) => (
        <PreferenceOptionRow
          key={opt}
          label={getTextColorLabelI18n(locale, opt)}
          selected={textColor === opt}
          onPress={() => setTextColor(opt)}
        />
      ))}
    </PreferenceScreenLayout>
  );
}

const styles = StyleSheet.create({
  optionWrap: { paddingBottom: 8 },
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
    paddingHorizontal: 4,
    paddingBottom: 12,
    lineHeight: 20,
  },
});
