import { StyleSheet, Text, View } from "react-native";

import { useAppPreferences, type IconStyleMode } from "@/lib/app-preferences";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation, getIconStyleLabelI18n } from "@/lib/i18n";
import { AppIcon } from "@/components/AppIcon";
import { PreferenceOptionRow } from "@/components/PreferenceOptionRow";
import {
  PreferenceScreenLayout,
  PreferenceOptionDivider,
} from "@/components/PreferenceScreenLayout";

const OPTIONS: IconStyleMode[] = ["outline", "filled"];

const PREVIEW_ICONS = [
  "home",
  "book-open",
  "heart",
  "search",
  "user",
] as const;

export default function IconStyleScreen() {
  const { iconStyle, setIconStyle } = useAppPreferences();
  const colors = useAppTheme();
  const { t, locale, rtlTextStyle } = useTranslation();

  return (
    <PreferenceScreenLayout
      title={t("preferences.iconStyleTitle")}
      subtitle={t("preferences.iconStyleSubtitle")}
    >
      <View style={styles.previewBlock}>
        <Text style={[styles.previewLabel, { color: colors.textMuted }, rtlTextStyle]}>
          {t("preferences.languagePreviewLabel")} — {getIconStyleLabelI18n(locale, iconStyle)}
        </Text>
        <View
          style={[
            styles.previewRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {PREVIEW_ICONS.map((name) => (
            <AppIcon
              key={name}
              name={name}
              size={28}
              color={colors.accent}
            />
          ))}
        </View>
      </View>

      {OPTIONS.map((opt, index) => (
        <View key={opt}>
          <PreferenceOptionRow
            label={getIconStyleLabelI18n(locale, opt)}
            selected={iconStyle === opt}
            onPress={() => setIconStyle(opt)}
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
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
});
