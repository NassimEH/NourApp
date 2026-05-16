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

const mosqueImage = require("@/assets/images/mosquee.png");

const PRAYERS = [
  { key: "Fajr", icon: "sunrise" as const, time: "05:42" },
  { key: "Dhuhr", icon: "sun" as const, time: "13:18" },
  { key: "Asr", icon: "cloud" as const, time: "16:52" },
  { key: "Maghrib", icon: "sunset" as const, time: "19:24" },
  { key: "Isha", icon: "moon" as const, time: "20:41" },
];

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export function PrayersHomePreview() {
  return (
    <View style={previewShared.screen}>
      <View style={previewShared.statusBar}>
        <Text style={previewShared.statusTime}>9:41</Text>
        <AppIcon name="wifi" size={14} color={TEXT} />
      </View>
      <Text style={previewShared.headerTitle}>As-salâmu alaykum</Text>
      <Text style={previewShared.headerSubtitle}>
        16 mai 2026 · Ramadan 18, 1447
      </Text>

      <View style={styles.weekRow}>
        {DAYS.map((day, i) => (
          <View key={`${day}-${i}`} style={styles.dayCol}>
            <Text style={[styles.dayLabel, i === 5 && styles.dayLabelActive]}>
              {day}
            </Text>
            <View
              style={[
                styles.dayPill,
                i <= 5 ? styles.dayPillFilled : styles.dayPillEmpty,
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Ma mosquée</Text>
          <Text style={styles.cardLink}>Voir tout</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.prayerCol}>
            {PRAYERS.map(({ key, icon, time }) => (
              <View key={key} style={styles.prayerRow}>
                <AppIcon name={icon} size={13} color={MUTED} />
                <Text style={styles.prayerKey}>{key}</Text>
                <Text style={styles.prayerTime}>{time}</Text>
              </View>
            ))}
          </View>
          <View style={styles.mosqueCol}>
            <Image source={mosqueImage} style={styles.mosqueImg} resizeMode="contain" />
            <Text style={styles.mosqueName}>Mosquée de Crosne</Text>
          </View>
        </View>
      </View>

      <View style={styles.qiblaHint}>
        <AppIcon name="navigation" size={16} color={ACCENT} />
        <Text style={styles.qiblaText}>Qibla · 119° SE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: "row",
    paddingHorizontal: PREVIEW_PAD,
    marginBottom: 16,
    gap: 4,
  },
  dayCol: { flex: 1, alignItems: "center", gap: 6 },
  dayLabel: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Regular",
    color: MUTED,
  },
  dayLabelActive: {
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
  },
  dayPill: {
    width: "100%",
    maxWidth: 28,
    height: 6,
    borderRadius: 3,
  },
  dayPillFilled: { backgroundColor: ACCENT },
  dayPillEmpty: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#c4c1c9",
  },
  card: {
    marginHorizontal: PREVIEW_PAD,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(25, 29, 49, 0.06)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Bold",
    color: TEXT,
  },
  cardLink: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ACCENT,
  },
  cardBody: { flexDirection: "row", gap: 8 },
  prayerCol: { flex: 1, gap: 6 },
  prayerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  prayerKey: {
    flex: 1,
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: TEXT,
  },
  prayerTime: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT,
  },
  mosqueCol: { alignItems: "center", width: 88 },
  mosqueImg: { width: 72, height: 72 },
  mosqueName: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: TEXT,
    textAlign: "center",
    marginTop: 4,
  },
  qiblaHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    marginHorizontal: PREVIEW_PAD,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: CARD_BG,
    borderRadius: 12,
  },
  qiblaText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: ACCENT,
  },
});
