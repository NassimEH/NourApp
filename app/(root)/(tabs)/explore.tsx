/**
 * Écoute — aligné Spotify :
 * 1) titre « Écoute »
 * 2) barre [avatar | chips]
 * 3) grille 2 cols cartes horizontales (cover | titre)
 */

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useCallback, useMemo, useState } from "react";

import { SectionHeader } from "@/components/SectionHeader";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import {
  createExploreScreenStyles,
  GRID_COVER,
  GRID_GAP,
} from "@/lib/explore-screen-styles";
import { useTranslation } from "@/lib/i18n";
import { useLastListen } from "@/lib/quran/hooks/useLastListen";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { JUZ_TO_FIRST_SURA } from "@/lib/quran/juzMapping";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";
import { AVAILABLE_RECITERS } from "@/lib/quran/types";

const quranArtwork = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

const COVER_IMG = {
  width: GRID_COVER,
  height: GRID_COVER,
} as const;

function useExploreStyles() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - SCREEN_EDGE_PADDING * 2;
  const tileWidth = Math.floor((contentWidth - GRID_GAP) / 2);
  return useMemo(
    () =>
      createExploreScreenStyles(colors, typography, { contentWidth, tileWidth }),
    [colors, typography, contentWidth, tileWidth]
  );
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
 * Carte Spotify : layout dans un View interne.
 * Pressable (surtout web/<button>) ne doit PAS porter le flexDirection.
 */
function CompactTile({
  title,
  suraNumber,
  progress,
  onPress,
}: {
  title: string;
  suraNumber: number;
  progress?: number;
  onPress: () => void;
}) {
  const styles = useExploreStyles();
  const showProgress = progress != null && progress > 0 && progress < 1;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tilePressable,
        pressed && styles.tilePressed,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.tileInner}>
        <View style={styles.tileCover}>
          <Image
            source={quranArtwork}
            style={COVER_IMG}
            resizeMode="cover"
          />
          <View style={styles.tileBadge}>
            <Text style={styles.tileBadgeText}>{suraNumber}</Text>
          </View>
        </View>
        <View style={styles.tileBody}>
          <Text style={styles.tileTitle} numberOfLines={2}>
            {title}
          </Text>
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
        </View>
      </View>
    </Pressable>
  );
}

function FeaturedListenHero({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const colors = useAppTheme();
  const styles = useExploreStyles();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.heroCard,
        pressed && styles.heroCardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${t("explore.resumePlay")}, ${title}`}
    >
      <View style={styles.heroMedia}>
        <Image
          source={quranArtwork}
          style={styles.heroMediaImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroPlayBtn} pointerEvents="none">
          <AppIcon name="play" size={22} color={colors.onAccent} />
        </View>
      </View>
      <View style={styles.heroMeta}>
        <Image
          source={quranArtwork}
          style={styles.heroThumb}
          resizeMode="cover"
        />
        <View style={styles.heroMetaText}>
          <Text style={styles.heroTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.heroSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function SquareTile({
  title,
  subtitle,
  art,
  onPress,
}: {
  title: string;
  subtitle?: string;
  art: { type: "image" } | { type: "initials"; label: string };
  onPress: () => void;
}) {
  const styles = useExploreStyles();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.squareTile,
        pressed && styles.squareTilePressed,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.squareArt}>
        {art.type === "image" ? (
          <Image
            source={quranArtwork}
            style={styles.squareArtImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.squareArtInitials}>{art.label}</Text>
        )}
      </View>
      <Text style={styles.squareTitle} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.squareSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default function ExploreScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const styles = useExploreStyles();
  const tabs = useExploreTabs();
  const { user } = useGlobalContext();
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
    const progressLabel =
      lastListen.progress > 0
        ? t("home.continueListenProgress", {
            percent: Math.round(lastListen.progress * 100),
          })
        : t("home.continueListen");
    return {
      number: lastListen.suraNumber,
      name:
        meta?.englishName ??
        t("home.continueSuraFallback", { number: lastListen.suraNumber }),
      progress: lastListen.progress,
      subtitle: `${currentReciterName} · ${progressLabel}`,
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
      result.push({ number: s.number, title: s.englishName });
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
        <Text style={styles.pageTitle} numberOfLines={1}>
          {t("screens.exploreTitle")}
        </Text>

        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.push("/(root)/(tabs)/profile")}
            accessibilityRole="button"
            accessibilityLabel={t("tabs.profile")}
            style={styles.avatarBtn}
            hitSlop={8}
          >
            <Image
              source={{
                uri:
                  user?.avatar ??
                  "https://ui-avatars.com/api/?name=U&size=80",
              }}
              style={styles.avatarImage}
            />
          </Pressable>

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
                          suraNumber={sura.number}
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
                subtitle={lastListenSura.subtitle}
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
                {FEATURED_RECITERS.map((r) => (
                  <SquareTile
                    key={r.id}
                    title={r.name}
                    subtitle={t(r.styleKey)}
                    art={{ type: "initials", label: reciterInitials(r.name) }}
                    onPress={() =>
                      router.push({
                        pathname: "/(root)/(tabs)/coran/recitateur-detail",
                        params: { id: r.id },
                      })
                    }
                  />
                ))}
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
                  >
                    <View style={styles.juzArt}>
                      <Text style={styles.juzNumber}>{n}</Text>
                    </View>
                    <Text style={styles.juzLabel}>
                      {t("screens.juzNumber", { number: n })}
                    </Text>
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
