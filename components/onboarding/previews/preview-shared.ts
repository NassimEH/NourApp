import { StyleSheet } from "react-native";

export const ACCENT = "#3d6b47";
export const TEXT = "#191D31";
export const MUTED = "#5b5d5e";
export const CARD_BG = "rgba(61, 107, 71, 0.12)";
export const PREVIEW_PAD = 14;

export const previewShared = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7f4",
  },
  statusBar: {
    height: 44,
    paddingHorizontal: PREVIEW_PAD,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 6,
  },
  statusTime: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
    paddingHorizontal: PREVIEW_PAD,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: MUTED,
    paddingHorizontal: PREVIEW_PAD,
    marginBottom: 14,
  },
});
