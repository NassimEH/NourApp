import {
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

import { useDuaCategories, useDuaLanguage, getCategoryNameForDisplay } from "@/lib/dua";
import { DuaCategorySkeleton } from "@/components/dua/DuaCategorySkeleton";

const homeBackground = require("@/assets/images/home-background.png");
const H_PADDING = 24;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

function filterCategories(
  list: { name: string; slug: string; description?: string }[],
  query: string,
  getDisplayName: (c: { name: string; slug: string }) => string
) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (c) =>
      getDisplayName(c).toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
  );
}

export default function InvocationsCategoriesScreen() {
  const { language, setLanguage } = useDuaLanguage();
  const { categories, loading, error, refetch } = useDuaCategories(language);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterCategories(categories, search, (c) => getCategoryNameForDisplay(c, language)),
    [categories, search, language]
  );

  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={26} color={ICON_COLOR} />
          </TouchableOpacity>
          <Text style={styles.title}>Invocations</Text>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => setLanguage(language === "fr" ? "en" : "fr")}
            activeOpacity={0.7}
          >
            <Text style={styles.langBtnText}>{language === "fr" ? "English" : "Français"}</Text>
          </TouchableOpacity>
        </View>

        {loading && categories.length === 0 ? (
          <DuaCategorySkeleton />
        ) : error && categories.length === 0 ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn} activeOpacity={0.8}>
              <Feather name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.searchWrap}>
              <Feather name="search" size={18} color={TEXT_MUTED} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une catégorie…"
                placeholderTextColor={TEXT_MUTED}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} hitSlop={12}>
                  <Feather name="x" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.listWrap}>
              {filtered.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Aucune catégorie trouvée</Text>
                </View>
              ) : (
                filtered.map((cat) => (
                  <TouchableOpacity
                    key={cat.slug}
                    style={styles.row}
                    onPress={() =>
                      router.push(
                        `/(root)/(tabs)/coran/invocations/category/${encodeURIComponent(cat.slug)}` as const
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.rowLeft}>
                      <Feather name="bookmark" size={22} color={ICON_COLOR} />
                        <Text style={styles.rowTitle} numberOfLines={1}>
                          {getCategoryNameForDisplay(cat, language)}
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={ICON_COLOR} />
                  </TouchableOpacity>
                ))
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
  langBtn: { paddingVertical: 8, paddingHorizontal: 10 },
  langBtnText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ACCENT,
  },
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
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
