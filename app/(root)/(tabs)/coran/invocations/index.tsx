import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useMemo, useState } from "react";

import {
  useDuaCategories,
  useDuaLanguage,
  getCategoryNameForDisplay,
  type DuaCategory,
} from "@/lib/dua";
import { ListRow } from "@/components/ListRow";
import { DuaCategorySkeleton } from "@/components/dua/DuaCategorySkeleton";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";

const H_PADDING = SCREEN_EDGE_PADDING;

function filterCategories(
  list: DuaCategory[],
  query: string,
  getDisplayName: (c: DuaCategory) => string
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
  const { t } = useTranslation();
  const colors = useAppTheme();
  const { language } = useDuaLanguage();
  const { categories, loading, error, refetch } = useDuaCategories(language);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterCategories(categories, search, (c) => getCategoryNameForDisplay(c, language)),
    [categories, search, language]
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
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
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
            <View style={styles.searchWrap}>
              <AppIcon name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={t("screens.searchPlaceholder")}
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} hitSlop={12}>
                  <AppIcon name="x" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.listWrap}>
              {filtered.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    {t("library.searchNoResults")}
                  </Text>
                </View>
              ) : (
                filtered.map((cat) => (
                  <ListRow
                    key={cat.slug}
                    style={styles.row}
                    icon="bookmark"
                    title={getCategoryNameForDisplay(cat, language)}
                    showChevron
                    onPress={() =>
                      router.push(
                        `/(root)/(tabs)/coran/invocations/category/${encodeURIComponent(cat.slug)}` as const
                      )
                    }
                  />
                ))
              )}
            </View>
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
  },
  langBtn: { paddingVertical: 8, paddingHorizontal: 10 },
  langBtnText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
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
    padding: 0,
  },
  listWrap: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    paddingBottom: 120,
  },
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
