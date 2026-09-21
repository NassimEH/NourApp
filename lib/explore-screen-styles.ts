import { Dimensions, StyleSheet } from "react-native";

import type { AppThemeColors } from "@/lib/app-theme";
import type { AppTypography } from "@/lib/app-typography";
import {
  SCREEN_EDGE_PADDING,
  screenScrollContent,
} from "@/constants/screen-layout";
import {
  CARD_RADIUS,
  CHIP_RADIUS,
  MIN_TOUCH_TARGET,
  SECTION_GAP,
  SPACE,
} from "@/lib/ui/spacing";

const H_PADDING = SCREEN_EDGE_PADDING;
const GRID_GAP = SPACE.xs;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const GRID_CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GRID_GAP) / 2;
export const GRID_CARD_HEIGHT = 56;
export const GRID_ICON_SIZE = 56;

export const SQUARE_TILE_SIZE = 140;
export const JUZ_TILE_SIZE = 100;

export function createExploreScreenStyles(
  c: AppThemeColors,
  typography: AppTypography
) {
  const surface = c.usesBackgroundImage ? c.card : c.cardElevated;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: H_PADDING,
      paddingTop: SPACE.xs,
      paddingBottom: SPACE.sm,
      gap: SPACE.sm,
    },
    avatarBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      flexShrink: 0,
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    tabsScroll: {
      flex: 1,
    },
    tabsContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      paddingRight: SPACE.xs,
    },
    tab: {
      paddingHorizontal: SPACE.md,
      paddingVertical: 8,
      minHeight: 36,
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
    scroll: {
      flex: 1,
    },
    scrollContent: {
      ...screenScrollContent,
      paddingTop: SPACE.xs,
      paddingBottom: 140,
    },
    loader: {
      marginVertical: SPACE.xxl,
    },
    compactGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: GRID_GAP,
      marginBottom: SPACE.md,
    },
    compactCard: {
      width: GRID_CARD_WIDTH,
      height: GRID_CARD_HEIGHT,
      minHeight: MIN_TOUCH_TARGET,
      backgroundColor: surface,
      borderRadius: CARD_RADIUS,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    compactCardPressed: {
      opacity: 0.9,
    },
    compactCardIconWrap: {
      width: GRID_ICON_SIZE,
      height: GRID_ICON_SIZE,
      backgroundColor: c.accentSurface,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },
    compactCardBody: {
      flex: 1,
      height: "100%",
      justifyContent: "center",
      paddingHorizontal: SPACE.sm,
      paddingVertical: 6,
      gap: 4,
    },
    compactCardTitle: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: typography.caption,
      color: c.text,
    },
    progressTrack: {
      height: 2,
      borderRadius: 1,
      backgroundColor: c.divider,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 1,
      backgroundColor: c.accent,
    },
    section: {
      marginTop: SPACE.xxl,
    },
    sectionFirst: {
      marginTop: SPACE.lg,
    },
    sectionHeader: {
      marginBottom: SPACE.md,
    },
    horizontalScroll: {
      flexDirection: "row",
      gap: SPACE.sm,
      paddingRight: H_PADDING,
    },
    resumeCard: {
      flexDirection: "row",
      alignItems: "stretch",
      minHeight: 112,
      backgroundColor: surface,
      borderRadius: CARD_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      overflow: "hidden",
    },
    resumeCardPressed: {
      opacity: 0.92,
    },
    resumeArt: {
      width: 112,
      backgroundColor: c.accentSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    resumeBody: {
      flex: 1,
      paddingVertical: SPACE.sm,
      paddingHorizontal: SPACE.md,
      justifyContent: "space-between",
      gap: SPACE.xs,
    },
    resumeEyebrow: {
      fontFamily: "PlusJakartaSans-Medium",
      fontSize: 11,
      letterSpacing: 0.3,
      textTransform: "uppercase",
      color: c.textMuted,
    },
    resumeTitle: {
      fontFamily: "PlusJakartaSans-Bold",
      fontSize: typography.body + 1,
      lineHeight: typography.body + 6,
      color: c.text,
    },
    resumeSubtitle: {
      fontFamily: "PlusJakartaSans-Regular",
      fontSize: typography.caption,
      lineHeight: typography.caption + 4,
      color: c.textMuted,
    },
    resumeActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: SPACE.xs,
    },
    playBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    squareTile: {
      width: SQUARE_TILE_SIZE,
    },
    squareTilePressed: {
      opacity: 0.9,
    },
    squareArt: {
      width: SQUARE_TILE_SIZE,
      height: SQUARE_TILE_SIZE,
      borderRadius: CARD_RADIUS,
      backgroundColor: c.accentSurface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SPACE.sm,
    },
    squareTitle: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: typography.caption,
      lineHeight: typography.caption + 4,
      color: c.text,
    },
    squareSubtitle: {
      fontFamily: "PlusJakartaSans-Regular",
      fontSize: 11,
      lineHeight: 14,
      color: c.textMuted,
      marginTop: 2,
    },
    juzTile: {
      width: JUZ_TILE_SIZE,
      alignItems: "center",
    },
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
    },
    juzLabel: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: typography.caption,
      color: c.text,
      textAlign: "center",
    },
    sectionTail: {
      height: SECTION_GAP,
    },
  });
}
