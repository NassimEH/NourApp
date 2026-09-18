import { StyleSheet } from "react-native";

import type { AppThemeColors } from "@/lib/app-theme";
import type { AppTypography } from "@/lib/app-typography";
import { CARD_RADIUS, SPACE } from "@/lib/ui/spacing";

export function createLibraryScreenStyles(
  c: AppThemeColors,
  typography: AppTypography
) {
  return StyleSheet.create({
    rowWrap: {
      position: "relative",
    },
    horizontalRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 2,
    },
    mediaCard: {
      width: "100%",
      justifyContent: "flex-start",
    },
    mediaCardPressed: {
      opacity: 0.88,
    },
    mediaFrame: {
      borderRadius: CARD_RADIUS,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      backgroundColor: c.accentSurface,
    },
    mediaImage: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    mediaText: {
      marginTop: SPACE.sm,
      gap: 2,
      paddingHorizontal: 2,
      minHeight: typography.body + 4 + 2 + (typography.caption + 3) * 2,
    },
    mediaTitle: {
      fontSize: typography.body,
      lineHeight: typography.body + 4,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
      height: typography.body + 4,
    },
    mediaSubtitle: {
      fontSize: typography.caption,
      lineHeight: typography.caption + 3,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      minHeight: (typography.caption + 3) * 2,
    },
    edgeFade: {
      position: "absolute",
      top: 0,
      bottom: 28,
      width: 36,
      zIndex: 2,
      pointerEvents: "none",
    },
    edgeFadeLeft: {
      left: 0,
    },
    edgeFadeRight: {
      right: 0,
    },
    arrowHit: {
      position: "absolute",
      top: 0,
      bottom: 28,
      width: 36,
      zIndex: 3,
      alignItems: "center",
      justifyContent: "center",
    },
    arrowHitLeft: {
      left: 0,
    },
    arrowHitRight: {
      right: 0,
    },
    arrowDisc: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.isDark
        ? "rgba(0,0,0,0.45)"
        : "rgba(255,255,255,0.82)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
  });
}
