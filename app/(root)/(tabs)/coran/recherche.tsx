import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import {
  ScreenSearchBar,
  screenSearchBarSpacing,
} from "@/components/ScreenSearchBar";
import { SuraRow } from "@/components/quran/SuraRow";
import { screenScrollContent } from "@/constants/screen-layout";
import { useAppPreferences } from "@/lib/app-preferences";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import {
  searchVerses,
  type VerseSearchResult,
} from "@/lib/quran/searchVerses";
import { filterSurasByQuery } from "@/lib/quran/searchSuras";

export default function RechercheCoranScreen() {
  const [query, setQuery] = useState("");
  const [verses, setVerses] = useState<VerseSearchResult[]>([]);
  const [verseLoading, setVerseLoading] = useState(false);
  const [verseError, setVerseError] = useState(false);
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const { locale } = useAppPreferences();
  const colors = useAppTheme();
  const { list, loading } = useSuraList();
  const trimmedQuery = query.trim();
  const canSearchVerses = trimmedQuery.length >= 3;
  const suras = useMemo(() => filterSurasByQuery(list, query), [list, query]);
  const visibleVerses = canSearchVerses ? verses : [];
  const visibleVerseLoading = canSearchVerses ? verseLoading : false;
  const visibleVerseError = canSearchVerses ? verseError : false;

  useEffect(() => {
    if (!canSearchVerses) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setVerseLoading(true);
      setVerseError(false);
      void searchVerses(trimmedQuery, locale, controller.signal)
        .then(setVerses)
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === "AbortError") return;
          setVerses([]);
          setVerseError(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setVerseLoading(false);
        });
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [canSearchVerses, locale, trimmedQuery]);

  const openSura = (number: number) =>
    router.push({
      pathname: "/(root)/(tabs)/coran/[number]",
      params: { number: String(number) },
    });

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.searchTitle")}
          subtitle={t("screens.searchSubtitle")}
          onBack={() => router.back()}
        />
        <ScreenSearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t("screens.searchVersesHint")}
          containerStyle={screenSearchBarSpacing}
        />

        <ScrollView
          style={[styles.scroll, rtlViewStyle]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {trimmedQuery.length === 0 ? (
            <Text style={[styles.hint, rtlTextStyle, { color: colors.textMuted }]}>
              {t("screens.searchVersesHint")}
            </Text>
          ) : null}

          {trimmedQuery.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, rtlTextStyle, { color: colors.text }]}>
                {t("screens.searchSurasSection")}
              </Text>
              {!loading && suras.length === 0 ? (
                <Text style={[styles.hint, rtlTextStyle, { color: colors.textMuted }]}>
                  {t("library.searchNoResults")}
                </Text>
              ) : null}
              {suras.map((sura) => (
                <SuraRow key={sura.number} sura={sura} onPress={() => openSura(sura.number)} />
              ))}
            </>
          ) : null}

          {trimmedQuery.length >= 3 ? (
            <>
              <Text style={[styles.sectionTitle, rtlTextStyle, { color: colors.text }]}>
                {t("screens.searchVersesSection")}
              </Text>
              {visibleVerseLoading ? <ActivityIndicator color={colors.accent} /> : null}
              {visibleVerseError ? (
                <Text style={[styles.hint, rtlTextStyle, { color: colors.danger }]}>
                  {t("common.retry")}
                </Text>
              ) : null}
              {!visibleVerseLoading && !visibleVerseError && visibleVerses.length === 0 ? (
                <Text style={[styles.hint, rtlTextStyle, { color: colors.textMuted }]}>
                  {t("library.searchNoResults")}
                </Text>
              ) : null}
              {visibleVerses.map((verse, index) => (
                <Pressable
                  key={`${verse.surahNumber}-${verse.ayahNumber}-${index}`}
                  onPress={() => openSura(verse.surahNumber)}
                  style={[styles.verseRow, { borderColor: colors.border }]}
                >
                  <Text style={[styles.reference, { color: colors.accent }]}>
                    {verse.surahNumber}:{verse.ayahNumber}
                  </Text>
                  <View style={styles.flex}>
                    <Text
                      numberOfLines={3}
                      style={[styles.verseText, rtlTextStyle, { color: colors.text }]}
                    >
                      {verse.text}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  content: { ...screenScrollContent, paddingTop: 0, paddingBottom: 40 },
  flex: { flex: 1 },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    marginTop: 16,
    marginBottom: 10,
  },
  verseRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reference: { fontSize: 13, fontFamily: "PlusJakartaSans-Bold" },
  verseText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "PlusJakartaSans-Regular",
  },
});
