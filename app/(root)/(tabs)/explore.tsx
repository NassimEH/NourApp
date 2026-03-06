/**
 * Explorer — architecture visuelle type discovery (header + pills, grille, sections horizontales).
 * Réutilise les composants et le style de l'app (Bibliothèque, Cards, constantes).
 */

import {
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

import { ReadingCard, FeaturedCard } from "@/components/Cards";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";
import { JUZ_TO_FIRST_SURA } from "@/lib/quran/juzMapping";
import { useQuranAudioContext } from "@/lib/quran/QuranAudioContext";
import Spacing from "@/constants/Spacing";

const homeBackground = require("@/assets/images/home-background.png");
const H_PADDING = 20;
const CORAN_GAP = 8;
const SECTION_MARGIN_TOP = 32;
const SECTION_HEADER_MARGIN_BOTTOM = 16;
const SCROLL_PADDING_BOTTOM = 120;
const ACCENT = "#3d6b47";
const ICON_COLOR = "#191D31";
const TEXT_MUTED = "rgba(0,0,0,0.6)";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const contentWidth = SCREEN_WIDTH - 2 * H_PADDING;
const coranColWidth = (contentWidth - CORAN_GAP) / 2;
const BLOCK_HEIGHT = 200;
const smallCardHeight = (BLOCK_HEIGHT - CORAN_GAP) / 2;

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
];

const JUZ_ITEMS = Array.from({ length: 30 }, (_, i) => i + 1);

/** Joue la sourate et reste sur Explorer (barre de lecture globale en bas). */
function usePlaySuraOnExplore() {
  const audio = useQuranAudioContext();
  return (suraNumber: number) => {
    audio.playSura(suraNumber);
  };
}

/** En-tête de section comme en Bibliothèque (titre + lien optionnel) */
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
        <TouchableOpacity style={styles.seeAllTouch} onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllLink}>Tout voir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/** Card Juz — style aligné ReadingCard (vert discret) */
function JuzCard({ juzNumber, onPress }: { juzNumber: number; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.juzCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.juzCardInner}>
        <View style={styles.juzCardIconWrap}>
          <Feather name="book" size={22} color={ACCENT} />
        </View>
        <Text style={styles.juzCardNumber}>{juzNumber}</Text>
        <Text style={styles.juzCardLabel}>Juz' {juzNumber}</Text>
      </View>
    </TouchableOpacity>
  );
}

/** Card récitateur — même style que le reste de l'app */
function ReciterCard({
  reciter,
  onPress,
}: {
  reciter: (typeof RECITERS)[0];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.reciterCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.reciterCardAvatar}>
        <Feather name="mic" size={28} color={ACCENT} />
      </View>
      <Text style={styles.reciterCardName} numberOfLines={1}>
        {reciter.name}
      </Text>
      <Text style={styles.reciterCardTag}>{reciter.tag}</Text>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("tout");
  const { list: suras, loading } = useSuraList();
  const playSura = usePlaySuraOnExplore();

  const popularSuras = useMemo(() => suras.slice(0, 8), [suras]);
  const featuredSuras = useMemo(() => suras.slice(0, 5), [suras]);
  const listSuras = useMemo(
    () => (activeTab === "sourates" ? suras : suras.slice(0, 12)),
    [suras, activeTab]
  );

  const showSourates = activeTab === "tout" || activeTab === "sourates";
  const showJuz = activeTab === "tout" || activeTab === "juz";
  const showRecitateurs = activeTab === "tout" || activeTab === "recitateurs";
  const showInvocations = activeTab === "tout" || activeTab === "invocations";

  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Explorer</Text>
          <Text style={styles.tagline}>Écoutez le Coran</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {showSourates && (
            <>
              <View style={styles.section}>
                <SectionHeader
                  title="À écouter"
                  onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
                />
                {loading && suras.length === 0 ? (
                  <ActivityIndicator size="small" color={ACCENT} style={styles.loader} />
                ) : (
                  <View style={styles.readingCardGrid}>
                    {popularSuras.map((sura) => (
                      <View key={sura.number} style={styles.readingCardCell}>
                        <ReadingCard
                          item={{
                            id: String(sura.number),
                            title: sura.englishName,
                            subtitle: `${sura.numberOfAyahs} versets`,
                            icon: "book-open",
                          }}
                          onPress={() => playSura(sura.number)}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <SectionHeader
                  title="Sourates en vedette"
                  onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScroll}
                >
                  {featuredSuras.map((sura) => (
                    <View key={sura.number} style={styles.featuredCardWrap}>
                      <FeaturedCard
                        item={
                          {
                            $id: String(sura.number),
                            name: sura.englishName,
                            price: `${sura.numberOfAyahs} versets`,
                            image: null,
                          } as Parameters<typeof FeaturedCard>[0]["item"]
                        }
                        onPress={() => playSura(sura.number)}
                        actionLabel="Écouter"
                        cardWidth={coranColWidth}
                        cardHeight={smallCardHeight}
                        noMargin
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          {showJuz && (
            <View style={styles.section}>
              <SectionHeader title="Par Juz'" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {JUZ_ITEMS.slice(0, 15).map((n) => (
                  <JuzCard
                    key={n}
                    juzNumber={n}
                    onPress={() => playSura(JUZ_TO_FIRST_SURA[n] ?? 1)}
                  />
                ))}
              </ScrollView>
            </View>
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
                  <ReciterCard
                    key={r.id}
                    reciter={r}
                    onPress={() => router.push("/(root)/(tabs)/coran/recitateurs")}
                  />
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
              <TouchableOpacity
                style={styles.invocationsCard}
                onPress={() => router.push("/(root)/(tabs)/coran/invocations")}
                activeOpacity={0.85}
              >
                <View style={styles.invocationsCardIcon}>
                  <Feather name="bookmark" size={26} color={ACCENT} />
                </View>
                <View style={styles.invocationsCardText}>
                  <Text style={styles.invocationsCardTitle}>Du'as et adhkar</Text>
                  <Text style={styles.invocationsCardSubtitle}>
                    Invocations du matin, du soir, après la prière…
                  </Text>
                </View>
                <Feather name="chevron-right" size={22} color={ICON_COLOR} />
              </TouchableOpacity>
            </View>
          )}

          {showSourates && listSuras.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={activeTab === "sourates" ? "Toutes les sourates" : "À découvrir"}
                onSeeAll={() => router.push("/(root)/(tabs)/coran/sourates")}
              />
              <View style={styles.suraList}>
                {listSuras.map((sura) => (
                  <TouchableOpacity
                    key={sura.number}
                    style={styles.suraRow}
                    onPress={() => playSura(sura.number)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.suraRowNumberWrap}>
                      <Text style={styles.suraRowNumber}>{sura.number}</Text>
                    </View>
                    <Text style={styles.suraRowName} numberOfLines={1}>
                      {sura.englishName}
                    </Text>
                    <Feather name="play-circle" size={24} color={ACCENT} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const JUZ_CARD_W = 80;
const RECITER_CARD_W = 110;

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  header: {
    paddingHorizontal: H_PADDING,
    paddingTop: 24,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: TEXT_MUTED,
    marginTop: 6,
  },
  tabsScroll: { maxHeight: 48 },
  tabsContent: {
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(61, 107, 71, 0.35)",
    backgroundColor: "rgba(61, 107, 71, 0.08)",
    marginRight: 10,
  },
  tabActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ICON_COLOR,
  },
  tabLabelActive: {
    color: "#fff",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 4,
    paddingBottom: SCROLL_PADDING_BOTTOM,
  },
  section: { marginTop: SECTION_MARGIN_TOP },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SECTION_HEADER_MARGIN_BOTTOM,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: ICON_COLOR,
    letterSpacing: 0.3,
  },
  seeAllTouch: {
    paddingVertical: 6,
    paddingLeft: Spacing,
  },
  seeAllLink: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ACCENT,
  },
  loader: { marginVertical: 24 },
  readingCardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  readingCardCell: {
    marginBottom: CORAN_GAP,
  },
  horizontalScroll: {
    flexDirection: "row",
    paddingRight: H_PADDING,
  },
  featuredCardWrap: {
    marginRight: CORAN_GAP,
  },
  juzCard: {
    width: JUZ_CARD_W,
    marginRight: CORAN_GAP,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.25)",
    padding: 14,
  },
  juzCardInner: { alignItems: "center" },
  juzCardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  juzCardNumber: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: ACCENT,
  },
  juzCardLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  reciterCard: {
    width: RECITER_CARD_W,
    marginRight: CORAN_GAP,
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.25)",
    padding: 16,
  },
  reciterCardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  reciterCardName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: ICON_COLOR,
    marginTop: 10,
  },
  reciterCardTag: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  invocationsCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.25)",
    padding: 16,
  },
  invocationsCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  invocationsCardText: { flex: 1, minWidth: 0 },
  invocationsCardTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: ICON_COLOR,
  },
  invocationsCardSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 4,
  },
  suraList: { gap: 6 },
  suraRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(61, 107, 71, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  suraRowNumberWrap: {
    minWidth: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(61, 107, 71, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  suraRowNumber: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: ACCENT,
  },
  suraRowName: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 15,
    color: ICON_COLOR,
  },
  bottomSpacer: { height: 100 },
});
