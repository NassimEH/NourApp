import { ScrollView, StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ListRow } from "@/components/ListRow";
import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { COLLECTION_DISPLAY_NAMES } from "@/lib/hadith/api";
import { getHadithThemeById } from "@/lib/hadith/themes";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

function getCollectionLabel(collection: string, lang: "fr" | "en"): string {
  const known = COLLECTION_DISPLAY_NAMES[collection.toLowerCase()];
  if (known) return lang === "en" ? known.en : known.fr;
  return collection;
}

export default function HadithThemeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, locale } = useTranslation();
  const colors = useAppTheme();
  const theme = id ? getHadithThemeById(id) : undefined;
  const lang = locale === "en" ? "en" : "fr";

  if (!theme) {
    return (
      <ScreenStackLayout
        title={t("screens.hadithsThemeTitle")}
        subtitle={t("screens.hadithThemeNotFound")}
      >
        <Text style={[styles.error, { color: colors.textMuted }]}>
          {t("screens.hadithThemeNotFound")}
        </Text>
      </ScreenStackLayout>
    );
  }

  return (
    <ScreenStackLayout
      title={t(theme.titleKey)}
      subtitle={t(theme.subtitleKey)}
    >
      <Text style={[styles.intro, { color: colors.textMuted }]}>
        {t("screens.hadithThemeDetailIntro", { count: theme.refs.length })}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {theme.refs.map((ref) => {
          const collectionLabel = getCollectionLabel(ref.collection, lang);
          return (
            <ListRow
              key={`${ref.collection}-${ref.hadithNumber}`}
              icon="message-circle"
              title={t("screens.hadithThemeRefTitle", {
                collection: collectionLabel,
                number: ref.hadithNumber,
              })}
              subtitle={ref.previewFr}
              onPress={() =>
                router.push({
                  pathname:
                    "/(root)/(tabs)/coran/hadiths/collection/[name]/hadith/[hadithNumber]",
                  params: {
                    name: ref.collection,
                    hadithNumber: ref.hadithNumber,
                  },
                })
              }
            />
          );
        })}
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
  error: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
  },
});
