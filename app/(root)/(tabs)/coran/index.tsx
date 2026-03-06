import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { FeaturedCard } from "@/components/Cards";

const homeBackground = require("@/assets/images/home-background.png");

const H_PADDING = 20;
const CORAN_GAP = 8;

type LibraryRoute =
  | "sourates"
  | "recherche"
  | "recitateurs"
  | "recitateur-detail"
  | "tafsir"
  | "traduction"
  | "memorisation"
  | "player"
  | "invocations"
  | "invocations-meteo"
  | "invocations-matin-soir"
  | "invocations-sommeil"
  | "hadiths"
  | "hadith-jour"
  | "hadiths-theme";

interface LibraryCardItem {
  $id: LibraryRoute;
  name: string;
  price: string;
  image?: string | null;
}

const quranImage = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

/** Coran : grande carte Sourates à gauche, petite Récitateurs à droite */
const CORAN_HERO_ITEMS: { sourates: LibraryCardItem; recitateurs: LibraryCardItem } = {
  sourates: { $id: "sourates", name: "Sourates", price: "114 sourates", image: null },
  recitateurs: { $id: "recitateurs", name: "Récitateurs", price: "Écoute en audio" },
};

/** Invocations : deux petites à gauche, une grande à droite (inverse de Coran) */
const INVOCATIONS_HERO_ITEMS: { topLeft: LibraryCardItem; bottomLeft: LibraryCardItem; right: LibraryCardItem } = {
  topLeft: { $id: "invocations", name: "Toutes les invocations", price: "Du'as et adhkar" },
  bottomLeft: { $id: "invocations-meteo", name: "Invocations météo", price: "Pluie, orage, vent" },
  right: { $id: "invocations-matin-soir", name: "Matin et soir", price: "Sabah et Massa" },
};

/** Hadiths : deux petites en haut côte à côte, une grande en bas */
const HADITHS_HERO_ITEMS: {
  topLeft: LibraryCardItem;
  topRight: LibraryCardItem;
  bottom: LibraryCardItem;
} = {
  topLeft: { $id: "hadith-jour", name: "Hadith du jour", price: "Parole du jour" },
  topRight: { $id: "hadiths-theme", name: "Hadiths par thème", price: "Foi, prière, etc." },
  bottom: { $id: "hadiths", name: "Tous les hadiths", price: "Par recueil" },
};

const { width: screenWidth } = Dimensions.get("window");
const contentWidth = screenWidth - 2 * H_PADDING;
const coranColWidth = (contentWidth - CORAN_GAP) / 2;

const BLOCK_HEIGHT = 320;
const ROW_GAP = 8;
const smallCardHeight = (BLOCK_HEIGHT - ROW_GAP) / 2;

function pushLibraryRoute(route: LibraryRoute) {
  router.push(`/(root)/(tabs)/coran/${route}` as const);
}

const SOURATES_CARD_WIDTH = contentWidth * 0.65;
const RECITATEURS_CARD_WIDTH = contentWidth - SOURATES_CARD_WIDTH - CORAN_GAP;

function CoranHeroBlock() {
  const { sourates, recitateurs } = CORAN_HERO_ITEMS;
  const souratesItem = {
    ...sourates,
    image: quranImage,
  } as Parameters<typeof FeaturedCard>[0]["item"];
  return (
    <View style={styles.heroBlock}>
      <View style={styles.souratesCardWrap}>
        <FeaturedCard
          item={souratesItem}
          onPress={() => pushLibraryRoute(sourates.$id)}
          actionLabel="Lire"
          cardWidth={SOURATES_CARD_WIDTH}
          cardHeight={BLOCK_HEIGHT}
          noMargin
        />
      </View>
      <View style={styles.recitateurCardWrap}>
        <FeaturedCard
          item={recitateurs as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(recitateurs.$id)}
          actionLabel="Écouter"
          cardWidth={RECITATEURS_CARD_WIDTH}
          cardHeight={BLOCK_HEIGHT}
          noMargin
        />
      </View>
    </View>
  );
}

/** Invocations : deux petites à gauche empilées, une grande à droite */
function InvocationsHeroBlock() {
  const { topLeft, bottomLeft, right } = INVOCATIONS_HERO_ITEMS;
  return (
    <View style={styles.heroBlock}>
      <View style={styles.heroLeft}>
        <FeaturedCard
          item={topLeft as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(topLeft.$id)}
          actionLabel="Ouvrir"
          cardWidth={coranColWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
        <View style={styles.heroGap} />
        <FeaturedCard
          item={bottomLeft as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(bottomLeft.$id)}
          actionLabel="Ouvrir"
          cardWidth={coranColWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
      </View>
      <View style={styles.heroRight}>
        <FeaturedCard
          item={right as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(right.$id)}
          actionLabel="Ouvrir"
          cardWidth={coranColWidth}
          cardHeight={BLOCK_HEIGHT}
          noMargin
        />
      </View>
    </View>
  );
}

/** Hadiths : deux petites en haut côte à côte, une grande en bas pleine largeur */
function HadithsHeroBlock() {
  const { topLeft, topRight, bottom } = HADITHS_HERO_ITEMS;
  return (
    <View style={[styles.heroBlock, styles.hadithsBlock]}>
      <View style={styles.hadithsTopRow}>
        <FeaturedCard
          item={topLeft as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(topLeft.$id)}
          actionLabel="Ouvrir"
          cardWidth={coranColWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
        <View style={styles.heroGapHorizontal} />
        <FeaturedCard
          item={topRight as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(topRight.$id)}
          actionLabel="Ouvrir"
          cardWidth={coranColWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
      </View>
      <View style={styles.heroGap} />
      <View style={styles.hadithsBottom}>
        <FeaturedCard
          item={bottom as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(bottom.$id)}
          actionLabel="Ouvrir"
          cardWidth={contentWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
      </View>
    </View>
  );
}

export default function BibliothequeScreen() {
  return (
    <ImageBackground source={homeBackground} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Bibliothèque</Text>
          <Text style={styles.tagline}>Cœur spirituel de l'app</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Coran</Text>
              <TouchableOpacity style={styles.seeAllTouch} activeOpacity={0.7}>
                <Text style={styles.seeAllLink}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            <CoranHeroBlock />
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Invocations</Text>
              <TouchableOpacity style={styles.seeAllTouch} activeOpacity={0.7}>
                <Text style={styles.seeAllLink}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            <InvocationsHeroBlock />
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hadiths</Text>
              <TouchableOpacity style={styles.seeAllTouch} activeOpacity={0.7}>
                <Text style={styles.seeAllLink}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            <HadithsHeroBlock />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

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
    color: "#191D31",
  },
  tagline: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.6)",
    marginTop: 6,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 120,
    paddingTop: 4,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
    letterSpacing: 0.3,
  },
  seeAllTouch: {
    paddingVertical: 6,
    paddingLeft: 10,
  },
  seeAllLink: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#3d6b47",
  },
  cardsContent: {
    paddingRight: H_PADDING,
  },
  heroBlock: {
    flexDirection: "row",
    height: BLOCK_HEIGHT,
    marginBottom: 4,
  },
  souratesCardWrap: {
    width: SOURATES_CARD_WIDTH,
    marginRight: CORAN_GAP,
  },
  recitateurCardWrap: {
    width: RECITATEURS_CARD_WIDTH,
  },
  heroLeft: {
    width: coranColWidth,
    marginRight: CORAN_GAP,
    flexDirection: "column",
  },
  heroRight: {
    width: coranColWidth,
    flexDirection: "column",
  },
  heroGap: {
    height: ROW_GAP,
  },
  heroGapHorizontal: {
    width: ROW_GAP,
  },
  hadithsBlock: {
    flexDirection: "column",
    height: BLOCK_HEIGHT,
  },
  hadithsTopRow: {
    flexDirection: "row",
    height: smallCardHeight,
  },
  hadithsBottom: {
    height: smallCardHeight,
    width: contentWidth,
  },
});
