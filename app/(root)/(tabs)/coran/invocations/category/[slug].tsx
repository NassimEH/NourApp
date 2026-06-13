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
import { useMemo, useState } from "react";

import { useCategoryDuas, getCategoryDisplayNameBySlug } from "@/lib/dua";
import { DuaListSkeleton } from "@/components/dua/DuaListSkeleton";
import type { DuaItem } from "@/lib/dua/types";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { ScreenSearchBar, screenSearchBarSpacing } from "@/components/ScreenSearchBar";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";

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
  const colors = useAppTheme();
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
              placeholder={t("screens.searchPlaceholder")}
              containerStyle={screenSearchBarSpacing}
            />

            <FlatList
              data={filtered}
              keyExtractor={(item) => `${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    {t("library.searchNoResults")}
                  </Text>
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
                  <AppIcon name="book-open" size={22} color={colors.icon} />
                  <View style={styles.rowText}>
                    <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.rowPreview, { color: colors.textMuted }]} numberOfLines={1}>
                      {item.translation || item.arabic || item.latin || categoryName}
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
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    flex: 1,
    textAlign: "center",
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
});
