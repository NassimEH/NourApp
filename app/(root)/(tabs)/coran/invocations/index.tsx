import {
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import {
  useDuaCategories,
  type DuaCategory,
} from "@/lib/dua";
import { ListRow } from "@/components/ListRow";
import { DuaCategorySkeleton } from "@/components/dua/DuaCategorySkeleton";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { ScreenSearchBar, screenSearchBarSpacing } from "@/components/ScreenSearchBar";
import { useTranslation } from "@/lib/i18n";

function filterCategories(list: DuaCategory[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
  );
}

export default function InvocationsCategoriesScreen() {
  const { t } = useTranslation();
  const { categories, loading, error, refetch } = useDuaCategories("fr");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterCategories(categories, search),
    [categories, search]
  );

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.invocationsTitle")}
          subtitle={t("screens.invocationsSubtitle")}
          onBack={() => router.back()}
        />

        {loading && categories.length === 0 ? (
          <DuaCategorySkeleton />
        ) : error && categories.length === 0 ? (
          <ErrorState message={error} onRetry={refetch} retryLabel={t("home.retry")} />
        ) : (
          <>
            <ScreenSearchBar
              value={search}
              onChangeText={setSearch}
              placeholder={t("screens.searchPlaceholder")}
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
                filtered.map((cat) => (
                  <ListRow
                    key={cat.slug}
                    style={styles.row}
                    icon="bookmark"
                    title={cat.name}
                    showChevron
                    onPress={() =>
                      router.push(
                        `/(root)/(tabs)/coran/invocations/category/${encodeURIComponent(cat.slug)}` as const
                      )
                    }
                  />
                ))
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
  listWrap: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SCREEN_EDGE_PADDING,
    paddingBottom: 120,
  },
  row: { paddingVertical: 8 },
});
