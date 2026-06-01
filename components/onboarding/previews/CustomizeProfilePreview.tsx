import { StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import { ACCENT_HEX } from "@/lib/accent-colors";
import {
  ACCENT,
  CARD_BG,
  MUTED,
  PREVIEW_PAD,
  TEXT,
  previewShared,
} from "./preview-shared";

const THEMES = [
  { id: "spiritual", label: "Spirituel", desc: "Fond mosquée, ambiance douce" },
  { id: "light", label: "Clair", desc: "Interface lumineuse et épurée" },
  { id: "dark", label: "Sombre", desc: "Confort visuel de nuit" },
];

const ACCENTS = (
  ["green", "blue", "amber", "teal", "purple", "rose", "indigo", "emerald"] as const
).map((key) => ({
  key,
  color: ACCENT_HEX[key],
  label: key,
}));

export function CustomizeProfilePreview() {
  return (
    <View style={previewShared.screen}>
      <View style={previewShared.statusBar}>
        <Text style={previewShared.statusTime}>9:41</Text>
      </View>
      <View style={styles.navRow}>
        <AppIcon name="chevron-left" size={20} color={TEXT} />
        <Text style={styles.navTitle}>Préférences</Text>
        <View style={{ width: 20 }} />
      </View>

      <Text style={styles.sectionTitle}>Thème</Text>
      <View style={styles.card}>
        {THEMES.map((opt, i) => (
          <View
            key={opt.id}
            style={[styles.optionRow, i < THEMES.length - 1 && styles.optionBorder]}
          >
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
            <View
              style={[
                styles.radio,
                i === 0 && { borderColor: ACCENT, backgroundColor: ACCENT },
              ]}
            >
              {i === 0 ? <View style={styles.radioDot} /> : null}
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Couleur d’accent</Text>
      <View style={styles.accentRow}>
        {ACCENTS.map((a, i) => (
          <View key={a.key} style={styles.accentItem}>
            <View
              style={[
                styles.accentSwatch,
                styles.accentSwatchSmall,
                { backgroundColor: a.color },
                i === 0 && styles.accentSwatchSelected,
              ]}
            />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Typographie</Text>
      <View style={styles.sizeRow}>
        {["S", "M", "L"].map((size, i) => (
          <View
            key={size}
            style={[styles.sizePill, i === 1 && styles.sizePillActive]}
          >
            <Text
              style={[styles.sizeText, i === 1 && styles.sizeTextActive]}
            >
              {size}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: PREVIEW_PAD,
    marginBottom: 16,
  },
  navTitle: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
    paddingHorizontal: PREVIEW_PAD,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: PREVIEW_PAD,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(25, 29, 49, 0.06)",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(25, 29, 49, 0.06)",
  },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT,
  },
  optionDesc: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: MUTED,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#c4c1c9",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  accentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: PREVIEW_PAD,
    gap: 10,
    marginBottom: 16,
  },
  accentItem: { alignItems: "center" },
  accentSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  accentSwatchSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  accentSwatchSelected: {
    borderWidth: 3,
    borderColor: TEXT,
  },
  accentLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Medium",
    color: MUTED,
  },
  sizeRow: {
    flexDirection: "row",
    marginHorizontal: PREVIEW_PAD,
    gap: 10,
  },
  sizePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: CARD_BG,
    alignItems: "center",
  },
  sizePillActive: { backgroundColor: ACCENT },
  sizeText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
  },
  sizeTextActive: { color: "#fff" },
});
