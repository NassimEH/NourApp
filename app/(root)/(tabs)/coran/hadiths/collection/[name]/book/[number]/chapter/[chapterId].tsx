import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useCallback, useMemo, useState } from "react";

import {
  useHadithsByChapter,
  getCollectionDisplayName,
  loadMoreCollectionHadiths,
  canLoadMoreHadiths,
} from "@/lib/hadith";
import { HadithListSkeleton } from "@/components/hadith/HadithListSkeleton";
import type { HadithRecord } from "@/lib/hadith/types";
import { useCollections } from "@/lib/hadith/hooks/useCollections";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { ScreenSearchBar, screenSearchBarSpacing } from "@/components/ScreenSearchBar";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";

const H_PADDING = SCREEN_EDGE_PADDING;

function getHadithPreview(record: HadithRecord): string {
  const en = record.hadith?.find((h) => h.lang === "en");
  const fr = record.hadith?.find((h) => h.lang === "fr");
  const ar = record.hadith?.find((h) => h.lang === "ar");
  const body = en?.body ?? fr?.body ?? ar?.body ?? "";
  return body.length > 80 ? `${body.slice(0, 80)}…` : body;
}

export default function HadithsListScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const { name, number, chapterId } = useLocalSearchParams<{
    name: string;
    number: string;
    chapterId: string;
  }>();
  const collectionName = name ? decodeURIComponent(name) : null;
  const bookNumber = number ? decodeURIComponent(number) : null;
  const chapterIdDecoded = chapterId ? decodeURIComponent(chapterId) : null;
  const { collections } = useCollections();
  const { hadiths, loading, error, refetch } = useHadithsByChapter(
    collectionName,
    bookNumber,
    chapterIdDecoded
  );
  const [search, setSearch] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const canLoadMore = collectionName ? canLoadMoreHadiths(collectionName) : false;

  const handleLoadMore = useCallback(async () => {
    if (!collectionName || loadingMore || !canLoadMore) return;
    setLoadingMore(true);
    try {
      await loadMoreCollectionHadiths(collectionName, 10);
      await refetch();
    } finally {
      setLoadingMore(false);
    }
  }, [collectionName, loadingMore, canLoadMore, refetch]);

  const collection = useMemo(
    () => collections.find((c) => c.name === collectionName),
    [collections, collectionName]
  );
  const collectionDisplayName = collection
    ? getCollectionDisplayName(collection, "fr")
    : collectionName ?? "Hadiths";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hadiths;
    return hadiths.filter(
      (h) =>
        h.hadithNumber.toLowerCase().includes(q) ||
        getHadithPreview(h).toLowerCase().includes(q)
    );
  }, [hadiths, search]);

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={collectionDisplayName}
          subtitle={t("screens.hadithChapterSubtitle")}
          onBack={() => router.back()}
        />

        {loading && hadiths.length === 0 ? (
          <HadithListSkeleton />
        ) : error && hadiths.length === 0 ? (
          <View style={styles.errorWrap}>
            <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={[styles.retryBtn, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <AppIcon name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.retryText}>Réessayer</Text>
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

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.hadithNumber}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    Aucun hadith trouvé
                  </Text>
                </View>
              }
              ListFooterComponent={
                canLoadMore ? (
                  <TouchableOpacity
                    style={[styles.loadMoreBtn, { backgroundColor: colors.accent }]}
                    onPress={handleLoadMore}
                    disabled={loadingMore}
                    activeOpacity={0.8}
                  >
                    {loadingMore ? (
                      <Text style={styles.loadMoreText}>Chargement…</Text>
                    ) : (
                      <>
                        <AppIcon name="download" size={18} color="#fff" />
                        <Text style={styles.loadMoreText}>
                          Charger plus de hadiths
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : null
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/(root)/(tabs)/coran/hadiths/collection/[name]/hadith/[hadithNumber]",
                      params: {
                        name: collectionName ?? "",
                        hadithNumber: item.hadithNumber,
                      },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <View style={[styles.numberBadge, { backgroundColor: colors.accentSurface }]}>
                    <Text style={[styles.numberText, { color: colors.accent }]}>
                      {item.hadithNumber}
                    </Text>
                  </View>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowPreview, { color: colors.text }]} numberOfLines={2}>
                      {getHadithPreview(item)}
                    </Text>
                  </View>
                  <AppIcon name="chevron-right" size={20} color={colors.iconMuted} />
                </TouchableOpacity>
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
    flex: 1,
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center",
  },
  headerRight: { width: 42 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: H_PADDING,
    marginBottom: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    padding: 0,
  },
  listContent: { paddingHorizontal: H_PADDING, paddingBottom: 120 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  numberBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(61, 107, 71, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  rowText: { flex: 1 },
  rowPreview: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
  },
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
  loadMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "center",
  },
  loadMoreText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
});
