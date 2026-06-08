import { StyleSheet } from "react-native";

import type { AppThemeColors } from "@/lib/app-theme";
import { CARD_RADIUS, SECTION_GAP, SPACE } from "@/lib/ui/spacing";
import {
  LIBRARY_CARD_HEIGHT,
  LIBRARY_ICON_SIZE,
} from "@/lib/library/catalog";

export function createLibraryScreenStyles(c: AppThemeColors) {
  return StyleSheet.create({
    section: {
      marginTop: 0,
    },
    sectionFirst: {
      marginTop: SPACE.sm,
    },
    sectionHeader: {
      marginBottom: SPACE.md,
    },
    sectionDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.divider,
      marginVertical: SECTION_GAP,
    },
    headerDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.divider,
      marginTop: SPACE.sm,
      marginBottom: SPACE.md,
    },
    rowContent: {
      paddingTop: SPACE.xs,
      paddingBottom: SPACE.sm,
    },
    card: {
      height: LIBRARY_CARD_HEIGHT,
      borderRadius: CARD_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      backgroundColor: c.usesBackgroundImage ? "transparent" : c.card,
      paddingTop: SPACE.md,
      paddingHorizontal: SPACE.md,
      paddingBottom: SPACE.sm,
      justifyContent: "space-between",
    },
    cardPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.98 }],
    },
    cardDisabled: {
      opacity: 0.52,
    },
    iconWrap: {
      width: LIBRARY_ICON_SIZE,
      height: LIBRARY_ICON_SIZE,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.accentSurface,
      alignSelf: "center",
    },
    textBlock: {
      alignItems: "center",
      gap: 4,
      marginTop: SPACE.sm,
    },
    title: {
      fontSize: 15,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.text,
      textAlign: "center",
      width: "100%",
      lineHeight: 19,
    },
    subtitle: {
      fontSize: 12,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      textAlign: "center",
      width: "100%",
      lineHeight: 16,
    },
    cardDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.divider,
      marginTop: SPACE.sm,
      alignSelf: "stretch",
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      marginTop: SPACE.sm,
      paddingTop: SPACE.sm,
      minHeight: 22,
      alignSelf: "stretch",
    },
    action: {
      fontSize: 12,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.accent,
    },
    soonPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: c.accentSurface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.accentBorder,
    },
    soonText: {
      fontSize: 11,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.accent,
    },
  });
}
