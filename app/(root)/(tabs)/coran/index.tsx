import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import {
  LibraryHadithTeaser,
  LibraryHeroCard,
  LibraryShortcutList,
  LibraryToolGrid,
} from "@/components/library/LibraryEntry";
import { HomeSection } from "@/components/home/HomeSection";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import {
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { getHadithLocalizedText } from "@/constants/hadithsJour";
import {
  formatHadithFeaturedDate,
  getHadithDuJour,
} from "@/lib/hadith-du-jour";
import { useTranslation } from "@/lib/i18n";
import {
  LIBRARY_HADITHS_FEATURED,
  LIBRARY_INVOCATIONS_FEATURED,
  LIBRARY_QURAN_HERO,
  LIBRARY_QURAN_TOOLS,
  type LibraryRoute,
} from "@/lib/library/catalog";

function pushLibraryRoute(route: LibraryRoute) {
  router.push(`/(root)/(tabs)/coran/${route}` as const);
}

export default function BibliothequeScreen() {
  const { t, locale } = useTranslation();

  const hadithJour = useMemo(() => getHadithDuJour(), []);
  const hadithBody = getHadithLocalizedText(hadithJour, locale);
  const todayLabel = formatHadithFeaturedDate(new Date(), locale);

  const onPressItem = (
    id: string,
    invocationSlug?: string,
    hadithCollectionName?: string
  ) => {
    if (hadithCollectionName) {
      router.push({
        pathname: "/(root)/(tabs)/coran/hadiths/collection/[name]",
        params: { name: hadithCollectionName },
      });
      return;
    }
    if (invocationSlug) {
      router.push({
        pathname: "/(root)/(tabs)/coran/invocations/category/[slug]",
        params: { slug: invocationSlug },
      });
      return;
    }
    pushLibraryRoute(id as LibraryRoute);
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.libraryTitle")}
          subtitle={t("screens.librarySubtitle")}
          style={screenPageHeaderSpacing}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HomeSection
            title={t("library.sectionQuran")}
            seeAllLabel={t("library.seeAll")}
            onSeeAll={() => pushLibraryRoute("sourates")}
            isFirst
          >
            <LibraryHeroCard
              item={LIBRARY_QURAN_HERO}
              onPressItem={onPressItem}
            />
            <LibraryToolGrid
              items={LIBRARY_QURAN_TOOLS}
              onPressItem={onPressItem}
            />
          </HomeSection>

          <HomeSection
            title={t("library.sectionInvocations")}
            seeAllLabel={t("library.seeAll")}
            onSeeAll={() => pushLibraryRoute("invocations")}
          >
            <LibraryToolGrid
              items={LIBRARY_INVOCATIONS_FEATURED}
              onPressItem={onPressItem}
            />
          </HomeSection>

          <HomeSection
            title={t("library.sectionHadiths")}
            seeAllLabel={t("library.seeAll")}
            onSeeAll={() => pushLibraryRoute("hadiths")}
          >
            <LibraryHadithTeaser
              title={t("library.hadithDay")}
              badge={todayLabel}
              body={hadithBody}
              source={hadithJour.source}
              onPress={() => pushLibraryRoute("hadith-jour")}
            />
            <LibraryShortcutList
              items={LIBRARY_HADITHS_FEATURED}
              onPressItem={onPressItem}
            />
          </HomeSection>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  scrollContent: {
    ...screenScrollContent,
    paddingTop: 4,
    paddingBottom: 140,
  },
});
