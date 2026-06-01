import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useCallback, useMemo } from "react";

import {
  useHadithDetail,
  useHadithLanguage,
  useHadithFavorites,
  getCollectionDisplayName,
} from "@/lib/hadith";
import { useAppTypography } from "@/lib/app-typography";
import type { HadithRecord } from "@/lib/hadith/types";
import { useCollections } from "@/lib/hadith/hooks/useCollections";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { bodyLineHeight } from "@/lib/ui/typography";

const H_PADDING = SCREEN_EDGE_PADDING;

export default function HadithDetailScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const { name, hadithNumber } = useLocalSearchParams<{
    name: string;
    hadithNumber: string;
  }>();
  const collectionName = name ? decodeURIComponent(name) : null;
  const hadithNum = hadithNumber ? decodeURIComponent(hadithNumber) : null;
  const { hadith, loading, error, refetch } = useHadithDetail(
    collectionName,
    hadithNum
  );
  const { language, setLanguage } = useHadithLanguage();
  const typography = useAppTypography();
  const { isFavorite, toggleFavorite } = useHadithFavorites();
  const { collections } = useCollections();

  const collection = useMemo(
    () => collections.find((c) => c.name === collectionName),
    [collections, collectionName]
  );
  const collectionDisplayName = collection
    ? getCollectionDisplayName(collection, "en")
    : collectionName ?? "";

  const isFav =
    collectionName != null &&
    hadithNum != null &&
    isFavorite(collectionName, hadithNum);

  const arabicSize = typography.arabic;
  const transSize = typography.translation;
  const transLh = bodyLineHeight(transSize);

  const arabicBody = hadith?.hadith?.find((h) => h.lang === "ar")?.body;
  const frenchBody = hadith?.hadith?.find((h) => h.lang === "fr")?.body;
  const englishBody = hadith?.hadith?.find((h) => h.lang === "en")?.body;
  const displayTranslation =
    language === "fr"
      ? frenchBody ?? englishBody
      : englishBody ?? frenchBody;

  const handleShare = useCallback(() => {
    if (!hadith) return;
    const parts = [arabicBody, displayTranslation].filter(Boolean);
    if (parts.length === 0) return;
    Share.share({
      message: parts.join("\n\n"),
      title: `${collectionDisplayName} - Hadith ${hadith.hadithNumber}`,
    }).catch(() => {});
  }, [hadith, arabicBody, displayTranslation, collectionDisplayName]);

  const handleCopy = useCallback(async () => {
    if (!hadith) return;
    const parts = [arabicBody, displayTranslation].filter(Boolean);
    if (parts.length === 0) return;
    await Clipboard.setStringAsync(parts.join("\n\n"));
    Alert.alert("Copié", "Le texte a été copié dans le presse-papiers.");
  }, [hadith, arabicBody, displayTranslation]);

  const handleFavorite = useCallback(() => {
    if (hadith)
      toggleFavorite(hadith, {
        collectionDisplayName,
        bookName: undefined,
        chapterTitle: hadith.hadith?.[0]?.chapterTitle,
      });
  }, [hadith, collectionDisplayName, toggleFavorite]);

  if (collectionName == null || hadithNum == null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Hadith introuvable</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backLink}
          activeOpacity={0.7}
        >
          <Text style={styles.backLinkText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={`Hadith ${hadithNum}`}
          subtitle={t("screens.hadithDetailSubtitle")}
          onBack={() => router.back()}
          headerActions={
            <>
              <TouchableOpacity
                style={styles.langBtn}
                onPress={() => setLanguage(language === "fr" ? "en" : "fr")}
                activeOpacity={0.7}
              >
                <Text style={[styles.langBtnText, { color: colors.accent }]}>
                  {language === "fr" ? "EN" : "FR"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFavorite}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <AppIcon
                  name="heart"
                  size={22}
                  color={isFav ? colors.accent : colors.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <AppIcon name="share-2" size={22} color={colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCopy}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <AppIcon name="copy" size={22} color={colors.icon} />
              </TouchableOpacity>
            </>
          }
        />

        {loading && !hadith ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Chargement…</Text>
          </View>
        ) : error && !hadith ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={styles.retryBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : hadith ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.metaCard,
                {
                  backgroundColor: `${colors.accent}14`,
                  borderLeftColor: colors.accent,
                },
              ]}
            >
              <Text style={[styles.metaTitle, { color: colors.text }]}>
                {collectionDisplayName} · Hadith {hadith.hadithNumber}
              </Text>
              {hadith.hadith?.[0]?.chapterTitle ? (
                <Text style={[styles.metaSubtitle, { color: colors.textMuted }]}>
                  {hadith.hadith[0].chapterTitle}
                </Text>
              ) : null}
            </View>

            {arabicBody ? (
              <View style={[styles.block, { borderTopColor: colors.border }]}>
                <Text style={[styles.blockLabel, { color: colors.accent }]}>
                  Texte arabe
                </Text>
                <Text
                  style={[
                    styles.arabicText,
                    {
                      fontSize: arabicSize,
                      lineHeight: arabicSize * typography.lineHeightArabic,
                      color: colors.text,
                    },
                  ]}
                  selectable
                >
                  {arabicBody}
                </Text>
              </View>
            ) : null}

            {displayTranslation ? (
              <View style={[styles.block, { borderTopColor: colors.border }]}>
                <Text style={[styles.blockLabel, { color: colors.accent }]}>
                  Traduction {language === "fr" ? "FR" : "EN"}
                </Text>
                <Text
                  style={[
                    styles.translationText,
                    {
                      fontSize: transSize,
                      lineHeight: transLh,
                      color: colors.text,
                    },
                  ]}
                  selectable
                >
                  {displayTranslation}
                </Text>
              </View>
            ) : null}

            {hadith.source ? (
              <View style={styles.sourceBlock}>
                <Text style={styles.blockLabel}>Source</Text>
                <Text style={styles.sourceText} selectable>
                  {hadith.source}
                </Text>
              </View>
            ) : null}

            {hadith.grades?.length ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>Degrés / Notes</Text>
                {hadith.grades.map((g, i) => (
                  <Text
                    key={i}
                    style={styles.gradeText}
                    selectable
                  >{`${g.graded_by ?? ""}: ${g.grade ?? ""}`.trim()}</Text>
                ))}
              </View>
            ) : null}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        ) : null}
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
    flex: 1,
    fontSize: 18,
    fontFamily: "PlusJakartaSans-SemiBold",
    textAlign: "center",
    marginHorizontal: 8,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  langBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  langBtnText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  iconBtn: { padding: 8 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: H_PADDING, paddingBottom: 100 },
  metaCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  metaTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  metaSubtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 4,
  },
  block: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  blockLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  arabicText: {
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "right",
    writingDirection: "rtl",
  },
  translationText: {
    fontFamily: "PlusJakartaSans-Regular",
  },
  gradeText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    fontStyle: "italic",
    marginTop: 4,
  },
  sourceBlock: {
    marginTop: 24,
    paddingTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
  },
  sourceText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    fontStyle: "italic",
  },
  bottomSpacer: { height: 24 },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
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
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backLink: { marginTop: 12 },
  backLinkText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
