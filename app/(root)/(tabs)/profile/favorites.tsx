import { FlatList, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router, useFocusEffect } from "expo-router";

import { useCallback } from "react";



import { AppIcon } from "@/components/AppIcon";

import { ListRow } from "@/components/ListRow";

import { ScreenBackground } from "@/components/ScreenBackground";

import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";

import { ScreenPageHeader } from "@/components/ScreenPageHeader";

import { useTranslation } from "@/lib/i18n";

import { useAppTheme } from "@/lib/app-theme";

import {

  useUnifiedFavorites,

  type UnifiedFavoriteKind,

} from "@/lib/favorites/useUnifiedFavorites";

const H_PADDING = SCREEN_EDGE_PADDING;



function kindIcon(kind: UnifiedFavoriteKind) {

  switch (kind) {

    case "dua":

      return "book-open" as const;

    case "hadith":

      return "file-text" as const;

    case "quran":

      return "bookmark" as const;

  }

}



function kindLabel(

  kind: UnifiedFavoriteKind,

  t: (key: string) => string

): string {

  switch (kind) {

    case "dua":

      return t("favorites.kindDua");

    case "hadith":

      return t("favorites.kindHadith");

    case "quran":

      return t("favorites.kindQuran");

  }

}



export default function FavoritesScreen() {

  const { t } = useTranslation();

  const colors = useAppTheme();

  const { items, loading, refetch } = useUnifiedFavorites();



  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));



  return (

    <ScreenBackground style={styles.background}>

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>

        <ScreenPageHeader

          title={t("screens.favoritesTitle")}

          subtitle={t("screens.favoritesSubtitle")}

          onBack={() => router.back()}

        />



        {!loading && items.length === 0 ? (

          <View style={styles.empty}>

            <AppIcon name="heart" size={48} color={colors.iconMuted} />

            <Text style={[styles.emptyText, { color: colors.textMuted }]}>

              {t("favorites.empty")}

            </Text>

          </View>

        ) : (

          <FlatList

            data={items}

            keyExtractor={(item) => item.id}

            contentContainerStyle={styles.listContent}

            renderItem={({ item }) => (

              <ListRow

                icon={kindIcon(item.kind)}

                title={item.title}

                subtitle={`${kindLabel(item.kind, t)}${item.subtitle ? ` · ${item.subtitle}` : ""}`}

                onPress={() =>

                  router.push({

                    pathname: item.route as never,

                    params: item.params as never,

                  })

                }

              />

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

  listContent: { paddingHorizontal: H_PADDING, paddingBottom: 120 },

  empty: {

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 40,

  },

  emptyText: {

    fontSize: 15,

    fontFamily: "PlusJakartaSans-Regular",

    textAlign: "center",

    marginTop: 16,

    lineHeight: 22,

  },

});

