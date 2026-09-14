import {
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ListRow } from "@/components/ListRow";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { useCategoryDuas, getCategoryDisplayNameBySlug } from "@/lib/dua";
import { DuaListSkeleton } from "@/components/dua/DuaListSkeleton";
import type { DuaItem } from "@/lib/dua/types";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { ScreenSearchBar, screenSearchBarSpacing } from "@/components/ScreenSearchBar";
import { useTranslation } from "@/lib/i18n";

import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";

const H_PADDING = SCREEN_EDGE_PADDING;

function filterDuas(list: DuaItem[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      (d.translation && d.translation.toLowerCase().includes(q)) ||
      (d.arabic && d.arabic.toLowerCase().includes(q))
  );
}

export default function InvocationsCategoryScreen() {
  const { t } = useTranslation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const decodedSlug = slug ? decodeURIComponent(slug) : null;
  const { duas, loading, error, refetch } = useCategoryDuas(decodedSlug, "fr");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => filterDuas(duas, search), [duas, search]);

  const categoryName =
    decodedSlug != null
      ? getCategoryDisplayNameBySlug(decodedSlug, "fr")
      : t("screens.invocationsTitle");

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={categoryName}
          subtitle={t("screens.invocationCategorySubtitle")}
          onBack={() => router.back()}
        />

        {loading && duas.length === 0 ? (
          <DuaListSkeleton />
        ) : error && duas.length === 0 ? (
          <ErrorState message={error} onRetry={refetch} retryLabel={t("common.retry")} />
        ) : (
          <>
            <ScreenSearchBar
              value={search}
              onChangeText={setSearch}
              placeholder={t("screens.searchPlaceholder")}
              containerStyle={screenSearchBarSpacing}
            />

            <FlatList
              data={filtered}
              keyExtractor={(item) => `${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <EmptyState message={t("library.searchNoResults")} icon="search" />
              }
              renderItem={({ item }) => (
                <ListRow
                  icon="book-open"
                  title={item.title}
                  subtitle={item.translation || item.arabic || item.latin || categoryName}
                  onPress={() =>
                    router.push({
                      pathname: "/(root)/(tabs)/coran/invocations/dua/[slug]/[id]",
                      params: { slug: decodedSlug ?? "", id: String(item.id) },
                    })
                  }
                />
              )}
            />
          </>
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  title: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    flex: 1,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 120,
  },
});
