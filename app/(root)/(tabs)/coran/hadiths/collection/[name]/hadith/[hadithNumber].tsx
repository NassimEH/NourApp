import {
  ActivityIndicator,
  ImageBackground,
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
import Feather from "@expo/vector-icons/Feather";
import { useCallback, useMemo } from "react";

import {
  useHadithDetail,
  useHadithLanguage,
  useHadithFavorites,
  getCollectionDisplayName,
} from "@/lib/hadith";
import { useAppPreferences } from "@/lib/app-preferences";
import type { HadithRecord } from "@/lib/hadith/types";
import { useCollections } from "@/lib/hadith/hooks/useCollections";

const homeBackground = require("@/assets/images/home-background.png");
const H_PADDING = 24;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

const ARABIC_SIZE_MAP = { small: 20, medium: 24, large: 28 } as const;
const TRANS_SIZE_MAP = { small: 14, medium: 16, large: 18 } as const;

export default function HadithDetailScreen() {
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
  const { textSize } = useAppPreferences();
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

  const arabicSize = ARABIC_SIZE_MAP[textSize];
  const transSize = TRANS_SIZE_MAP[textSize];

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
    <ImageBackground
      source={homeBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={26} color={ICON_COLOR} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            Hadith {hadithNum}
          </Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.langBtn}
              onPress={() => setLanguage(language === "fr" ? "en" : "fr")}
              activeOpacity={0.7}
            >
              <Text style={styles.langBtnText}>
                {language === "fr" ? "EN" : "FR"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFavorite}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Feather
                name="heart"
                size={22}
                color={isFav ? ACCENT : ICON_COLOR}
                fill={isFav ? ACCENT : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Feather name="share-2" size={22} color={ICON_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCopy}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Feather name="copy" size={22} color={ICON_COLOR} />
            </TouchableOpacity>
          </View>
        </View>

        {loading && !hadith ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={ACCENT} />
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
            <View style={styles.metaCard}>
              <Text style={styles.metaTitle}>
                {collectionDisplayName} · Hadith {hadith.hadithNumber}
              </Text>
              {hadith.hadith?.[0]?.chapterTitle ? (
                <Text style={styles.metaSubtitle}>
                  {hadith.hadith[0].chapterTitle}
                </Text>
              ) : null}
            </View>

            {arabicBody ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>Texte arabe</Text>
                <Text
                  style={[
                    styles.arabicText,
                    {
                      fontSize: arabicSize,
                      lineHeight: arabicSize * 1.7,
                    },
                  ]}
                  selectable
                >
                  {arabicBody}
                </Text>
              </View>
            ) : null}

            {displayTranslation ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>
                  Traduction {language === "fr" ? "FR" : "EN"}
                </Text>
                <Text
                  style={[styles.translationText, { fontSize: transSize }]}
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
    flex: 1,
    fontSize: 18,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ICON_COLOR,
    textAlign: "center",
    marginHorizontal: 8,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  langBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  langBtnText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ACCENT,
  },
  iconBtn: { padding: 8 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: H_PADDING, paddingBottom: 100 },
  metaCard: {
    backgroundColor: "rgba(61, 107, 71, 0.08)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
  },
  metaTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ICON_COLOR,
  },
  metaSubtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
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
    color: "rgba(61, 107, 71, 0.9)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  arabicText: {
    fontFamily: "PlusJakartaSans-Regular",
    color: ICON_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  translationText: {
    fontFamily: "PlusJakartaSans-Regular",
    color: ICON_COLOR,
    lineHeight: 24,
  },
  gradeText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
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
    color: TEXT_MUTED,
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
    color: TEXT_MUTED,
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
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: ACCENT,
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
    color: ACCENT,
  },
});
