import { ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import { ListRow } from "@/components/ListRow";
import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { getHadithThemes } from "@/lib/hadith/themes";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function HadithsThemeScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const themes = getHadithThemes();

  return (
    <ScreenStackLayout
      title={t("screens.hadithsThemeTitle")}
      subtitle={t("screens.hadithsThemeSubtitle")}
    >
      <Text style={[styles.intro, { color: colors.textMuted }]}>
        {t("screens.hadithThemesIntro")}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {themes.map((theme) => (
          <ListRow
            key={theme.id}
            icon={theme.icon}
            title={t(theme.titleKey)}
            subtitle={t(theme.subtitleKey)}
            onPress={() =>
              router.push({
                pathname: "/(root)/(tabs)/coran/hadiths/theme/[id]",
                params: { id: theme.id },
              })
            }
          />
        ))}
      </ScrollView>
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
    marginBottom: 8,
  },
});
