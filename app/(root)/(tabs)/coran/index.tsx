import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { FeaturedCard } from "@/components/Cards";
import { ScreenBackground } from "@/components/ScreenBackground";
import {
  SCREEN_EDGE_PADDING,
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { SectionHeader } from "@/components/SectionHeader";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";

const H_PADDING = SCREEN_EDGE_PADDING;
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
  icon?:
    | "book-open"
    | "mic"
    | "bookmark"
    | "cloud"
    | "sun"
    | "message-circle";
}

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
  const { t } = useTranslation();
  const { sourates, recitateurs } = useMemo(
    () => ({
      sourates: {
        $id: "sourates" as const,
        name: t("library.sourates"),
        price: t("library.souratesCount"),
        icon: "book-open" as const,
      },
      recitateurs: {
        $id: "recitateurs" as const,
        name: t("library.reciters"),
        price: t("library.recitersListen"),
        icon: "mic" as const,
      },
    }),
    [t]
  );
  return (
    <View style={styles.heroBlock}>
      <View style={styles.souratesCardWrap}>
        <FeaturedCard
          item={sourates as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(sourates.$id)}
          actionLabel={t("library.actionRead")}
          cardWidth={SOURATES_CARD_WIDTH}
          cardHeight={BLOCK_HEIGHT}
          noMargin
        />
      </View>
      <View style={styles.recitateurCardWrap}>
        <FeaturedCard
          item={recitateurs as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(recitateurs.$id)}
          actionLabel={t("library.actionListen")}
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
  const { t } = useTranslation();
  const { topLeft, bottomLeft, right } = useMemo(
    () => ({
      topLeft: {
        $id: "invocations" as const,
        name: t("library.invocationsAll"),
        price: t("library.invocationsAllSub"),
        icon: "bookmark" as const,
      },
      bottomLeft: {
        $id: "invocations-meteo" as const,
        name: t("library.invocationsWeather"),
        price: t("library.invocationsWeatherSub"),
        icon: "cloud" as const,
      },
      right: {
        $id: "invocations-matin-soir" as const,
        name: t("library.invocationsMorning"),
        price: t("library.invocationsMorningSub"),
        icon: "sun" as const,
      },
    }),
    [t]
  );
  return (
    <View style={styles.heroBlock}>
      <View style={styles.heroLeft}>
        <FeaturedCard
          item={topLeft as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(topLeft.$id)}
          actionLabel={t("library.actionOpen")}
          cardWidth={coranColWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
        <View style={styles.heroGap} />
        <FeaturedCard
          item={bottomLeft as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(bottomLeft.$id)}
          actionLabel={t("library.actionOpen")}
          cardWidth={coranColWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
      </View>
      <View style={styles.heroRight}>
        <FeaturedCard
          item={right as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(right.$id)}
          actionLabel={t("library.actionOpen")}
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
  const { t } = useTranslation();
  const { topLeft, topRight, bottom } = useMemo(
    () => ({
      topLeft: {
        $id: "hadith-jour" as const,
        name: t("library.hadithDay"),
        price: t("library.hadithDaySub"),
        icon: "message-circle" as const,
      },
      topRight: {
        $id: "hadiths-theme" as const,
        name: t("library.hadithThemes"),
        price: t("library.hadithThemesSub"),
        icon: "bookmark" as const,
      },
      bottom: {
        $id: "hadiths" as const,
        name: t("library.hadithAll"),
        price: t("library.hadithAllSub"),
        icon: "book-open" as const,
      },
    }),
    [t]
  );
  return (
    <View style={[styles.heroBlock, styles.hadithsBlock]}>
      <View style={styles.hadithsTopRow}>
        <FeaturedCard
          item={topLeft as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(topLeft.$id)}
          actionLabel={t("library.actionOpen")}
          cardWidth={coranColWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
        <View style={styles.heroGapHorizontal} />
        <FeaturedCard
          item={topRight as Parameters<typeof FeaturedCard>[0]["item"]}
          onPress={() => pushLibraryRoute(topRight.$id)}
          actionLabel={t("library.actionOpen")}
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
          actionLabel={t("library.actionOpen")}
          cardWidth={contentWidth}
          cardHeight={smallCardHeight}
          noMargin
        />
      </View>
    </View>
  );
}

export default function BibliothequeScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenPageHeader
          title={t("screens.libraryTitle")}
          subtitle={t("screens.librarySubtitle")}
          style={screenPageHeaderSpacing}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <SectionHeader
              title={t("library.sectionQuran")}
              seeAllLabel={t("library.seeAll")}
            />
            <CoranHeroBlock />
          </View>
          <View style={styles.section}>
            <SectionHeader
              title={t("library.sectionInvocations")}
              seeAllLabel={t("library.seeAll")}
            />
            <InvocationsHeroBlock />
          </View>
          <View style={styles.section}>
            <SectionHeader
              title={t("library.sectionHadiths")}
              seeAllLabel={t("library.seeAll")}
            />
            <HadithsHeroBlock />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  scrollContent: {
    ...screenScrollContent,
    paddingTop: 4,
  },
  section: {
    marginTop: 32,
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
