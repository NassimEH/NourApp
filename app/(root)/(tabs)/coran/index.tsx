import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import {
  LibrarySection,
  LibrarySectionDivider,
  type LibraryEntryItem,
} from "@/components/library/LibraryEntry";
import { ScreenBackground } from "@/components/ScreenBackground";
import {
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import {
  LIBRARY_CATALOG,
  type LibraryCatalogItem,
  type LibraryRoute,
} from "@/lib/library/catalog";

function pushLibraryRoute(route: LibraryRoute) {
  router.push(`/(root)/(tabs)/coran/${route}` as const);
}

function mapCatalogItems(
  items: LibraryCatalogItem[],
  t: (key: string) => string
): LibraryEntryItem[] {
  return items.map((item) => ({
    id: item.id,
    title: t(item.titleKey),
    subtitle: t(item.shortKey),
    icon: item.icon,
    soon: item.soon,
    disabled: item.disabled,
    invocationSlug: item.invocationSlug,
    hadithCollectionName: item.hadithCollectionName,
  }));
}

export default function BibliothequeScreen() {
  const { t } = useTranslation();

  const sections = useMemo(
    () =>
      LIBRARY_CATALOG.map((section) => ({
        section,
        items: mapCatalogItems(section.items, t),
      })),
    [t]
  );

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
          <LibrarySectionDivider variant="header" />

          {sections.map(({ section, items }, index) => (
            <View key={section.id}>
              {index > 0 ? <LibrarySectionDivider /> : null}
              <LibrarySection
                section={section}
                items={items}
                onPressItem={onPressItem}
                isFirst={index === 0}
              />
            </View>
          ))}
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
    paddingTop: 8,
    paddingBottom: 140,
  },
});
