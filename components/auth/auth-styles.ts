import { StyleSheet } from "react-native";

import type { AppThemeColors } from "@/lib/app-theme";
import { SPACE } from "@/lib/ui/spacing";

export const AUTH_PILL_RADIUS = 26;

/** Espacements uniformes pour les écrans d'authentification */
export const AUTH_SPACE = {
  screenTop: SPACE.lg,
  screenBottom: SPACE.xxl,
  section: SPACE.xl,
  block: SPACE.xxl,
  field: SPACE.md,
  buttonGap: SPACE.lg,
  footer: SPACE.xxl,
} as const;

/** Bouton principal rempli — contraste lisible en clair et en sombre */
export function getAuthPrimaryButtonColors(colors: AppThemeColors) {
  if (colors.isDark) {
    return {
      backgroundColor: "#FFFFFF",
      labelColor: "#1F2937",
      spinnerColor: "#1F2937",
    };
  }
  return {
    backgroundColor: colors.text,
    labelColor: "#FFFFFF",
    spinnerColor: "#FFFFFF",
  };
}

export const authSharedStyles = StyleSheet.create({
  scrollContent: {
    paddingTop: AUTH_SPACE.screenTop,
    paddingBottom: AUTH_SPACE.screenBottom,
  },
  formBlock: {
    gap: AUTH_SPACE.field,
    marginBottom: AUTH_SPACE.buttonGap,
  },
  pillButton: {
    borderRadius: AUTH_PILL_RADIUS,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  pillButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    letterSpacing: 0.2,
  },
  pillButtonInverted: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
  },
  pillButtonInvertedText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    letterSpacing: 0.2,
  },
  textLink: {
    alignSelf: "center",
    paddingVertical: SPACE.sm,
  },
  textLinkLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "center",
  },
  authFooter: {
    marginTop: AUTH_SPACE.footer,
    alignItems: "center",
    gap: AUTH_SPACE.field,
    width: "100%",
  },
  authFooterPrompt: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  signUpCtaButton: {
    borderRadius: AUTH_PILL_RADIUS,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 1.5,
  },
  signUpCtaButtonText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    letterSpacing: 0.2,
  },
  orDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.md,
    width: "100%",
    marginVertical: AUTH_SPACE.buttonGap,
  },
  orDividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  orDividerLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
  },
  guestLink: {
    alignSelf: "center",
    paddingVertical: SPACE.sm,
    marginTop: SPACE.xs,
  },
  guestLinkLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: AUTH_SPACE.section,
    flexWrap: "wrap",
    gap: 4,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    marginTop: AUTH_SPACE.section,
    marginBottom: AUTH_SPACE.section,
  },
});
