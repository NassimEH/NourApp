/**
 * Explorer — architecture visuelle style Spotify (grille compacte, sections horizontales).
 */

import {
  Image,
  ImageBackground,
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
import Feather from "@expo/vector-icons/Feather";
import { useMemo, useState } from "react";

import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { JUZ_TO_FIRST_SURA } from "@/lib/quran/juzMapping";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";

const quranImage = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");
const homeBackground = require("@/assets/images/home-background.png");

const H_PADDING = 16;
const GAP = 8;
const SCROLL_PADDING_BOTTOM = 120;

const BG_CARD = "rgba(61, 107, 71, 0.12)";
const ACCENT = "#3d6b47";
const TEXT_PRIMARY = "#191D31";
const TEXT_SECONDARY = "#5b5d5e";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GAP) / 2;
const GRID_CARD_HEIGHT = 56;
const GRID_IMAGE_SIZE = 56;

const FEATURED_CARD_WIDTH = 150;
const FEATURED_CARD_HEIGHT = 200;

type TabId = "tout" | "sourates" | "recitateurs" | "juz" | "invocations";
const TABS: { id: TabId; label: string }[] = [
  { id: "tout", label: "Tout" },
  { id: "sourates", label: "Sourates" },
  { id: "recitateurs", label: "Récitateurs" },
  { id: "juz", label: "Juz'" },
  { id: "invocations", label: "Invocations" },
];

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

function SectionHeader({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllLink}>Tout voir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
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
  return (
    <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
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
  return (
    <TouchableOpacity style={styles.reciterCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.reciterAvatar}>
        <Feather name="mic" size={32} color={ACCENT} />
      </View>
      <Text style={styles.reciterName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.reciterTag}>{tag}</Text>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
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
    <ImageBackground source={homeBackground} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>N</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {TABS.map((tab) => {
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
                <ActivityIndicator size="large" color={ACCENT} style={styles.loader} />
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
                  title="Sourates populaires"
                  onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
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
                title="Récitateurs"
                onSeeAll={() => router.push("/(root)/(tabs)/coran/recitateurs")}
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
              <SectionHeader title="Par Juz'" />
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
                      <Feather name="book-open" size={24} color={ACCENT} />
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
                title="Invocations"
                onSeeAll={() => router.push("/(root)/(tabs)/coran/invocations")}
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
                      <Feather name={item.icon} size={28} color={ACCENT} />
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 12,
    gap: 12,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#fff",
  },
  tabsContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(61, 107, 71, 0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(61, 107, 71, 0.35)",
  },
  tabActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: TEXT_PRIMARY,
  },
  tabLabelActive: {
    color: "#fff",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.15)",
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
    color: TEXT_PRIMARY,
    paddingHorizontal: 10,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT_PRIMARY,
  },
  seeAllLink: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT_SECONDARY,
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
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  featuredCardSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: TEXT_SECONDARY,
    lineHeight: 16,
  },
  reciterCard: {
    width: 140,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.15)",
  },
  reciterAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  reciterName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  reciterTag: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 4,
  },
  juzCard: {
    width: 100,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.15)",
  },
  juzIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(61, 107, 71, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  juzNumber: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: TEXT_PRIMARY,
  },
  invocationCard: {
    width: 130,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.15)",
  },
  invocationIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  invocationTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  bottomSpacer: {
    height: 100,
  },
});
