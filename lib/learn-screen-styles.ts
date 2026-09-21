import { StyleSheet } from "react-native";

import type { AppThemeColors } from "@/lib/app-theme";
import type { AppTypography } from "@/lib/app-typography";
import {
  CARD_RADIUS,
  LIST_GAP,
  MIN_TOUCH_TARGET,
  SECTION_GAP,
  SECTION_TITLE_GAP,
  SHADOW,
  SPACE,
} from "@/lib/ui/spacing";

export const LEARN_RECENT_TILE_WIDTH = 148;
export const LEARN_RECENT_TILE_HEIGHT = 132;
export const LEARN_GOAL_ART_SIZE = 88;

export function createLearnScreenStyles(
  c: AppThemeColors,
  typography: AppTypography
) {
  const elevatedBg = c.usesBackgroundImage ? c.card : c.cardElevated;
  const cardShadow = c.isDark ? SHADOW.dark : SHADOW.light;

  return StyleSheet.create({
    scrollContent: {
      paddingTop: SPACE.md,
      paddingBottom: 120,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
    },
    streakBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      minHeight: MIN_TOUCH_TARGET,
      paddingHorizontal: 2,
    },
    streakCount: {
      fontSize: typography.title,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
    },
    headerAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    statsButton: {
      minHeight: MIN_TOUCH_TARGET,
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.xs,
    },
    statsButtonText: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.divider,
      marginVertical: SECTION_GAP,
    },
    dividerTight: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.divider,
      marginVertical: SPACE.md,
    },
    tabsRow: {
      flexDirection: "row",
      gap: SPACE.lg,
      marginBottom: SECTION_GAP,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.divider,
    },
    tab: {
      paddingBottom: SPACE.sm,
      minHeight: MIN_TOUCH_TARGET,
      justifyContent: "center",
    },
    tabLabel: {
      fontFamily: "PlusJakartaSans-Medium",
      color: c.textMuted,
    },
    tabLabelActive: {
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
    },
    tabUnderline: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: -StyleSheet.hairlineWidth,
      height: 2,
      borderRadius: 1,
      backgroundColor: c.accent,
    },
    todayStack: {
      gap: SECTION_GAP,
    },
    rowPressable: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      paddingVertical: SPACE.md,
      minHeight: MIN_TOUCH_TARGET + 4,
    },
    rowPressablePressed: {
      opacity: 0.88,
    },
    goalIcon: {
      marginTop: 1,
    },
    goalCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.md,
      paddingVertical: SPACE.md,
      paddingLeft: SPACE.lg,
      paddingRight: SPACE.sm,
      borderRadius: CARD_RADIUS,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: elevatedBg,
      overflow: "hidden",
      minHeight: 108,
      ...cardShadow,
    },
    goalCardPressed: {
      opacity: 0.94,
    },
    goalCardBody: {
      flex: 1,
      gap: SPACE.sm,
      paddingVertical: SPACE.xs,
      minWidth: 0,
    },
    goalCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.xs,
    },
    goalCardTitle: {
      fontSize: typography.body,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
      flexShrink: 1,
    },
    goalCardSub: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      lineHeight: 18,
    },
    goalProgressTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: c.accentSurface,
      overflow: "hidden",
      marginTop: 2,
    },
    goalProgressFill: {
      height: "100%",
      borderRadius: 3,
      backgroundColor: c.accent,
    },
    goalArtWrap: {
      width: LEARN_GOAL_ART_SIZE,
      height: LEARN_GOAL_ART_SIZE,
      alignItems: "center",
      justifyContent: "center",
    },
    goalArt: {
      width: LEARN_GOAL_ART_SIZE,
      height: LEARN_GOAL_ART_SIZE,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.accentSurface,
    },
    iconWrapMuted: {
      backgroundColor: c.usesBackgroundImage
        ? "rgba(128,128,128,0.12)"
        : c.backgroundSecondary,
    },
    rowBody: {
      flex: 1,
      gap: SPACE.xs,
    },
    rowTitle: {
      fontSize: typography.body,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    rowSub: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      lineHeight: 18,
    },
    rowAction: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.accent,
    },
    lessonCard: {
      flexDirection: "row",
      alignItems: "stretch",
      gap: SPACE.md,
      padding: SPACE.lg,
      borderRadius: CARD_RADIUS,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: elevatedBg,
      minHeight: MIN_TOUCH_TARGET + 28,
      ...cardShadow,
    },
    lessonCardPressed: {
      opacity: 0.92,
    },
    lessonCardBody: {
      flex: 1,
      gap: SPACE.xs,
      justifyContent: "center",
    },
    lessonCardLabel: {
      fontSize: typography.sectionTitle,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    lessonCardTitle: {
      fontSize: typography.bodyMedium,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
      lineHeight: 22,
    },
    lessonCardHint: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      lineHeight: 18,
    },
    lessonCardCta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: SPACE.xs,
    },
    lessonCardChevron: {
      justifyContent: "center",
    },
    highlightBlock: {
      paddingVertical: SPACE.md,
      gap: SPACE.xs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.divider,
      marginBottom: SPACE.md,
    },
    highlightLabel: {
      fontSize: typography.sectionTitle,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    highlightTitle: {
      fontSize: typography.bodyMedium,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
      lineHeight: 22,
    },
    highlightCta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: SPACE.xs,
    },
    section: {
      gap: SECTION_TITLE_GAP,
    },
    recentScroll: {
      gap: LIST_GAP,
      paddingTop: SPACE.xs,
      paddingBottom: SPACE.xs,
    },
    recentTile: {
      width: LEARN_RECENT_TILE_WIDTH,
      height: LEARN_RECENT_TILE_HEIGHT,
      borderRadius: CARD_RADIUS,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: elevatedBg,
      padding: SPACE.md,
      justifyContent: "space-between",
      ...cardShadow,
    },
    recentTilePressed: {
      opacity: 0.9,
    },
    recentBadge: {
      alignSelf: "flex-start",
      minWidth: 28,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: c.accentSurface,
      alignItems: "center",
    },
    recentNumber: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.accent,
    },
    recentArabic: {
      fontSize: typography.bodyMedium,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
      textAlign: "right",
      writingDirection: "rtl",
      lineHeight: 24,
    },
    recentTitle: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    recentSub: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      lineHeight: 14,
    },
    emptyRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      paddingVertical: SPACE.lg,
      paddingHorizontal: SPACE.md,
      borderRadius: CARD_RADIUS,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: elevatedBg,
    },
  });
}
