import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useMemo, useState } from "react";

import { useChapters, getCollectionDisplayName } from "@/lib/hadith";
import { HadithListSkeleton } from "@/components/hadith/HadithListSkeleton";
import type { HadithChapter } from "@/lib/hadith/types";
import { useCollections } from "@/lib/hadith/hooks/useCollections";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";

const H_PADDING = SCREEN_EDGE_PADDING;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

function getChapterDisplayName(ch: HadithChapter, preferFr = true): string {
  const fr = ch.chapter?.find((c) => c.lang === "fr");
  const en = ch.chapter?.find((c) => c.lang === "en");
  const num = (preferFr ? fr?.chapterNumber : en?.chapterNumber) ?? en?.chapterNumber ?? ch.chapterId;
  const title = (preferFr ? fr?.chapterTitle : en?.chapterTitle) ?? en?.chapterTitle ?? "";
  return title ? `${num} – ${title}` : `Chapitre ${ch.chapterId}`;
}

export default function HadithsChaptersScreen() {
  const { t } = useTranslation();
  const { name, number } = useLocalSearchParams<{
    name: string;
    number: string;
  }>();
  const collectionName = name ? decodeURIComponent(name) : null;
  const bookNumber = number ? decodeURIComponent(number) : null;
  const { collections } = useCollections();
  const { chapters, loading, error, refetch } = useChapters(
    collectionName,
    bookNumber
  );
  const [search, setSearch] = useState("");

  const collection = useMemo(
    () => collections.find((c) => c.name === collectionName),
    [collections, collectionName]
  );
  const collectionDisplayName = collection
    ? getCollectionDisplayName(collection, "en")
    : collectionName ?? "Chapitres";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter((ch) =>
      getChapterDisplayName(ch, true).toLowerCase().includes(q)
    );
  }, [chapters, search]);

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={collectionDisplayName}
          subtitle={t("screens.hadithCollectionSubtitle")}
          onBack={() => router.back()}
        />

        {loading && chapters.length === 0 ? (
          <HadithListSkeleton />
        ) : error && chapters.length === 0 ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={styles.retryBtn}
              activeOpacity={0.8}
            >
              <AppIcon name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.searchWrap}>
              <AppIcon
                name="search"
                size={18}
                color={TEXT_MUTED}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un chapitre…"
                placeholderTextColor={TEXT_MUTED}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  hitSlop={12}
                >
                  <AppIcon name="x" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => `${item.bookNumber}-${item.chapterId}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>
                    Aucun chapitre trouvé
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/(root)/(tabs)/coran/hadiths/collection/[name]/book/[number]/chapter/[chapterId]",
                      params: {
                        name: collectionName ?? "",
                        number: bookNumber ?? "",
                        chapterId: item.chapterId,
                      },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <AppIcon name="file-text" size={22} color={ICON_COLOR} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle} numberOfLines={2}>
                      {getChapterDisplayName(item, true)}
                    </Text>
                  </View>
                  <AppIcon name="chevron-right" size={20} color={ICON_COLOR} />
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
});
