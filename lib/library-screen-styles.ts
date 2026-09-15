import { StyleSheet } from "react-native";

import type { AppThemeColors } from "@/lib/app-theme";
import type { AppTypography } from "@/lib/app-typography";
import { CARD_RADIUS, LIST_GAP, SPACE } from "@/lib/ui/spacing";

export function createLibraryScreenStyles(
  c: AppThemeColors,
  typography: AppTypography
) {
  return StyleSheet.create({
    hero: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.md,
      paddingVertical: SPACE.md,
      paddingHorizontal: SPACE.md,
      borderRadius: CARD_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      backgroundColor: c.usesBackgroundImage ? c.cardElevated : c.card,
      marginBottom: LIST_GAP,
    },
    heroPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.99 }],
    },
    heroIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.accentSurface,
      flexShrink: 0,
    },
    heroText: {
      flex: 1,
      minWidth: 0,
      gap: 4,
    },
    heroTitle: {
      fontSize: typography.bodyMedium + 1,
      lineHeight: typography.bodyMedium + 8,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
      letterSpacing: -0.2,
    },
    heroSubtitle: {
      fontSize: typography.caption,
      lineHeight: typography.caption + 4,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
    },
    grid: {
      gap: LIST_GAP,
    },
    gridRow: {
      flexDirection: "row",
      gap: LIST_GAP,
    },
    gridCell: {
      flex: 1,
      minWidth: 0,
    },
    shortcuts: {
      gap: LIST_GAP - 2,
      marginTop: LIST_GAP,
    },
    shortcut: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.sm,
      paddingVertical: SPACE.sm,
      paddingHorizontal: SPACE.md,
      borderRadius: CARD_RADIUS - 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      backgroundColor: c.usesBackgroundImage ? "transparent" : c.card,
      minHeight: 52,
    },
    shortcutPressed: {
      opacity: 0.88,
    },
    shortcutIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.accentSurface,
      flexShrink: 0,
    },
    shortcutText: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    shortcutTitle: {
      fontSize: typography.body,
      lineHeight: typography.body + 4,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    shortcutSubtitle: {
      fontSize: typography.caption,
      lineHeight: typography.caption + 3,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
    },
    teaser: {
      paddingVertical: SPACE.sm,
      gap: SPACE.sm,
      marginBottom: LIST_GAP - 2,
    },
    teaserMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    teaserBadge: {
      fontSize: typography.caption,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.accent,
    },
    teaserBody: {
      fontSize: typography.body,
      lineHeight: typography.body + 8,
      fontFamily: "PlusJakartaSans-Medium",
      color: c.text,
    },
    teaserSource: {
      fontSize: typography.caption,
      lineHeight: typography.caption + 4,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      fontStyle: "italic",
    },
    teaserPressed: {
      opacity: 0.92,
    },
  });
}
