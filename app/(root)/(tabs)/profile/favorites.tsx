import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useDuaFavorites } from "@/lib/dua";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";

const H_PADDING = SCREEN_EDGE_PADDING;
const ICON_COLOR = "#191D31";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { favorites, refetch } = useDuaFavorites();

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.favoritesTitle")}
          subtitle={t("screens.favoritesSubtitle")}
          onBack={() => router.back()}
        />

        {favorites.length === 0 ? (
          <View style={styles.empty}>
            <AppIcon name="heart" size={48} color={TEXT_MUTED} />
            <Text style={styles.emptyText}>
              Aucune invocation en favori. Ajoutez-en depuis la section Invocations.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => `${item.categorySlug}-${item.duaId}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() =>
                  router.push({
                    pathname: "/(root)/(tabs)/coran/invocations/dua/[slug]/[id]",
                    params: { slug: item.categorySlug, id: String(item.duaId) },
                  })
                }
                activeOpacity={0.7}
              >
                <AppIcon name="book-open" size={22} color={ICON_COLOR} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.rowSubtitle} numberOfLines={1}>
                    {item.translation || item.arabic || ""}
                  </Text>
                </View>
                <AppIcon name="chevron-right" size={20} color={ICON_COLOR} />
              </TouchableOpacity>
            )}
          />
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
  },
  placeholder: { width: 44 },
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
  rowSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
  },
});
