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
import { useCallback } from "react";

import { useDuaDetail, useDuaFavorites } from "@/lib/dua";
import { useAppTheme } from "@/lib/app-theme";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { bodyLineHeight } from "@/lib/ui/typography";

const H_PADDING = SCREEN_EDGE_PADDING;

export default function InvocationDetailScreen() {
  const { t } = useTranslation();
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const slugDecoded = slug ? decodeURIComponent(slug) : null;
  const idNum = id ? parseInt(id, 10) : null;
  const { detail, loading, error, refetch } = useDuaDetail(slugDecoded, idNum ?? null, "fr");
  const typography = useAppTypography();
  const colors = useAppTheme();
  const { isFavorite, toggleFavorite } = useDuaFavorites();

  const isFav = slugDecoded != null && idNum != null && isFavorite(slugDecoded, idNum);
  const arabicSize = typography.arabic;
  const transSize = typography.translation;
  const transLh = bodyLineHeight(transSize);

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
    Alert.alert(t("common.copiedTitle"), t("common.copiedBody"));
  }, [detail, t]);

  const handleFavorite = useCallback(() => {
    if (detail) toggleFavorite(detail);
  }, [detail, toggleFavorite]);

  if (slugDecoded == null || idNum == null) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, { color: colors.text }]}>{t("dua.invalid")}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink} activeOpacity={0.7}>
          <Text style={[styles.backLinkText, { color: colors.accent }]}>{t("common.back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={detail?.title ?? t("screens.invocationsTitle")}
          subtitle={t("screens.duaDetailSubtitle")}
          onBack={() => router.back()}
          headerActions={
            <>
              <TouchableOpacity onPress={handleFavorite} style={styles.iconBtn} activeOpacity={0.7}>
                <AppIcon
                  name="heart"
                  size={22}
                  color={isFav ? colors.accent : colors.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.iconBtn} activeOpacity={0.7}>
                <AppIcon name="share-2" size={22} color={colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCopy} style={styles.iconBtn} activeOpacity={0.7}>
                <AppIcon name="copy" size={22} color={colors.icon} />
              </TouchableOpacity>
            </>
          }
        />

        {loading && !detail ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>{t("common.loading")}</Text>
          </View>
        ) : error && !detail ? (
          <View style={styles.errorWrap}>
            <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={[styles.retryBtn, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.retryText, { color: colors.onAccent }]}>{t("common.retry")}</Text>
            </TouchableOpacity>
          </View>
        ) : detail ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {detail.arabic ? (
              <View style={[styles.block, { borderTopColor: colors.divider }]}>
                <Text style={[styles.blockLabel, { color: colors.accent }]}>{t("dua.arabic")}</Text>
                <Text
                  style={[
                    styles.arabicText,
                    {
                      color: colors.text,
                      fontSize: arabicSize,
                      lineHeight: arabicSize * typography.lineHeightArabic,
                    },
                  ]}
                  selectable
                >
                  {detail.arabic}
                </Text>
              </View>
            ) : null}

            {detail.latin ? (
              <View style={[styles.block, { borderTopColor: colors.divider }]}>
                <Text style={[styles.blockLabel, { color: colors.accent }]}>{t("dua.transliteration")}</Text>
                <Text
                  style={[styles.latinText, { color: colors.text, fontSize: transSize, lineHeight: transLh }]}
                  selectable
                >
                  {detail.latin}
                </Text>
              </View>
            ) : null}

            {detail.translation ? (
              <View style={[styles.block, { borderTopColor: colors.divider }]}>
                <Text style={[styles.blockLabel, { color: colors.accent }]}>{t("dua.translation")}</Text>
                <Text
                  style={[styles.translationText, { color: colors.textMuted, fontSize: transSize, lineHeight: transLh }]}
                  selectable
                >
                  {detail.translation}
                </Text>
              </View>
            ) : null}

            {detail.notes ? (
              <View style={[styles.block, { borderTopColor: colors.divider }]}>
                <Text style={[styles.blockLabel, { color: colors.accent }]}>{t("dua.notes")}</Text>
                <Text style={[styles.notesText, { color: colors.textMuted }]} selectable>
                  {detail.notes}
                </Text>
              </View>
            ) : null}

            {detail.fawaid ? (
              <View style={[styles.block, { borderTopColor: colors.divider }]}>
                <Text style={[styles.blockLabel, { color: colors.accent }]}>{t("dua.benefits")}</Text>
                <Text style={[styles.notesText, { color: colors.textMuted }]} selectable>
                  {detail.fawaid}
                </Text>
              </View>
            ) : null}

            {detail.source ? (
              <View style={[styles.block, { borderTopColor: colors.divider }]}>
                <Text style={[styles.blockLabel, { color: colors.accent }]}>{t("dua.reference")}</Text>
                <Text style={[styles.sourceText, { color: colors.textMuted }]} selectable>
                  {detail.source}
                </Text>
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
  iconBtn: { padding: 8 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: H_PADDING, paddingBottom: 100 },
  block: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  blockLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  arabicText: {
    fontFamily: "Amiri_400Regular",
    textAlign: "right",
    writingDirection: "rtl",
  },
  latinText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontStyle: "italic",
    lineHeight: 26,
  },
  translationText: {
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 24,
  },
  notesText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
  },
  sourceText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
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
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backLink: { marginTop: 12 },
  backLinkText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
});
