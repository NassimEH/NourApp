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

import { useCategoryDuas, useDuaLanguage, getCategoryDisplayNameBySlug } from "@/lib/dua";
import { DuaListSkeleton } from "@/components/dua/DuaListSkeleton";
import type { DuaItem } from "@/lib/dua/types";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";

import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";

const H_PADDING = SCREEN_EDGE_PADDING;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

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
  const { language, setLanguage } = useDuaLanguage();
  const { duas, loading, error, refetch } = useCategoryDuas(decodedSlug, language);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => filterDuas(duas, search), [duas, search]);

  const categoryName =
    decodedSlug && language
      ? getCategoryDisplayNameBySlug(decodedSlug, language)
      : "Invocations";

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={categoryName}
          subtitle={t("screens.invocationCategorySubtitle")}
          onBack={() => router.back()}
          headerActions={
            <TouchableOpacity
              style={styles.langBtn}
              onPress={() => setLanguage(language === "fr" ? "en" : "fr")}
              activeOpacity={0.7}
            >
              <Text style={styles.langBtnText}>
                {language === "fr" ? "English" : "Français"}
              </Text>
            </TouchableOpacity>
          }
        />

        {loading && duas.length === 0 ? (
          <DuaListSkeleton />
        ) : error && duas.length === 0 ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn} activeOpacity={0.8}>
              <AppIcon name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.searchWrap}>
              <AppIcon name="search" size={18} color={TEXT_MUTED} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher…"
                placeholderTextColor={TEXT_MUTED}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} hitSlop={12}>
                  <AppIcon name="x" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => `${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Aucune invocation trouvée</Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() =>
                    router.push({
                      pathname: "/(root)/(tabs)/coran/invocations/dua/[slug]/[id]",
                      params: { slug: decodedSlug ?? "", id: String(item.id) },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <AppIcon name="book-open" size={22} color={ICON_COLOR} />
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.rowPreview} numberOfLines={1}>
                      {item.translation || item.arabic || item.latin || categoryName}
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
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    flex: 1,
    textAlign: "center",
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
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 120,
  },
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
});
