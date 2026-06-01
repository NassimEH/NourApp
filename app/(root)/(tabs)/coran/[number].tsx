import {
  ActivityIndicator,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useSura } from "@/lib/quran/hooks/useSura";
import { useLastRead } from "@/lib/quran/hooks/useLastRead";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";

const H_PADDING = SCREEN_EDGE_PADDING;
const ICON_SIZE = 22;
const ICON_COLOR = "#191D31";
const ACCENT = "#3d6b47";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

export default function QuranReaderScreen() {
  const { number, autoplay } = useLocalSearchParams<{ number: string; autoplay?: string }>();
  const suraNumber = number ? parseInt(number, 10) : null;
  const { data, loading, error, refetch } = useSura(suraNumber);
  const { lastRead, setLastReadState } = useLastRead();
  const typography = useAppTypography();
  const colors = useAppTheme();
  const { t } = useTranslation();
  const audio = useQuranAudioContext();

  const [showTranslation, setShowTranslation] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRequested = autoplay === "1";
  const autoplayDoneRef = useRef(false);

  const arabicSize = typography.arabic;
  const transSize = typography.translation;

  const ayahs = data?.arabic?.ayahs ?? [];
  const total = ayahs.length;
  const ayah = total > 0 ? ayahs[currentIndex] : null;
  const trans =
    ayah && data?.translation
      ? data.translation.find((tr) => tr.number === ayah.number)
      : null;

  const suraTitle =
    data?.arabic?.name ?? `${t("tabs.library")} ${suraNumber}`;
  const suraSubtitle = useMemo(() => {
    const parts: string[] = [];
    const enName =
      data?.arabic?.englishNameTranslation || data?.arabic?.englishName;
    if (enName) parts.push(enName);
    if (total > 0) {
      parts.push(
        t("screens.quranReaderVerse", {
          current: currentIndex + 1,
          total,
        })
      );
    } else {
      parts.push(t("screens.quranReaderSubtitle"));
    }
    return parts.join(" · ");
  }, [data?.arabic, total, currentIndex, t]);

  useEffect(() => {
    if (data && lastRead?.suraNumber === suraNumber && typeof lastRead.scrollOffsetY === "number") {
      const restored = Math.max(0, Math.min(Math.floor(lastRead.scrollOffsetY), total - 1));
      setCurrentIndex(restored);
    }
  }, [data, suraNumber, total, lastRead?.suraNumber, lastRead?.scrollOffsetY]);

  useEffect(() => {
    if (suraNumber != null && total > 0) {
      const toSave = Math.max(0, Math.min(currentIndex, total - 1));
      setLastReadState(suraNumber, toSave);
    }
  }, [currentIndex, suraNumber, total, setLastReadState]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : 0));
  }, []);
  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < total - 1 ? i + 1 : i));
  }, [total]);

  const playCurrentAyah = useCallback(() => {
    if (suraNumber && ayah) audio.playAyah(suraNumber, ayah.number);
  }, [suraNumber, ayah, audio]);

  const playSura = useCallback(() => {
    if (suraNumber) audio.playSura(suraNumber);
  }, [suraNumber, audio]);

  useEffect(() => {
    if (
      autoplayRequested &&
      suraNumber != null &&
      data &&
      !loading &&
      !autoplayDoneRef.current
    ) {
      autoplayDoneRef.current = true;
      audio.playSura(suraNumber);
    }
  }, [autoplayRequested, suraNumber, data, loading, audio]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx } = gestureState;
          return Math.abs(dx) > 20;
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx } = gestureState;
          if (dx < -40) goNext();
          else if (dx > 40) goPrev();
        },
      }),
    [goNext, goPrev]
  );

  if (suraNumber == null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Sourate invalide</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink} activeOpacity={0.7}>
          <Text style={styles.backLinkText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={suraTitle}
          subtitle={suraSubtitle}
          onBack={() => router.back()}
          headerActions={
            <>
              <TouchableOpacity
                onPress={playCurrentAyah}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <AppIcon name="volume-2" size={ICON_SIZE} color={colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowTranslation((v) => !v)}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <AppIcon
                  name="book"
                  size={ICON_SIZE}
                  color={showTranslation ? colors.accent : colors.icon}
                />
              </TouchableOpacity>
            </>
          }
        />

        {loading && !data ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={ACCENT} />
            <Text style={styles.loadingText}>Chargement…</Text>
          </View>
        ) : error && !data ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn} activeOpacity={0.8}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : data && ayah ? (
          <>
            {/* Zone centrale : un verset (swipe gauche = suivant, droite = précédent) */}
            <View style={styles.verseArea} {...panResponder.panHandlers}>
              <Text
                style={[
                  styles.arabicVerse,
                  {
                    fontSize: arabicSize,
                    lineHeight: arabicSize * typography.lineHeightArabic,
                  },
                ]}
                selectable
              >
                {ayah.text}
              </Text>
              {showTranslation && trans?.text ? (
                <Text style={[styles.transVerse, { fontSize: transSize }]} selectable>
                  {trans.text}
                </Text>
              ) : null}
            </View>

            {/* Navigation verset précédent / suivant */}
            <View style={styles.navRow}>
              <TouchableOpacity
                onPress={goPrev}
                disabled={currentIndex === 0}
                style={[styles.navArrow, currentIndex === 0 && styles.navArrowDisabled]}
                activeOpacity={0.7}
              >
                <AppIcon
                  name="chevron-left"
                  size={28}
                  color={currentIndex === 0 ? TEXT_MUTED : ICON_COLOR}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={playSura}
                style={styles.playSuraBtn}
                activeOpacity={0.7}
              >
                <AppIcon name="play-circle" size={24} color={ACCENT} />
                <Text style={styles.playSuraLabel}>Écouter la sourate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={goNext}
                disabled={currentIndex >= total - 1}
                style={[styles.navArrow, currentIndex >= total - 1 && styles.navArrowDisabled]}
                activeOpacity={0.7}
              >
                <AppIcon
                  name="chevron-right"
                  size={28}
                  color={currentIndex >= total - 1 ? TEXT_MUTED : ICON_COLOR}
                />
              </TouchableOpacity>
            </View>

          </>
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
  headerSide: { minWidth: 44, paddingVertical: 8 },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4, minWidth: 44 },
  suraName: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ICON_COLOR,
  },
  suraNameFr: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    marginTop: 2,
  },
  verseCounter: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    marginTop: 2,
  },
  iconBtn: { padding: 8 },
  verseArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: H_PADDING,
    paddingVertical: 24,
  },
  arabicVerse: {
    fontFamily: "PlusJakartaSans-Regular",
    color: ICON_COLOR,
    textAlign: "right",
    writingDirection: "rtl",
  },
  transVerse: {
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    lineHeight: 24,
    marginTop: 20,
    fontStyle: "italic",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PADDING,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  navArrow: {
    padding: 12,
  },
  navArrowDisabled: { opacity: 0.5 },
  playSuraBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  playSuraLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: { fontSize: 16, fontFamily: "PlusJakartaSans-Regular", color: TEXT_MUTED },
  errorWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: { fontSize: 16, textAlign: "center", marginBottom: 16, color: ICON_COLOR },
  retryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: ACCENT,
  },
  retryText: { fontSize: 16, fontFamily: "PlusJakartaSans-SemiBold", color: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backLink: { marginTop: 12 },
  backLinkText: { fontSize: 16, fontFamily: "PlusJakartaSans-SemiBold", color: ACCENT },
});
