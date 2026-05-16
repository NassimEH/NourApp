import { Image, StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import {
  ACCENT,
  CARD_BG,
  MUTED,
  PREVIEW_PAD,
  TEXT,
  previewShared,
} from "./preview-shared";

const quranImage = require("@/assets/images/islamic-new-year-quran-book-with-dates-photo.jpg");

export function LibraryCoranPreview() {
  return (
    <View style={previewShared.screen}>
      <View style={previewShared.statusBar}>
        <Text style={previewShared.statusTime}>9:41</Text>
      </View>
      <Text style={previewShared.headerTitle}>Bibliothèque</Text>
      <Text style={previewShared.headerSubtitle}>
        Coran, hadiths et invocations
      </Text>

      <Text style={styles.blockLabel}>Coran</Text>
      <View style={styles.heroRow}>
        <View style={styles.souratesCard}>
          <Image source={quranImage} style={styles.souratesImg} />
          <View style={styles.souratesOverlay}>
            <Text style={styles.heroTitle}>Sourates</Text>
            <Text style={styles.heroSub}>114 sourates</Text>
          </View>
        </View>
        <View style={styles.recitCard}>
          <AppIcon name="headphones" size={22} color={ACCENT} />
          <Text style={styles.smallCardTitle}>Récitateurs</Text>
          <Text style={styles.smallCardSub}>Écoute en audio</Text>
        </View>
      </View>

      <Text style={styles.blockLabel}>Hadiths</Text>
      <View style={styles.hadithRow}>
        <View style={[styles.miniCard, { flex: 1 }]}>
          <AppIcon name="sun" size={18} color={ACCENT} />
          <Text style={styles.miniTitle}>Hadith du jour</Text>
        </View>
        <View style={[styles.miniCard, { flex: 1 }]}>
          <AppIcon name="grid" size={18} color={ACCENT} />
          <Text style={styles.miniTitle}>Par thème</Text>
        </View>
      </View>
      <View style={styles.wideCard}>
        <AppIcon name="book-open" size={20} color={ACCENT} />
        <View style={styles.wideText}>
          <Text style={styles.wideTitle}>Tous les hadiths</Text>
          <Text style={styles.wideSub}>Par recueil · Bukhari, Muslim…</Text>
        </View>
      </View>

      <Text style={styles.blockLabel}>Invocations</Text>
      <View style={styles.invRow}>
        <View style={styles.invCard}>
          <AppIcon name="sunrise" size={16} color={ACCENT} />
          <Text style={styles.invText}>Matin et soir</Text>
        </View>
        <View style={styles.invCard}>
          <AppIcon name="cloud" size={16} color={ACCENT} />
          <Text style={styles.invText}>Météo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blockLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
    paddingHorizontal: PREVIEW_PAD,
    marginBottom: 8,
    marginTop: 4,
  },
  heroRow: {
    flexDirection: "row",
    paddingHorizontal: PREVIEW_PAD,
    gap: 8,
    marginBottom: 12,
    height: 108,
  },
  souratesCard: {
    flex: 1.4,
    borderRadius: 14,
    overflow: "hidden",
  },
  souratesImg: { width: "100%", height: "100%" },
  souratesOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 12,
    backgroundColor: "rgba(25, 29, 49, 0.35)",
  },
  heroTitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#fff",
  },
  heroSub: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
  recitCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 12,
    justifyContent: "center",
    gap: 6,
  },
  smallCardTitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
  },
  smallCardSub: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Regular",
    color: MUTED,
  },
  hadithRow: {
    flexDirection: "row",
    paddingHorizontal: PREVIEW_PAD,
    gap: 8,
    marginBottom: 8,
  },
  miniCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    minHeight: 72,
  },
  miniTitle: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT,
  },
  wideCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: PREVIEW_PAD,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  wideText: { flex: 1 },
  wideTitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
  },
  wideSub: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: MUTED,
    marginTop: 2,
  },
  invRow: {
    flexDirection: "row",
    paddingHorizontal: PREVIEW_PAD,
    gap: 8,
  },
  invCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(25, 29, 49, 0.06)",
  },
  invText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT,
  },
});
