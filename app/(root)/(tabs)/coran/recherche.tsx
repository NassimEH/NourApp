import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SuraRow } from "@/components/quran/SuraRow";
import { screenScrollContent } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import type { SuraMeta } from "@/lib/quran/types";

function filterSuras(list: SuraMeta[], query: string): SuraMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const asNum = parseInt(q, 10);
  return list.filter((sura) => {
    if (!Number.isNaN(asNum) && sura.number === asNum) return true;
    return (
      sura.name.toLowerCase().includes(q) ||
      sura.englishName.toLowerCase().includes(q) ||
      sura.englishNameTranslation.toLowerCase().includes(q) ||
      String(sura.number).includes(q)
    );
  });
}

export default function RechercheCoranScreen() {
  const [query, setQuery] = useState("");
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const colors = useAppTheme();
  const { list, loading } = useSuraList();

  const results = useMemo(() => filterSuras(list, query), [list, query]);
  const showHint = query.trim().length === 0;
  const showEmpty = query.trim().length > 0 && results.length === 0 && !loading;

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.searchTitle")}
          subtitle={t("screens.searchSubtitle")}
          onBack={() => router.back()}
        />
        <ScrollView
          style={[styles.scroll, rtlViewStyle]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.searchWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <AppIcon name="search" size={20} color={colors.iconMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={query}
              onChangeText={setQuery}
              placeholder={t("screens.searchSuraPlaceholder")}
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              autoCorrect={false}
            />
          </View>

          {showHint ? (
            <Text style={[styles.hint, rtlTextStyle, { color: colors.textMuted }]}>
              {t("screens.searchSuraHint")}
            </Text>
          ) : null}

          {showEmpty ? (
            <Text style={[styles.hint, rtlTextStyle, { color: colors.textMuted }]}>
              {t("library.searchNoResults")}
            </Text>
          ) : null}

          {results.map((sura) => (
            <SuraRow
              key={sura.number}
              sura={sura}
              onPress={() =>
                router.push({
                  pathname: "/(root)/(tabs)/coran/[number]",
                  params: { number: String(sura.number) },
                })
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  content: { ...screenScrollContent, paddingTop: 8, paddingBottom: 40 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    paddingVertical: 0,
  },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 20,
    marginBottom: 8,
  },
});
