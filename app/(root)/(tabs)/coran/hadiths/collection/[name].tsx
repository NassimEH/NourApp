import {
  ImageBackground,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
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

const homeBackground = require("@/assets/images/home-background.png");
const H_PADDING = 24;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

function getBookDisplayName(book: HadithBook, preferFr = true): string {
  const fr = book.book?.find((b) => b.lang === "fr");
  const en = book.book?.find((b) => b.lang === "en");
  if (preferFr && fr?.name) return fr.name;
  return en?.name ?? fr?.name ?? `Livre ${book.bookNumber}`;
}

export default function HadithsBooksScreen() {
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
    ? getCollectionDisplayName(collection, "en")
    : collectionName ?? "Livre";

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
    <ImageBackground
      source={homeBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={26} color={ICON_COLOR} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {collectionDisplayName}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {loading && books.length === 0 ? (
          <HadithListSkeleton />
        ) : error && books.length === 0 ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={styles.retryBtn}
              activeOpacity={0.8}
            >
              <Feather name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.searchWrap}>
              <Feather
                name="search"
                size={18}
                color={TEXT_MUTED}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un livre…"
                placeholderTextColor={TEXT_MUTED}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  hitSlop={12}
                >
                  <Feather name="x" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.bookNumber}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Aucun livre trouvé</Text>
                </View>
              }
              ListFooterComponent={
                canLoadMore ? (
                  <TouchableOpacity
                    style={styles.loadMoreBtn}
                    onPress={handleLoadMore}
                    disabled={loadingMore}
                    activeOpacity={0.8}
                  >
                    {loadingMore ? (
                      <Text style={styles.loadMoreText}>Chargement…</Text>
                    ) : (
                      <>
                        <Feather name="download" size={18} color="#fff" />
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
                  <Feather name="book-open" size={22} color={ICON_COLOR} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle} numberOfLines={2}>
                      {getBookDisplayName(item, true)}
                    </Text>
                    {item.book?.[0]?.numberOfHadith != null && (
                      <Text style={styles.rowPreview}>
                        {item.book[0].numberOfHadith} hadiths
                      </Text>
                    )}
                  </View>
                  <Feather name="chevron-right" size={20} color={ICON_COLOR} />
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </SafeAreaView>
    </ImageBackground>
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
    color: ICON_COLOR,
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
    color: ICON_COLOR,
    padding: 0,
  },
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
    color: ICON_COLOR,
  },
  rowPreview: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
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
    color: ICON_COLOR,
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
    backgroundColor: ACCENT,
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
    color: TEXT_MUTED,
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
    backgroundColor: ACCENT,
    alignSelf: "center",
  },
  loadMoreText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
});
