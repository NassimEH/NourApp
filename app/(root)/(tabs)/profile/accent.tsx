import { View } from "react-native";

import { useAppPreferences, type AccentColorKey } from "@/lib/app-preferences";
import { useTranslation, getAccentLabelI18n } from "@/lib/i18n";
import { PreferenceOptionRow } from "@/components/PreferenceOptionRow";
import {
  PreferenceScreenLayout,
  PreferenceOptionDivider,
} from "@/components/PreferenceScreenLayout";

const OPTIONS: AccentColorKey[] = ["green", "blue", "amber"];

export default function AccentScreen() {
  const { accentColor, setAccentColor } = useAppPreferences();
  const { t, locale } = useTranslation();

  return (
    <PreferenceScreenLayout
      title={t("preferences.accentTitle")}
      subtitle={t("preferences.accentSubtitle")}
    >
      {OPTIONS.map((opt, index) => (
        <View key={opt}>
          <PreferenceOptionRow
            label={getAccentLabelI18n(locale, opt)}
            selected={accentColor === opt}
            onPress={() => setAccentColor(opt)}
          />
          {index < OPTIONS.length - 1 ? <PreferenceOptionDivider /> : null}
        </View>
      ))}
    </PreferenceScreenLayout>
  );
}
