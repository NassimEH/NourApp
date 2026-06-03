import { StyleSheet } from "react-native";

import type { AppThemeColors } from "@/lib/app-theme";
import { CARD_RADIUS, MIN_TOUCH_TARGET, SECTION_GAP, SPACE } from "@/lib/ui/spacing";

export const LEARN_RECENT_TILE_WIDTH = 120;
export const LEARN_RECENT_TILE_HEIGHT = 118;

export function createLearnScreenStyles(c: AppThemeColors) {
  const cardBg = c.usesBackgroundImage ? "transparent" : c.card;

  return StyleSheet.create({
    scrollContent: {
      paddingTop: SPACE.sm,
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
      paddingHorizontal: SPACE.sm,
      paddingVertical: 6,
      borderRadius: CARD_RADIUS,
      backgroundColor: c.accentSurface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    streakCount: {
      fontSize: 18,
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
      marginBottom: SPACE.md,
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
    rowPressable: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.md,
      paddingVertical: SPACE.md,
      minHeight: MIN_TOUCH_TARGET + 4,
    },
    rowPressablePressed: {
      opacity: 0.88,
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
      gap: 3,
    },
    rowTitle: {
      fontSize: 16,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    rowSub: {
      fontSize: 13,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      lineHeight: 18,
    },
    rowAction: {
      fontSize: 13,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.accent,
    },
    highlightBlock: {
      paddingVertical: SPACE.md,
      gap: SPACE.xs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.divider,
      marginBottom: SPACE.md,
    },
    highlightLabel: {
      fontSize: 11,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    highlightTitle: {
      fontSize: 17,
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
      marginTop: SPACE.sm,
    },
    recentScroll: {
      gap: SPACE.sm,
      paddingTop: SPACE.xs,
      paddingBottom: SPACE.xs,
    },
    recentTile: {
      width: LEARN_RECENT_TILE_WIDTH,
      height: LEARN_RECENT_TILE_HEIGHT,
      borderRadius: CARD_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      backgroundColor: cardBg,
      padding: SPACE.sm,
      justifyContent: "space-between",
    },
    recentTilePressed: {
      opacity: 0.9,
    },
    recentNumber: {
      fontSize: 13,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.accent,
    },
    recentTitle: {
      fontSize: 13,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    recentSub: {
      fontSize: 11,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      lineHeight: 14,
    },
    emptyRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      paddingVertical: SPACE.md,
    },
    chipScroll: {
      gap: SPACE.sm,
      paddingBottom: SPACE.md,
    },
    chip: {
      paddingHorizontal: SPACE.md,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      backgroundColor: "transparent",
      maxWidth: 220,
      minHeight: MIN_TOUCH_TARGET - 4,
      justifyContent: "center",
    },
    chipActive: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    chipText: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    chipTextActive: {
      color: c.onAccent,
    },
    planHeader: {
      marginBottom: SPACE.md,
      gap: 4,
    },
    planTitle: {
      fontSize: 20,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
    },
    planSub: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      lineHeight: 20,
    },
    lessonList: {
      marginTop: SPACE.xs,
    },
    lessonRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.md,
      paddingVertical: SPACE.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.divider,
      minHeight: MIN_TOUCH_TARGET + 8,
    },
    lessonRowLocked: {
      opacity: 0.52,
    },
    lessonRowPressed: {
      opacity: 0.9,
    },
    lessonAccentBar: {
      width: 3,
      alignSelf: "stretch",
      borderRadius: 2,
      backgroundColor: c.accent,
      marginVertical: 2,
    },
    lessonMeta: {
      fontSize: 11,
      fontFamily: "PlusJakartaSans-Medium",
      color: c.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    lessonTitle: {
      fontSize: 15,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
      lineHeight: 20,
    },
    completedBadge: {
      fontSize: 11,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.accent,
    },
  });
}
