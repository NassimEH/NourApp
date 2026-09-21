/**
 * Écoute — logique Spotify (chips + grille + reprise + rangées), design flat Nour.
 */

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { useCallback, useMemo, useState } from "react";

import { SectionHeader } from "@/components/SectionHeader";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { createExploreScreenStyles } from "@/lib/explore-screen-styles";
import { useTranslation } from "@/lib/i18n";
import { useLastListen } from "@/lib/quran/hooks/useLastListen";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { JUZ_TO_FIRST_SURA } from "@/lib/quran/juzMapping";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";
import { AVAILABLE_RECITERS } from "@/lib/quran/types";

function useExploreStyles() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  return useMemo(
    () => createExploreScreenStyles(colors, typography),
    [colors, typography]
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

function CompactTile({
  title,
  icon,
  progress,
  onPress,
}: {
  title: string;
  icon: AppIconName;
  progress?: number;
  onPress: () => void;
}) {
  const colors = useAppTheme();
  const styles = useExploreStyles();
  const showProgress = progress != null && progress > 0 && progress < 1;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.compactCard,
        pressed && styles.compactCardPressed,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.compactCardIconWrap}>
        <AppIcon name={icon} size={20} color={colors.accent} />
      </View>
      <View style={styles.compactCardBody}>
        <Text style={styles.compactCardTitle} numberOfLines={2}>
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
    </Pressable>
  );
}

function ResumeCard({
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
        styles.resumeCard,
        pressed && styles.resumeCardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${t("explore.resumePlay")}, ${title}`}
    >
      <View style={styles.resumeArt}>
        <AppIcon name="headphones" size={36} color={colors.accent} />
      </View>
      <View style={styles.resumeBody}>
        <View>
          <Text style={styles.resumeEyebrow}>{t("explore.resumeEyebrow")}</Text>
          <Text style={styles.resumeTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.resumeSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.resumeActions}>
          <View style={styles.playBtn}>
            <AppIcon name="play" size={18} color={colors.onAccent} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function SquareTile({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle?: string;
  icon: AppIconName;
  onPress: () => void;
}) {
  const colors = useAppTheme();
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
        <AppIcon name={icon} size={36} color={colors.accent} />
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

  const lastListenSura = useMemo(() => {
    if (!lastListen || lastListen.timestamp <= 0) return null;
    const meta = suras.find((s) => s.number === lastListen.suraNumber);
    return {
      number: lastListen.suraNumber,
      name:
        meta?.englishName ??
        t("home.continueSuraFallback", { number: lastListen.suraNumber }),
      nameAr: meta?.name,
      progress: lastListen.progress,
      subtitle:
        lastListen.progress > 0
          ? t("home.continueListenProgress", {
              percent: Math.round(lastListen.progress * 100),
            })
          : t("home.continueListen"),
    };
  }, [lastListen, suras, t]);

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

  const featuredSuras = useMemo(() => suras.slice(0, 8), [suras]);
  const discoverSuras = useMemo(() => suras.slice(8, 16), [suras]);

  const showSourates = activeTab === "tout" || activeTab === "sourates";
  const showJuz = activeTab === "tout" || activeTab === "juz";
  const showRecitateurs = activeTab === "tout" || activeTab === "recitateurs";
  const showResume = showSourates && lastListenSura != null;

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.push("/(root)/(tabs)/profile")}
            accessibilityRole="button"
            accessibilityLabel={t("tabs.profile")}
            style={styles.avatarBtn}
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
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContent}
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
                <View style={styles.compactGrid}>
                  {quickAccessSuras.map((sura) => (
                    <CompactTile
                      key={sura.number}
                      title={sura.title}
                      icon="book-open"
                      progress={sura.progress}
                      onPress={() => playSura(sura.number)}
                    />
                  ))}
                </View>
              )}
            </>
          )}

          {showResume && lastListenSura ? (
            <View style={[styles.section, styles.sectionFirst]}>
              <SectionHeader
                title={t("explore.resumeSection")}
                style={styles.sectionHeader}
              />
              <ResumeCard
                title={lastListenSura.name}
                subtitle={lastListenSura.subtitle}
                onPress={() => playSura(lastListenSura.number)}
              />
            </View>
          ) : null}

          {showSourates && featuredSuras.length > 0 && (
            <View
              style={[
                styles.section,
                !showResume && styles.sectionFirst,
              ]}
            >
              <SectionHeader
                title={t("explore.popularSuras")}
                onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
                seeAllLabel={t("library.seeAll")}
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
                    icon="book-open"
                    onPress={() => playSura(sura.number)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {showRecitateurs && (
            <View
              style={[
                styles.section,
                !showSourates && styles.sectionFirst,
              ]}
            >
              <SectionHeader
                title={t("explore.recitersSection")}
                onSeeAll={() => router.push("/(root)/(tabs)/coran/recitateurs")}
                seeAllLabel={t("library.seeAll")}
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
                    icon="mic"
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

          {showJuz && (
            <View
              style={[
                styles.section,
                !showSourates && !showRecitateurs && styles.sectionFirst,
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
                      <AppIcon
                        name="book-open"
                        size={28}
                        color={colors.accent}
                      />
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
                onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
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
                    icon="book-open"
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
