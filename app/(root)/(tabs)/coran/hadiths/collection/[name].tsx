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
  useBooks,
  useChapters,
  getCollectionDisplayName,
  loadMoreCollectionHadiths,
  canLoadMoreHadiths,
} from "@/lib/hadith";
import { HadithListSkeleton } from "@/components/hadith/HadithListSkeleton";
import type { HadithBook } from "@/lib/hadith/types";
import { useCollections } from "@/lib/hadith/hooks/useCollections";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { ScreenSearchBar, screenSearchBarSpacing } from "@/components/ScreenSearchBar";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";

const H_PADDING = SCREEN_EDGE_PADDING;

function getBookDisplayName(book: HadithBook, preferFr = true): string {
  const fr = book.book?.find((b) => b.lang === "fr");
  const en = book.book?.find((b) => b.lang === "en");
  if (preferFr && fr?.name) return fr.name;
  return en?.name ?? fr?.name ?? `Livre ${book.bookNumber}`;
}

export default function HadithsBooksScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const { name } = useLocalSearchParams<{ name: string }>();
  const collectionName = name ? decodeURIComponent(name) : null;
  const { collections } = useCollections();
  const { books, loading, error, refetch } = useBooks(collectionName);
  const firstBookNumber = books[0]?.bookNumber ?? null;
  const { chapters } = useChapters(collectionName, firstBookNumber);
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
    : collectionName ?? t("screens.hadithsTitle");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) =>
      getBookDisplayName(b, true).toLowerCase().includes(q)
    );
  }, [books, search]);

  const goToBookOrHadiths = (item: HadithBook) => {
    const hasOneChapter = chapters.length === 1 && firstBookNumber === item.bookNumber;
    if (hasOneChapter && chapters[0]) {
      router.push({
        pathname:
          "/(root)/(tabs)/coran/hadiths/collection/[name]/book/[number]/chapter/[chapterId]",
        params: {
          name: collectionName ?? "",
          number: item.bookNumber,
          chapterId: chapters[0].chapterId,
        },
      });
    } else {
      router.push({
        pathname:
          "/(root)/(tabs)/coran/hadiths/collection/[name]/book/[number]",
        params: { name: collectionName ?? "", number: item.bookNumber },
      });
    }
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={collectionDisplayName}
          subtitle={t("screens.hadithCollectionSubtitle")}
          onBack={() => router.back()}
        />

        {loading && books.length === 0 ? (
          <HadithListSkeleton />
        ) : error && books.length === 0 ? (
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
              keyExtractor={(item) => item.bookNumber}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    {t("library.searchNoResults")}
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
                  onPress={() => goToBookOrHadiths(item)}
                  activeOpacity={0.7}
                >
                  <AppIcon name="book-open" size={22} color={colors.icon} />
                  <View style={styles.rowText}>
                    <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={2}>
                      {getBookDisplayName(item, true)}
                    </Text>
                    {item.book?.[0]?.numberOfHadith != null && (
                      <Text style={[styles.rowPreview, { color: colors.textMuted }]}>
                        {t("library.hadithCount", { count: item.book[0].numberOfHadith })}
                      </Text>
                    )}
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
  listContent: { paddingHorizontal: H_PADDING, paddingBottom: 120 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
  },
  rowPreview: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 2,
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
