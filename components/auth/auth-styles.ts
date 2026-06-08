import { StyleSheet } from "react-native";

export const AUTH_PILL_RADIUS = 26;

export const authSharedStyles = StyleSheet.create({
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
  textLink: {
    alignSelf: "center",
    paddingVertical: 10,
  },
  textLinkLabel: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    flexWrap: "wrap",
    gap: 4,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    marginBottom: 24,
  },
});
