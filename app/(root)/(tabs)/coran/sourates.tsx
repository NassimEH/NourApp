import {
  FlatList,
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

import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { useRandomAyah } from "@/lib/quran/hooks/useRandomAyah";
import type { SuraMeta } from "@/lib/quran/types";
import { SuraRow } from "@/components/quran/SuraRow";
import { SuraListSkeleton } from "@/components/quran/SuraListSkeleton";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { bodyLineHeight } from "@/lib/ui/typography";
import { useTranslation } from "@/lib/i18n";

const H_PADDING = SCREEN_EDGE_PADDING;

function filterSuras(list: SuraMeta[], query: string): SuraMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      String(s.number) === q
  );
}

export default function SouratesScreen() {
  const { list, loading, error, refetch } = useSuraList();
  const { ayah: randomAyah } = useRandomAyah();
  const [search, setSearch] = useState("");
  const [verseOfDayInArabic, setVerseOfDayInArabic] = useState(false);
  const colors = useAppTheme();
  const typography = useAppTypography();
  const bodyLh = bodyLineHeight(typography.body);
  const { t } = useTranslation();

  const filtered = useMemo(() => filterSuras(list, search), [list, search]);

  const handleSuraPress = (sura: SuraMeta) => {
    router.push(`/(root)/(tabs)/coran/${sura.number}` as const);
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.souratesTitle")}
          subtitle={t("screens.souratesSubtitle")}
          onBack={() => router.back()}
          headerActions={
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/coran/juz")}
              style={styles.juzLink}
              activeOpacity={0.7}
            >
              <AppIcon name="layers" size={22} color={colors.accent} />
              <Text style={[styles.juzLinkText, { color: colors.accent }]}>
                {t("screens.juzTitle")}
              </Text>
            </TouchableOpacity>
          }
        />

        {loading && list.length === 0 ? (
          <SuraListSkeleton />
        ) : error && list.length === 0 ? (
          <View style={styles.errorBlock}>
            <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.accent }]}
              onPress={() => refetch()}
              activeOpacity={0.8}
            >
              <AppIcon name="refresh-cw" size={20} color="#fff" />
              <Text style={styles.retryText}>{t("home.retry")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View
              style={[styles.searchWrap, { borderBottomColor: colors.border }]}
            >
              <AppIcon
                name="search"
                size={18}
                color={colors.textMuted}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Rechercher…"
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

            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.number)}
              ListHeaderComponent={
                randomAyah ? (
                  <View
                    style={[styles.verseOfDayBlock, { borderTopColor: colors.border }]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push(
                          `/(root)/(tabs)/coran/${randomAyah.suraNumber}` as const
                        )
                      }
                    >
                      <Text
                        style={[styles.verseOfDayLabel, { color: colors.accent }]}
                      >
                        Verset du jour
                      </Text>
                      <Text
                        style={[
                          styles.verseOfDayText,
                          {
                            color: colors.text,
                            lineHeight: bodyLh,
                          },
                          verseOfDayInArabic && styles.verseOfDayTextRtl,
                        ]}
                        numberOfLines={4}
                      >
                        {verseOfDayInArabic
                          ? randomAyah.textAr
                          : randomAyah.textFr || randomAyah.textAr}
                      </Text>
                      <Text
                        style={[styles.verseOfDayRef, { color: colors.textMuted }]}
                      >
                        Sourate {randomAyah.suraNumber}, verset {randomAyah.ayahNumber}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.verseOfDayToggle}
                      onPress={() => setVerseOfDayInArabic((v) => !v)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.verseOfDayToggleText, { color: colors.accent }]}
                      >
                        {verseOfDayInArabic ? "Voir en français" : "Voir en arabe"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <SuraRow sura={item} onPress={() => handleSuraPress(item)} />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    Aucune sourate trouvée
                  </Text>
                </View>
              }
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
  juzLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  juzLinkText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: H_PADDING,
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    padding: 0,
  },
  verseOfDayBlock: {
    paddingTop: 20,
    marginBottom: 20,
    borderTopWidth: 1,
    gap: 8,
  },
  verseOfDayLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  verseOfDayText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
  },
  verseOfDayRef: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    fontStyle: "italic",
  },
  verseOfDayTextRtl: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  verseOfDayToggle: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  verseOfDayToggleText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 120,
  },
  errorBlock: {
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
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
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
