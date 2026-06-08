import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import { ListRow } from "@/components/ListRow";
import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { getCollectionDisplayName, useCollections } from "@/lib/hadith";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

export default function HadithsThemeScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const { collections, loading, error } = useCollections();

  return (
    <ScreenStackLayout
      title={t("screens.hadithsThemeTitle")}
      subtitle={t("screens.hadithsThemeSubtitle")}
    >
      <Text style={[styles.intro, { color: colors.textMuted }]}>
        {t("screens.hadithThemesIntro")}
      </Text>

      {loading && collections.length === 0 ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : null}

      {error && collections.length === 0 ? (
        <Text style={[styles.error, { color: colors.textMuted }]}>{error}</Text>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        {collections.map((collection) => (
          <ListRow
            key={collection.name}
            icon="book-open"
            title={getCollectionDisplayName(collection, "fr")}
            subtitle={t("screens.hadithCollectionSubtitle")}
            onPress={() =>
              router.push({
                pathname: "/(root)/(tabs)/coran/hadiths/collection/[name]",
                params: { name: encodeURIComponent(collection.name) },
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
  loader: { marginVertical: 24 },
  error: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    marginBottom: 12,
  },
});
