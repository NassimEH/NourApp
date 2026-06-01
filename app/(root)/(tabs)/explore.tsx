/**
 * Écoute — architecture visuelle style Spotify (grille compacte, sections horizontales).
 */

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { useMemo, useState } from "react";

import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { JUZ_TO_FIRST_SURA } from "@/lib/quran/juzMapping";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";
import { ScreenBackground } from "@/components/ScreenBackground";
import {
  SCREEN_EDGE_PADDING,
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { SectionHeader } from "@/components/SectionHeader";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme, type AppThemeColors } from "@/lib/app-theme";
import { MIN_TOUCH_TARGET, SECTION_GAP } from "@/lib/ui/spacing";

const quranImage = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");
const H_PADDING = SCREEN_EDGE_PADDING;
const GAP = 8;
const SCROLL_PADDING_BOTTOM = 120;

function useExploreStyles() {
  const colors = useAppTheme();
  return useMemo(() => createExploreStyles(colors), [colors]);
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GAP) / 2;
const GRID_CARD_HEIGHT = 56;
const GRID_IMAGE_SIZE = 56;

const FEATURED_CARD_WIDTH = 150;
const FEATURED_CARD_HEIGHT = 200;

type TabId = "tout" | "sourates" | "recitateurs" | "juz" | "invocations";

function useExploreTabs(): { id: TabId; label: string }[] {
  const { t } = useTranslation();
  return useMemo(
    () => [
      { id: "tout", label: t("explore.tabAll") },
      { id: "sourates", label: t("explore.tabSuras") },
      { id: "recitateurs", label: t("explore.tabReciters") },
      { id: "juz", label: t("explore.tabJuz") },
      { id: "invocations", label: t("explore.tabInvocations") },
    ],
    [t]
  );
}

const RECITERS = [
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit", tag: "Murattal" },
  { id: "ar.alafasy", name: "Mishary Alafasy", tag: "Populaire" },
  { id: "ar.husary", name: "Mahmoud Khalil", tag: "Classique" },
  { id: "ar.minshawi", name: "Al-Minshawi", tag: "Mujawwad" },
];

const JUZ_ITEMS = Array.from({ length: 30 }, (_, i) => i + 1);

function usePlaySuraOnExplore() {
  const audio = useQuranAudioContext();
  return (suraNumber: number) => {
    audio.playSura(suraNumber);
  };
}

function CompactCard({
  title,
  imageSource,
  onPress,
}: {
  title: string;
  imageSource?: any;
  onPress: () => void;
}) {
  const styles = useExploreStyles();
  return (
    <TouchableOpacity
      style={[styles.compactCard, { minHeight: MIN_TOUCH_TARGET }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={imageSource || quranImage} style={styles.compactCardImage} />
      <Text style={styles.compactCardTitle} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function FeaturedCardSpotify({
  title,
  subtitle,
  imageSource,
  onPress,
}: {
  title: string;
  subtitle: string;
  imageSource?: any;
  onPress: () => void;
}) {
  const styles = useExploreStyles();
  return (
    <TouchableOpacity style={styles.featuredCard} onPress={onPress} activeOpacity={0.8}>
      <Image source={imageSource || quranImage} style={styles.featuredCardImage} />
      <Text style={styles.featuredCardTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.featuredCardSubtitle} numberOfLines={2}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

function ReciterCardSpotify({
  name,
  tag,
  onPress,
}: {
  name: string;
  tag: string;
  onPress: () => void;
}) {
  const colors = useAppTheme();
  const styles = useExploreStyles();
  return (
    <TouchableOpacity style={styles.reciterCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.reciterAvatar}>
        <AppIcon name="mic" size={32} color={colors.accent} />
      </View>
      <Text style={styles.reciterName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.reciterTag}>{tag}</Text>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const styles = useExploreStyles();
  const tabs = useExploreTabs();
  const [activeTab, setActiveTab] = useState<TabId>("tout");
  const { list: suras, loading } = useSuraList();
  const playSura = usePlaySuraOnExplore();

  const quickAccessSuras = useMemo(() => suras.slice(0, 8), [suras]);
  const featuredSuras = useMemo(() => suras.slice(0, 6), [suras]);
  const discoverSuras = useMemo(() => suras.slice(8, 14), [suras]);

  const showSourates = activeTab === "tout" || activeTab === "sourates";
  const showJuz = activeTab === "tout" || activeTab === "juz";
  const showRecitateurs = activeTab === "tout" || activeTab === "recitateurs";
  const showInvocations = activeTab === "tout" || activeTab === "invocations";

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenPageHeader
          title={t("screens.exploreTitle")}
          subtitle={t("screens.exploreSubtitle")}
          style={screenPageHeaderSpacing}
        />
        <View style={styles.header}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
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
                <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />
              ) : (
                <View style={styles.compactGrid}>
                  {quickAccessSuras.map((sura) => (
                    <CompactCard
                      key={sura.number}
                      title={sura.englishName}
                      onPress={() => playSura(sura.number)}
                    />
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <SectionHeader
                  title={t("explore.popularSuras")}
                  onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
                  seeAllLabel={t("library.seeAll")}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScroll}
                >
                  {featuredSuras.map((sura) => (
                    <FeaturedCardSpotify
                      key={sura.number}
                      title={sura.englishName}
                      subtitle={`${sura.numberOfAyahs} versets • ${sura.revelationType === "Meccan" ? "Mecquoise" : "Médinoise"}`}
                      onPress={() => playSura(sura.number)}
                    />
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          {showRecitateurs && (
            <View style={styles.section}>
              <SectionHeader
                title={t("explore.recitersSection")}
                onSeeAll={() => router.push("/(root)/(tabs)/coran/recitateurs")}
                seeAllLabel={t("library.seeAll")}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {RECITERS.map((r) => (
                  <ReciterCardSpotify
                    key={r.id}
                    name={r.name}
                    tag={r.tag}
                    onPress={() => router.push("/(root)/(tabs)/coran/recitateurs")}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {showJuz && (
            <View style={styles.section}>
              <SectionHeader title={t("explore.juzSection")} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {JUZ_ITEMS.slice(0, 10).map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={styles.juzCard}
                    onPress={() => playSura(JUZ_TO_FIRST_SURA[n] ?? 1)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.juzIconWrap}>
                      <AppIcon name="book-open" size={24} color={colors.accent} />
                    </View>
                    <Text style={styles.juzNumber}>Juz' {n}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {showInvocations && (
            <View style={styles.section}>
              <SectionHeader
                title={t("explore.invocationsSection")}
                onSeeAll={() => router.push("/(root)/(tabs)/coran/invocations")}
                seeAllLabel={t("library.seeAll")}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {[
                  { id: "matin", title: "Adhkar du matin", icon: "sun" as const },
                  { id: "soir", title: "Adhkar du soir", icon: "moon" as const },
                  { id: "priere", title: "Après la prière", icon: "heart" as const },
                  { id: "sommeil", title: "Avant de dormir", icon: "cloud" as const },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.invocationCard}
                    onPress={() => router.push("/(root)/(tabs)/coran/invocations")}
                    activeOpacity={0.8}
                  >
                    <View style={styles.invocationIconWrap}>
                      <AppIcon name={item.icon} size={28} color={colors.accent} />
                    </View>
                    <Text style={styles.invocationTitle}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {showSourates && discoverSuras.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title="À découvrir"
                onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {discoverSuras.map((sura) => (
                  <FeaturedCardSpotify
                    key={sura.number}
                    title={sura.englishName}
                    subtitle={`Sourate ${sura.number} • ${sura.numberOfAyahs} versets`}
                    onPress={() => playSura(sura.number)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

function createExploreStyles(c: AppThemeColors) {
  return StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: H_PADDING,
    paddingVertical: 8,
    gap: 12,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: c.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: c.onAccent,
  },
  tabsContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: c.accentSurface,
    borderWidth: 1.5,
    borderColor: c.accentBorder,
  },
  tabActive: {
    backgroundColor: c.accent,
    borderColor: c.accent,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: c.text,
  },
  tabLabelActive: {
    color: c.onAccent,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    ...screenScrollContent,
    paddingTop: 8,
    paddingBottom: SCROLL_PADDING_BOTTOM,
  },
  loader: {
    marginVertical: 40,
  },
  compactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  compactCard: {
    width: GRID_CARD_WIDTH,
    height: GRID_CARD_HEIGHT,
    backgroundColor: c.card,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: c.border,
  },
  compactCardImage: {
    width: GRID_IMAGE_SIZE,
    height: GRID_IMAGE_SIZE,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  compactCardTitle: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: c.text,
    paddingHorizontal: 10,
  },
  section: {
    marginTop: SECTION_GAP,
  },
  horizontalScroll: {
    flexDirection: "row",
    gap: 12,
    paddingRight: H_PADDING,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
  },
  featuredCardImage: {
    width: FEATURED_CARD_WIDTH,
    height: FEATURED_CARD_WIDTH,
    borderRadius: 8,
    marginBottom: 10,
  },
  featuredCardTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: c.text,
    marginBottom: 4,
  },
  featuredCardSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: c.textMuted,
    lineHeight: 16,
  },
  reciterCard: {
    width: 140,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: c.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  reciterAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: c.accentSurface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  reciterName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: c.text,
    textAlign: "center",
  },
  reciterTag: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: c.textMuted,
    marginTop: 4,
  },
  juzCard: {
    width: 100,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: c.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  juzIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: c.accentSurface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  juzNumber: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: c.text,
  },
  invocationCard: {
    width: 130,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: c.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  invocationIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: c.accentSurface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  invocationTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: c.text,
    textAlign: "center",
  },
  bottomSpacer: {
    height: 100,
  },
  });
}

