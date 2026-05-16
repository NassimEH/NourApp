import { View } from "react-native";

import { useTabBarPreference, type TabBarVariant } from "@/lib/tab-bar-preference";
import { useTranslation, getTabBarLabelI18n } from "@/lib/i18n";
import { PreferenceOptionRow } from "@/components/PreferenceOptionRow";
import {
  PreferenceScreenLayout,
  PreferenceOptionDivider,
} from "@/components/PreferenceScreenLayout";

const OPTIONS: TabBarVariant[] = ["custom", "native"];

export default function TabBarScreen() {
  const { tabBarVariant, setTabBarVariant } = useTabBarPreference();
  const { t, locale } = useTranslation();

  return (
    <PreferenceScreenLayout
      title={t("preferences.tabBarTitle")}
      subtitle={t("preferences.tabBarSubtitle")}
    >
      {OPTIONS.map((opt, index) => (
        <View key={opt}>
          <PreferenceOptionRow
            label={getTabBarLabelI18n(locale, opt)}
            selected={tabBarVariant === opt}
            onPress={() => setTabBarVariant(opt)}
          />
          {index < OPTIONS.length - 1 ? <PreferenceOptionDivider /> : null}
        </View>
      ))}
    </PreferenceScreenLayout>
  );
}
