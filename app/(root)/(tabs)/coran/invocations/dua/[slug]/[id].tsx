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
import { useCallback } from "react";

import { useDuaDetail, useDuaFavorites, useDuaLanguage } from "@/lib/dua";
import type { DuaDetail } from "@/lib/dua/types";
import { useAppPreferences } from "@/lib/app-preferences";

const homeBackground = require("@/assets/images/home-background.png");
const H_PADDING = 24;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

const SIZE_MAP = { small: 18, medium: 22, large: 26 } as const;
const TRANS_SIZE_MAP = { small: 14, medium: 16, large: 18 } as const;

export default function InvocationDetailScreen() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const slugDecoded = slug ? decodeURIComponent(slug) : null;
  const idNum = id ? parseInt(id, 10) : null;
  const { language, setLanguage } = useDuaLanguage();
  const { detail, loading, error, refetch } = useDuaDetail(slugDecoded, idNum ?? null, language);
  const { textSize } = useAppPreferences();
  const { isFavorite, toggleFavorite } = useDuaFavorites();

  const isFav = slugDecoded != null && idNum != null && isFavorite(slugDecoded, idNum);
  const arabicSize = SIZE_MAP[textSize];
  const transSize = TRANS_SIZE_MAP[textSize];

  const handleShare = useCallback(() => {
    if (!detail) return;
    const text = [detail.arabic, detail.latin, detail.translation]
      .filter(Boolean)
      .join("\n\n");
    if (!text) return;
    Share.share({
      message: text,
      title: detail.title,
    }).catch(() => {});
  }, [detail]);

  const handleCopy = useCallback(async () => {
    if (!detail) return;
    const text = [detail.arabic, detail.latin, detail.translation]
      .filter(Boolean)
      .join("\n\n");
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert("Copié", "Le texte a été copié dans le presse-papiers.");
  }, [detail]);

  const handleFavorite = useCallback(() => {
    if (detail) toggleFavorite(detail);
  }, [detail, toggleFavorite]);

  if (slugDecoded == null || idNum == null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Invocation invalide</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink} activeOpacity={0.7}>
          <Text style={styles.backLinkText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={26} color={ICON_COLOR} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {detail?.title ?? "Invocation"}
          </Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.langBtn}
              onPress={() => setLanguage(language === "fr" ? "en" : "fr")}
              activeOpacity={0.7}
            >
              <Text style={styles.langBtnText}>{language === "fr" ? "English" : "Français"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFavorite} style={styles.iconBtn} activeOpacity={0.7}>
              <Feather
                name="heart"
                size={22}
                color={isFav ? ACCENT : ICON_COLOR}
                fill={isFav ? ACCENT : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconBtn} activeOpacity={0.7}>
              <Feather name="share-2" size={22} color={ICON_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCopy} style={styles.iconBtn} activeOpacity={0.7}>
              <Feather name="copy" size={22} color={ICON_COLOR} />
            </TouchableOpacity>
          </View>
        </View>

        {loading && !detail ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={ACCENT} />
            <Text style={styles.loadingText}>Chargement…</Text>
          </View>
        ) : error && !detail ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn} activeOpacity={0.8}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : detail ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {detail.arabic ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>Arabe</Text>
                <Text
                  style={[styles.arabicText, { fontSize: arabicSize, lineHeight: arabicSize * 1.6 }]}
                  selectable
                >
                  {detail.arabic}
                </Text>
              </View>
            ) : null}

            {detail.latin ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>Translittération</Text>
                <Text
                  style={[styles.latinText, { fontSize: transSize }]}
                  selectable
                >
                  {detail.latin}
                </Text>
              </View>
            ) : null}

            {detail.translation ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>Traduction</Text>
                <Text
                  style={[styles.translationText, { fontSize: transSize }]}
                  selectable
                >
                  {detail.translation}
                </Text>
              </View>
            ) : null}

            {detail.notes ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>Notes</Text>
                <Text style={styles.notesText} selectable>
                  {detail.notes}
                </Text>
              </View>
            ) : null}

            {detail.fawaid ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>Vertus / Bénéfices</Text>
                <Text style={styles.notesText} selectable>
                  {detail.fawaid}
                </Text>
              </View>
            ) : null}

            {detail.source ? (
              <View style={styles.block}>
                <Text style={styles.blockLabel}>Référence</Text>
                <Text style={styles.sourceText} selectable>
                  {detail.source}
                </Text>
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
  latinText: {
    fontFamily: "PlusJakartaSans-Regular",
    color: ICON_COLOR,
    fontStyle: "italic",
    lineHeight: 26,
  },
  translationText: {
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    lineHeight: 24,
  },
  notesText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    lineHeight: 22,
  },
  sourceText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    fontStyle: "italic",
    lineHeight: 20,
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backLink: { marginTop: 12 },
  backLinkText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ACCENT,
  },
});
