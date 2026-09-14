import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { useCollections, getCollectionDisplayName } from "@/lib/hadith";
import { ListRow } from "@/components/ListRow";
import { HadithCollectionSkeleton } from "@/components/hadith/HadithCollectionSkeleton";
import { ScreenSearchBar, screenSearchBarSpacing } from "@/components/ScreenSearchBar";
import type { HadithCollection } from "@/lib/hadith/types";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";

function filterCollections(
  list: HadithCollection[],
  query: string,
  getDisplayName: (c: HadithCollection) => string
) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (c) =>
      getDisplayName(c).toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
  );
}

export default function HadithsCollectionsScreen() {
  const { t } = useTranslation();
  const { collections, loading, error, refetch } = useCollections();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      filterCollections(collections, search, (c) => getCollectionDisplayName(c, "fr")),
    [collections, search]
  );

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.hadithsTitle")}
          subtitle={t("screens.hadithsSubtitle")}
          onBack={() => router.back()}
        />

        {loading && collections.length === 0 ? (
          <HadithCollectionSkeleton />
        ) : error && collections.length === 0 ? (
          <ErrorState message={error} onRetry={refetch} retryLabel={t("home.retry")} />
        ) : (
          <>
            <ScreenSearchBar
              value={search}
              onChangeText={setSearch}
              placeholder={t("library.searchCollectionPlaceholder")}
              containerStyle={screenSearchBarSpacing}
            />

            <ScrollView
              style={styles.listWrap}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {filtered.length === 0 ? (
                <EmptyState message={t("library.searchNoResults")} icon="search" />
              ) : (
                <View style={styles.list}>
                  {filtered.map((col) => {
                    const displayName = getCollectionDisplayName(col, "fr");
                    const totalHadith =
                      col.collection?.find((e) => e.lang === "fr")?.totalAvailableHadith ??
                      col.collection?.[0]?.totalAvailableHadith ??
                      col.collection?.[0]?.totalHadith ??
                      0;
                    return (
                      <ListRow
                        key={col.name}
                        icon="book-open"
                        title={displayName}
                        subtitle={t("library.hadithCount", { count: totalHadith })}
                        onPress={() =>
                          router.push({
                            pathname:
                              "/(root)/(tabs)/coran/hadiths/collection/[name]",
                            params: { name: col.name },
                          })
                        }
                        showChevron
                        style={styles.row}
                      />
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  listWrap: { flex: 1 },
  listContent: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingBottom: 120,
  },
  list: { gap: 2 },
  row: { paddingVertical: 8 },
});
