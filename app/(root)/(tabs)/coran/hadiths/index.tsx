import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useMemo, useState } from "react";

import { useCollections, getCollectionDisplayName } from "@/lib/hadith";
import { FeaturedCard } from "@/components/Cards";
import { HadithCollectionSkeleton } from "@/components/hadith/HadithCollectionSkeleton";
import type { HadithCollection } from "@/lib/hadith/types";

const homeBackground = require("@/assets/images/home-background.png");
const H_PADDING = 24;
const GAP = 12;
const { width: screenWidth } = Dimensions.get("window");
const contentWidth = screenWidth - 2 * H_PADDING;
const cardWidth = (contentWidth - GAP) / 2;
const cardHeight = 160;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

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
  const { collections, loading, error, refetch } = useCollections();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      filterCollections(collections, search, (c) =>
        getCollectionDisplayName(c, "en")
      ),
    [collections, search]
  );

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
          <Text style={styles.title}>Hadiths</Text>
          <View style={styles.headerRight} />
        </View>

        {loading && collections.length === 0 ? (
          <HadithCollectionSkeleton />
        ) : error && collections.length === 0 ? (
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
                placeholder="Rechercher une collection…"
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

            <View style={styles.listWrap}>
              {filtered.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>
                    Aucune collection trouvée
                  </Text>
                </View>
              ) : (
                <View style={styles.grid}>
                  {filtered.map((col) => {
                    const displayName = getCollectionDisplayName(col, "fr");
                    const totalHadith =
                      col.collection?.[0]?.totalAvailableHadith ??
                      col.collection?.[0]?.totalHadith ?? 0;
                    const item = {
                      $id: col.name,
                      name: displayName,
                      price: `${totalHadith} hadiths`,
                      image: null as string | null,
                    };
                    return (
                      <FeaturedCard
                        key={col.name}
                        item={item as Parameters<typeof FeaturedCard>[0]["item"]}
                        onPress={() =>
                          router.push({
                            pathname:
                              "/(root)/(tabs)/coran/hadiths/collection/[name]",
                            params: { name: col.name },
                          })
                        }
                        actionLabel="Ouvrir"
                        cardWidth={cardWidth}
                        cardHeight={cardHeight}
                        noMargin
                      />
                    );
                  })}
                </View>
              )}
            </View>
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
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  headerRight: { width: 42 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: H_PADDING,
    marginBottom: 20,
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
  listWrap: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
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
