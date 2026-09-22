import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppImage } from "@/components/AppImage";
import {
  COVER_FADE_COLORS,
  COVER_FADE_HEIGHT_RATIO,
  COVER_FADE_LOCATIONS,
} from "@/components/explore/CoverCaptionBand";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { CARD_RADIUS, SHADOW, SPACE } from "@/lib/ui/spacing";

const quranArtwork = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

/** Ratio cover (largeur / hauteur) — cinéma léger, lisible sur mobile. */
const COVER_RATIO = 1.55;
const PLAY_SIZE = 54;

/** Triangle play sans react-native-svg (évite le double-register HMR RNSVG*). */
function PlayGlyph({ size = 18, color }: { size?: number; color: string }) {
  const half = size * 0.42;
  const depth = size * 0.72;
  return (
    <View
      style={{
        width: 0,
        height: 0,
        marginLeft: size * 0.1,
        borderStyle: "solid",
        borderTopWidth: half,
        borderBottomWidth: half,
        borderLeftWidth: depth,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: color,
      }}
    />
  );
}

/** Pastille blanche + triangle accent (vert de l’app). */
function PlayButton() {
  const colors = useAppTheme();

  return (
    <View style={styles.playOuter} pointerEvents="none">
      <View style={styles.playGlyphWrap}>
        <PlayGlyph size={18} color={colors.accent} />
      </View>
    </View>
  );
}

/** Alias HMR : anciennes références GlassPlayButton. */
const GlassPlayButton = PlayButton;

type FeaturedListenHeroProps = {
  /** Nom de la sourate */
  title: string;
  /** Récitateur (ligne principale sous le titre) */
  reciter: string;
  /** Libellé secondaire optionnel (ex. progression) */
  progressLabel?: string;
  /** 0–1 pour la barre de progression */
  progress?: number;
  onPress: () => void;
  contentWidth?: number;
};

/**
 * Carte « reprendre l’écoute » :
 * cover plein cadre, fondu bas, texte sur l’image, play blanc + accent.
 */
export function FeaturedListenHero({
  title,
  reciter,
  progressLabel,
  progress,
  onPress,
  contentWidth: contentWidthProp,
}: FeaturedListenHeroProps) {
  const colors = useAppTheme();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = Math.max(
    contentWidthProp ?? windowWidth - SCREEN_EDGE_PADDING * 2,
    280
  );
  const mediaHeight = Math.round(contentWidth / COVER_RATIO);
  const gradientHeight = Math.round(mediaHeight * COVER_FADE_HEIGHT_RATIO);
  const showProgress =
    typeof progress === "number" && progress > 0 && progress < 1;
  const cardShadow = colors.isDark ? SHADOW.dark : SHADOW.light;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardShell,
        cardShadow,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${t("explore.resumePlay")}, ${title}, ${reciter}`}
    >
      <View style={[styles.card, { height: mediaHeight }]}>
        <AppImage
          source={quranArtwork}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          recyclingKey="featured-quran-cover"
        />

        <View style={styles.topScrim} pointerEvents="none" />

        <LinearGradient
          colors={[...COVER_FADE_COLORS]}
          locations={[...COVER_FADE_LOCATIONS]}
          style={[styles.bottomFade, { height: gradientHeight }]}
          pointerEvents="none"
        />

        <View
          style={[styles.bottomContent, rtlViewStyle]}
          pointerEvents="none"
        >
          <View style={styles.textCol}>
            <Text style={[styles.eyebrow, rtlTextStyle]} numberOfLines={1}>
              {t("explore.resumePlay")}
            </Text>
            <Text style={[styles.title, rtlTextStyle]} numberOfLines={2}>
              {title}
            </Text>
            <Text style={[styles.reciter, rtlTextStyle]} numberOfLines={1}>
              {reciter}
            </Text>
            {showProgress ? (
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.round((progress ?? 0) * 100)}%`,
                      backgroundColor: colors.accent,
                    },
                  ]}
                />
              </View>
            ) : progressLabel ? (
              <Text style={[styles.progressHint, rtlTextStyle]} numberOfLines={1}>
                {progressLabel}
              </Text>
            ) : null}
          </View>

          <PlayButton />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardShell: {
    borderRadius: CARD_RADIUS,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.992 }],
  },
  card: {
    width: "100%",
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  topScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACE.sm,
    paddingHorizontal: SPACE.md,
    paddingBottom: SPACE.md,
    paddingTop: SPACE.lg,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: SPACE.xs,
  },
  eyebrow: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    marginBottom: 4,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 22,
    lineHeight: 28,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  reciter: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255,255,255,0.88)",
    marginTop: 4,
  },
  progressHint: {
    fontFamily: "PlusJakartaSans-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
    marginTop: SPACE.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  playOuter: {
    width: PLAY_SIZE,
    height: PLAY_SIZE,
    borderRadius: PLAY_SIZE / 2,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
      default: {},
    }),
  },
  playGlyphWrap: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
