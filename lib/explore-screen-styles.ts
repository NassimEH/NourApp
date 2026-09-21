import { StyleSheet } from "react-native";

import type { AppThemeColors } from "@/lib/app-theme";
import type { AppTypography } from "@/lib/app-typography";
import {
  SCREEN_EDGE_PADDING,
  screenScrollContent,
} from "@/constants/screen-layout";
import {
  CARD_RADIUS,
  CHIP_RADIUS,
  SECTION_GAP,
  SPACE,
} from "@/lib/ui/spacing";

const H_PADDING = SCREEN_EDGE_PADDING;

export const GRID_COVER = 56;
export const GRID_GAP = 8;
export const SQUARE_TILE_SIZE = 148;
export const JUZ_TILE_SIZE = 110;
export const HERO_THUMB = 48;

export function createExploreScreenStyles(
  c: AppThemeColors,
  typography: AppTypography,
  layout: { contentWidth: number; tileWidth: number }
) {
  const surface = c.usesBackgroundImage ? c.card : c.cardElevated;
  const contentWidth = Math.max(layout.contentWidth, 280);
  const tileWidth = layout.tileWidth;
  const heroMediaHeight = Math.round(contentWidth / 1.45);

  return StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },

    /** Titre de page au-dessus de la barre Spotify */
    pageTitle: {
      fontFamily: "PlusJakartaSans-Bold",
      fontSize: typography.pageTitle,
      lineHeight: Math.round(typography.pageTitle * 1.15),
      color: c.text,
      paddingHorizontal: H_PADDING,
      paddingTop: SPACE.xs,
      paddingBottom: SPACE.sm,
    },

    /** Spotify : avatar + chips sur la MÊME ligne */
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: H_PADDING,
      paddingBottom: SPACE.md,
      gap: SPACE.sm,
    },
    avatarBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: c.accentSurface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      flexShrink: 0,
    },
    avatarImage: {
      width: 36,
      height: 36,
    },
    chipsScroll: {
      flexGrow: 1,
      flexShrink: 1,
    },
    chipsContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      paddingRight: H_PADDING,
    },
    tab: {
      paddingHorizontal: SPACE.md,
      height: 36,
      justifyContent: "center",
      borderRadius: CHIP_RADIUS,
      backgroundColor: c.accentSurface,
    },
    tabActive: {
      backgroundColor: c.accent,
    },
    tabLabel: {
      fontSize: 13,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    tabLabelActive: {
      color: c.onAccent,
    },

    scroll: { flex: 1 },
    scrollContent: {
      ...screenScrollContent,
      paddingTop: 0,
      paddingBottom: 140,
    },
    loader: { marginVertical: SPACE.xxl },

    grid: {
      gap: GRID_GAP,
      marginBottom: SPACE.sm,
    },
    gridRow: {
      flexDirection: "row",
      gap: GRID_GAP,
    },

    /** Largeur pixel fixe — pas de flex:1 (cassé par Pressable web) */
    tilePressable: {
      width: tileWidth,
      height: GRID_COVER,
    },
    tileInner: {
      width: tileWidth,
      height: GRID_COVER,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: surface,
    },
    tilePressed: {
      opacity: 0.85,
    },
    tileCover: {
      width: GRID_COVER,
      height: GRID_COVER,
    },
    tileCoverImg: {
      width: GRID_COVER,
      height: GRID_COVER,
    },
    tileBadge: {
      ...StyleSheet.absoluteFill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.35)",
    },
    tileBadgeText: {
      fontFamily: "PlusJakartaSans-Bold",
      fontSize: 15,
      color: "#FFFFFF",
    },
    tileBody: {
      width: tileWidth - GRID_COVER,
      height: GRID_COVER,
      justifyContent: "center",
      paddingHorizontal: 10,
      gap: 4,
    },
    tileTitle: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: typography.caption,
      lineHeight: typography.caption + 3,
      color: c.text,
    },
    progressTrack: {
      height: 3,
      borderRadius: 2,
      backgroundColor: c.divider,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 2,
      backgroundColor: c.accent,
    },

    section: { marginTop: SPACE.xxl },
    sectionFirst: { marginTop: SPACE.lg },
    sectionHeader: { marginBottom: SPACE.md },
    horizontalScroll: {
      flexDirection: "row",
      gap: SPACE.sm,
      paddingRight: H_PADDING,
    },

    heroCard: {
      borderRadius: CARD_RADIUS,
      overflow: "hidden",
      backgroundColor: surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    heroCardPressed: { opacity: 0.94 },
    heroMedia: {
      width: "100%",
      height: heroMediaHeight,
      backgroundColor: c.accentSurface,
      overflow: "hidden",
    },
    heroMediaImage: {
      width: "100%",
      height: heroMediaHeight,
    },
    heroOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(0,0,0,0.25)",
    },
    heroPlayBtn: {
      position: "absolute",
      right: SPACE.md,
      bottom: SPACE.md,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    heroMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      paddingHorizontal: SPACE.sm,
      paddingVertical: SPACE.sm,
    },
    heroThumb: {
      width: HERO_THUMB,
      height: HERO_THUMB,
      borderRadius: 4,
    },
    heroMetaText: { flex: 1, minWidth: 0, gap: 2 },
    heroTitle: {
      fontFamily: "PlusJakartaSans-Bold",
      fontSize: typography.body,
      color: c.text,
    },
    heroSubtitle: {
      fontFamily: "PlusJakartaSans-Regular",
      fontSize: typography.caption,
      color: c.textMuted,
    },

    squareTile: { width: SQUARE_TILE_SIZE },
    squareTilePressed: { opacity: 0.9 },
    squareArt: {
      width: SQUARE_TILE_SIZE,
      height: SQUARE_TILE_SIZE,
      borderRadius: CARD_RADIUS,
      backgroundColor: c.accentSurface,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SPACE.sm,
    },
    squareArtImage: {
      width: SQUARE_TILE_SIZE,
      height: SQUARE_TILE_SIZE,
    },
    squareArtInitials: {
      fontFamily: "PlusJakartaSans-Bold",
      fontSize: 36,
      color: c.accent,
    },
    squareTitle: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: typography.caption,
      color: c.text,
    },
    squareSubtitle: {
      fontFamily: "PlusJakartaSans-Regular",
      fontSize: 11,
      color: c.textMuted,
      marginTop: 2,
    },

    juzTile: { width: JUZ_TILE_SIZE },
    juzArt: {
      width: JUZ_TILE_SIZE,
      height: JUZ_TILE_SIZE,
      borderRadius: CARD_RADIUS,
      backgroundColor: surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SPACE.sm,
      overflow: "hidden",
    },
    juzNumber: {
      fontFamily: "PlusJakartaSans-Bold",
      fontSize: 36,
      color: c.accent,
    },
    juzLabel: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: typography.caption,
      color: c.text,
    },
    sectionTail: { height: SECTION_GAP },
  });
}
