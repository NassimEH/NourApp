import {
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

/** Coran : sourates, recherche, récitateurs, player, tafsir, traduction, mémorisation */
const SECTION_CORAN: LibraryCardItem[] = [
  { $id: "sourates", name: "Liste des Sourates", price: "114 sourates" },
  { $id: "recherche", name: "Recherche Coran", price: "Mots, versets" },
  { $id: "recitateurs", name: "Récitateurs", price: "Écoute en audio" },
  { $id: "player", name: "Player plein écran", price: "Lecture immersive" },
  { $id: "tafsir", name: "Tafsir", price: "Exégèse des versets" },
  { $id: "traduction", name: "Traduction", price: "Plusieurs langues" },
  { $id: "memorisation", name: "Mode mémorisation", price: "Hifz et révision" },
];

/** Invocations : toutes, météo, matin/soir, sommeil */
const SECTION_INVOCATIONS: LibraryCardItem[] = [
  { $id: "invocations", name: "Toutes les invocations", price: "Du'as et adhkar" },
  { $id: "invocations-meteo", name: "Invocations sur la météo", price: "Pluie, orage, vent" },
  { $id: "invocations-matin-soir", name: "Matin et soir", price: "Sabah et Massa" },
  { $id: "invocations-sommeil", name: "Avant le sommeil", price: "Du'as du coucher" },
];

/** Hadiths : tous, du jour, par thème */
const SECTION_HADITHS: LibraryCardItem[] = [
  { $id: "hadiths", name: "Tous les hadiths", price: "Par recueil" },
  { $id: "hadith-jour", name: "Hadith du jour", price: "Parole du jour" },
  { $id: "hadiths-theme", name: "Hadiths par thème", price: "Foi, prière, etc." },
];

function LibrarySection({
  title,
  data,
}: {
  title: string;
  data: LibraryCardItem[];
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.seeAllTouch} activeOpacity={0.7}>
          <Text style={styles.seeAllLink}>Tout voir</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContent}
      >
        {data.map((item) => (
          <FeaturedCard
            key={item.$id}
            item={item as Parameters<typeof FeaturedCard>[0]["item"]}
            onPress={() => router.push(item.$id)}
            actionLabel="Ouvrir"
          />
        ))}
      </ScrollView>
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
          <LibrarySection title="Coran" data={SECTION_CORAN} />
          <LibrarySection title="Invocations" data={SECTION_INVOCATIONS} />
          <LibrarySection title="Hadiths" data={SECTION_HADITHS} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const H_PADDING = 20;

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
});
