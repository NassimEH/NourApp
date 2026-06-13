import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import {
  ACCENT,
  CARD_BG,
  PREVIEW_PAD,
  TEXT,
  previewShared,
} from "./preview-shared";

const quranImage = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

const TABS = ["Tout", "Sourates", "Récitateurs", "Juz'"];
const GRID = ["Al-Fatiha", "Al-Baqara", "Yasin", "Al-Mulk"];

const FEATURED = [
  { title: "Al-Kahf", sub: "110 versets" },
  { title: "Ar-Rahman", sub: "78 versets" },
];

export function ListenExplorePreview() {
  return (
    <View style={previewShared.screen}>
      <View style={previewShared.statusBar}>
        <Text style={previewShared.statusTime}>9:41</Text>
      </View>
      <Text style={previewShared.headerTitle}>Écoute</Text>
      <Text style={previewShared.headerSubtitle}>
        Coran, récitateurs et invocations
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {TABS.map((tab, i) => (
          <View
            key={tab}
            style={[styles.tab, i === 0 && { backgroundColor: ACCENT }]}
          >
            <Text style={[styles.tabText, i === 0 && styles.tabTextActive]}>
              {tab}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.grid}>
        {GRID.map((name) => (
          <View key={name} style={styles.gridCard}>
            <View style={styles.gridIcon}>
              <AppIcon name="book-open" size={18} color={ACCENT} />
            </View>
            <Text style={styles.gridTitle} numberOfLines={1}>
              {name}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Sourates</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredRow}
      >
        {FEATURED.map((item) => (
          <View key={item.title} style={styles.featuredCard}>
            <Image source={quranImage} style={styles.featuredImg} />
            <View style={styles.featuredOverlay}>
              <Text style={styles.featuredTitle}>{item.title}</Text>
              <Text style={styles.featuredSub}>{item.sub}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    paddingHorizontal: PREVIEW_PAD,
    gap: 8,
    marginBottom: 14,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: CARD_BG,
  },
  tabText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT,
  },
  tabTextActive: { color: "#fff" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: PREVIEW_PAD,
    gap: 8,
    marginBottom: 14,
  },
  gridCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: CARD_BG,
    borderRadius: 10,
    padding: 8,
    minHeight: 48,
  },
  gridIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gridTitle: {
    flex: 1,
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
    paddingHorizontal: PREVIEW_PAD,
    marginBottom: 10,
  },
  featuredRow: {
    paddingHorizontal: PREVIEW_PAD,
    gap: 10,
  },
  featuredCard: {
    width: 108,
    height: 132,
    borderRadius: 12,
    overflow: "hidden",
  },
  featuredImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  featuredOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "rgba(25, 29, 49, 0.45)",
  },
  featuredTitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#fff",
  },
  featuredSub: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
});
