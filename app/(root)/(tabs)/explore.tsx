import { CoverCaptionBand, COVER_FADE_HEIGHT_RATIO } from "@/components/explore/CoverCaptionBand";
import { AppImage } from "@/components/AppImage";
import { FeaturedListenHero } from "@/components/FeaturedListenHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import {
  SCREEN_EDGE_PADDING,
  screenPageHeaderSpacing,
} from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import {
  createExploreScreenStyles,
  GRID_COVER,
  GRID_GAP,
  JUZ_TILE_SIZE,
  SQUARE_TILE_SIZE,
} from "@/lib/explore-screen-styles";
import { useTranslation } from "@/lib/i18n";
import { useLastListen } from "@/lib/quran/hooks/useLastListen";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { JUZ_TO_FIRST_SURA } from "@/lib/quran/juzMapping";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";
import { getReciterImageSource } from "@/lib/quran/reciter-profiles";
import { AVAILABLE_RECITERS } from "@/lib/quran/types";
import type { ImageSource } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

const quranArtwork = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

const SQUARE_CAPTION_H = Math.round(SQUARE_TILE_SIZE * COVER_FADE_HEIGHT_RATIO);
const JUZ_CAPTION_H = Math.round(JUZ_TILE_SIZE * COVER_FADE_HEIGHT_RATIO);

function useExploreStyles() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - SCREEN_EDGE_PADDING * 2;
  const tileWidth = Math.floor((contentWidth - GRID_GAP) / 2);
  const styles = useMemo(
    () =>
      createExploreScreenStyles(colors, typography, { contentWidth, tileWidth }),
    [colors, typography, contentWidth, tileWidth]
  );
  return { styles, contentWidth };
}

type TabId = "tout" | "sourates" | "recitateurs" | "juz";

function useExploreTabs(): { id: TabId; label: string }[] {
  const { t } = useTranslation();
  return useMemo(
    () => [
      { id: "tout", label: t("explore.tabAll") },
      { id: "sourates", label: t("explore.tabSuras") },
      { id: "recitateurs", label: t("explore.tabReciters") },
      { id: "juz", label: t("explore.tabJuz") },
    ],
    [t]
  );
}

const FEATURED_RECITERS = AVAILABLE_RECITERS.slice(0, 6);
const JUZ_ITEMS = Array.from({ length: 30 }, (_, i) => i + 1);

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

function reciterInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

/**
 * Tuile compacte : cover plein cadre + fondu noir doux + titre blanc
 * (même recette que SquareTile / Reprendre, hauteur = grille).
 */
function CompactTile({
  title,
  subtitle,
  progress,
  onPress,
}: {
  title: string;
  subtitle?: string;
  progress?: number;
  onPress: () => void;
}) {
  const { styles } = useExploreStyles();
  const showProgress = progress != null && progress > 0 && progress < 1;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tilePressable,
        pressed && styles.tilePressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
    >
      <View style={styles.tileInner}>
        <AppImage
          source={quranArtwork}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          recyclingKey="explore-quran-cover"
        />
        <CoverCaptionBand
          height={GRID_COVER}
          contentStyle={styles.tileCaptionContent}
        >
          <Text style={styles.tileTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.tileSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          {showProgress ? (
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(progress * 100)}%` },
                ]}
              />
            </View>
          ) : null}
        </CoverCaptionBand>
      </View>
    </Pressable>
  );
}

/**
 * Cadre carré — cover + blur progressif + typo premium blanche.
 */
function SquareTile({
  title,
  subtitle,
  art,
  onPress,
}: {
  title: string;
  subtitle?: string;
  art:
    | { type: "image" }
    | { type: "source"; source: ImageSource; fallbackLabel?: string }
    | { type: "initials"; label: string };
  onPress: () => void;
}) {
  const colors = useAppTheme();
  const { styles } = useExploreStyles();
  const { rtlTextStyle } = useTranslation();
  const [sourceFailed, setSourceFailed] = useState(false);

  const showSource = art.type === "source" && !sourceFailed;
  const initialsLabel =
    art.type === "initials"
      ? art.label
      : art.type === "source"
        ? (art.fallbackLabel ?? "?")
        : "?";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.squareTile,
        pressed && styles.squareTilePressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
    >
      <View style={styles.squareArt}>
        {art.type === "image" ? (
          <AppImage
            source={quranArtwork}
            style={styles.squareArtImage}
            contentFit="cover"
            recyclingKey="explore-quran-cover"
          />
        ) : showSource ? (
          <AppImage
            source={art.source}
            style={styles.squareArtImage}
            contentFit="cover"
            onError={() => setSourceFailed(true)}
          />
        ) : (
          <View
            style={[
              styles.squareArtFallback,
              { backgroundColor: colors.accentSurface },
            ]}
          >
            <Text style={[styles.squareArtInitials, { color: colors.accent }]}>
              {initialsLabel}
            </Text>
          </View>
        )}
        <CoverCaptionBand height={SQUARE_CAPTION_H}>
          <Text style={[styles.squareTitle, rtlTextStyle]} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[styles.squareSubtitle, rtlTextStyle]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </CoverCaptionBand>
        <View style={styles.squareRim} pointerEvents="none" />
      </View>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const { styles, contentWidth } = useExploreStyles();
  const tabs = useExploreTabs();
  const [activeTab, setActiveTab] = useState<TabId>("tout");
  const { list: suras, loading } = useSuraList();
  const audio = useQuranAudioContext();
  const { lastListen, refresh: refreshLastListen } = useLastListen();

  useFocusEffect(
    useCallback(() => {
      void refreshLastListen();
    }, [refreshLastListen])
  );

  const playSura = useCallback(
    (suraNumber: number) => {
      audio.playSura(suraNumber);
    },
    [audio]
  );

  const currentReciterName = useMemo(() => {
    const found = AVAILABLE_RECITERS.find((r) => r.id === audio.currentReciter);
    return found?.name ?? audio.currentReciter;
  }, [audio.currentReciter]);

  const lastListenSura = useMemo(() => {
    if (!lastListen || lastListen.timestamp <= 0) return null;
    const meta = suras.find((s) => s.number === lastListen.suraNumber);
    return {
      number: lastListen.suraNumber,
      name:
        meta?.englishName ??
        t("home.continueSuraFallback", { number: lastListen.suraNumber }),
      progress: lastListen.progress,
      progressLabel:
        lastListen.progress > 0
          ? `${Math.round(lastListen.progress * 100)} %`
          : undefined,
      reciter: currentReciterName,
    };
  }, [lastListen, suras, t, currentReciterName]);

  const quickAccessSuras = useMemo(() => {
    const result: {
      number: number;
      title: string;
      progress?: number;
    }[] = [];
    const used = new Set<number>();

    if (lastListenSura) {
      result.push({
        number: lastListenSura.number,
        title: lastListenSura.name,
        progress: lastListenSura.progress,
      });
      used.add(lastListenSura.number);
    }

    for (const s of suras) {
      if (result.length >= 8) break;
      if (used.has(s.number)) continue;
      result.push({
        number: s.number,
        title: s.englishName,
      });
      used.add(s.number);
    }
    return result;
  }, [lastListenSura, suras]);

  const quickAccessRows = useMemo(
    () => chunkPairs(quickAccessSuras),
    [quickAccessSuras]
  );

  const featuredSuras = useMemo(() => suras.slice(0, 8), [suras]);
  const discoverSuras = useMemo(() => suras.slice(8, 16), [suras]);

  const showSourates = activeTab === "tout" || activeTab === "sourates";
  const showJuz = activeTab === "tout" || activeTab === "juz";
  const showRecitateurs = activeTab === "tout" || activeTab === "recitateurs";
  const showResume = showSourates && lastListenSura != null;

  const firstSectionAfterGrid = showResume
    ? "resume"
    : showRecitateurs
      ? "recitateurs"
      : showSourates
        ? "sourates"
        : showJuz
          ? "juz"
          : null;

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.exploreTitle")}
          subtitle={t("screens.exploreSubtitle")}
          style={screenPageHeaderSpacing}
        />

        <View style={styles.topBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsContent}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  style={[styles.tab, isActive && styles.tabActive]}
                >
                  <Text
                    style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {showSourates && (
            <>
              {loading && suras.length === 0 ? (
                <ActivityIndicator
                  size="large"
                  color={colors.accent}
                  style={styles.loader}
                />
              ) : (
                <View style={styles.grid}>
                  {quickAccessRows.map((row) => (
                    <View
                      key={row.map((s) => s.number).join("-")}
                      style={styles.gridRow}
                    >
                      {row.map((sura) => (
                        <CompactTile
                          key={sura.number}
                          title={sura.title}
                          subtitle={t("home.continueSuraFallback", {
                            number: sura.number,
                          })}
                          progress={sura.progress}
                          onPress={() => playSura(sura.number)}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {showResume && lastListenSura ? (
            <View
              style={[
                styles.section,
                firstSectionAfterGrid === "resume" && styles.sectionFirst,
              ]}
            >
              <SectionHeader
                title={t("explore.resumeSection")}
                style={styles.sectionHeader}
              />
              <FeaturedListenHero
                title={lastListenSura.name}
                reciter={lastListenSura.reciter}
                progressLabel={lastListenSura.progressLabel}
                progress={lastListenSura.progress}
                contentWidth={contentWidth}
                onPress={() => playSura(lastListenSura.number)}
              />
            </View>
          ) : null}

          {showRecitateurs && (
            <View
              style={[
                styles.section,
                firstSectionAfterGrid === "recitateurs" && styles.sectionFirst,
              ]}
            >
              <SectionHeader
                title={t("explore.recitersSection")}
                style={styles.sectionHeader}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {FEATURED_RECITERS.map((r) => {
                  const image = getReciterImageSource(r.id);
                  return (
                    <SquareTile
                      key={r.id}
                      title={r.name}
                      subtitle={t(r.styleKey)}
                      art={
                        image
                          ? {
                              type: "source",
                              source: image,
                              fallbackLabel: reciterInitials(r.name),
                            }
                          : {
                              type: "initials",
                              label: reciterInitials(r.name),
                            }
                      }
                      onPress={() =>
                        router.push({
                          pathname: "/(root)/recitateur-detail",
                          params: { id: r.id },
                        })
                      }
                    />
                  );
                })}
              </ScrollView>
            </View>
          )}

          {showSourates && featuredSuras.length > 0 && (
            <View
              style={[
                styles.section,
                firstSectionAfterGrid === "sourates" && styles.sectionFirst,
              ]}
            >
              <SectionHeader
                title={t("explore.popularSuras")}
                style={styles.sectionHeader}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {featuredSuras.map((sura) => (
                  <SquareTile
                    key={sura.number}
                    title={sura.englishName}
                    subtitle={t("library.verseCount", {
                      count: sura.numberOfAyahs,
                    })}
                    art={{ type: "image" }}
                    onPress={() => playSura(sura.number)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {showJuz && (
            <View
              style={[
                styles.section,
                firstSectionAfterGrid === "juz" && styles.sectionFirst,
              ]}
            >
              <SectionHeader
                title={t("explore.juzSection")}
                style={styles.sectionHeader}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {JUZ_ITEMS.slice(0, 12).map((n) => (
                  <Pressable
                    key={n}
                    onPress={() => playSura(JUZ_TO_FIRST_SURA[n] ?? 1)}
                    style={({ pressed }) => [
                      styles.juzTile,
                      pressed && styles.squareTilePressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={t("screens.juzNumber", { number: n })}
                  >
                    <View style={styles.juzArt}>
                      <AppImage
                        source={quranArtwork}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        recyclingKey="explore-quran-cover"
                      />
                      <CoverCaptionBand height={JUZ_CAPTION_H}>
                        <Text style={styles.juzNumber}>{n}</Text>
                        <Text style={styles.juzLabel} numberOfLines={1}>
                          {t("screens.juzNumber", { number: n })}
                        </Text>
                      </CoverCaptionBand>
                      <View style={styles.squareRim} pointerEvents="none" />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {showSourates && discoverSuras.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={t("explore.discoverSection")}
                style={styles.sectionHeader}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {discoverSuras.map((sura) => (
                  <SquareTile
                    key={sura.number}
                    title={sura.englishName}
                    subtitle={t("explore.suraMeta", {
                      number: sura.number,
                      count: sura.numberOfAyahs,
                    })}
                    art={{ type: "image" }}
                    onPress={() => playSura(sura.number)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.sectionTail} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}
