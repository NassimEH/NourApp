import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useMemo, useState } from "react";

import { useCollections, getCollectionDisplayName } from "@/lib/hadith";
import { ListRow } from "@/components/ListRow";
import { HadithCollectionSkeleton } from "@/components/hadith/HadithCollectionSkeleton";
import { ScreenSearchBar, screenSearchBarSpacing } from "@/components/ScreenSearchBar";
import type { HadithCollection } from "@/lib/hadith/types";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";

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
  const colors = useAppTheme();
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
          <View style={styles.errorWrap}>
            <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={[styles.retryBtn, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <AppIcon name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.retryText}>{t("home.retry")}</Text>
            </TouchableOpacity>
          </View>
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
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    {t("library.searchNoResults")}
                  </Text>
                </View>
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
  errorWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
  empty: { paddingVertical: 40, alignItems: "center" },
  emptyText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
  },
});
