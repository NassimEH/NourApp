import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { SuraMeta } from "@/lib/quran/types";

const ICON_SIZE = 22;
const ICON_COLOR = "#191D31";
const TEXT_MUTED = "rgba(0,0,0,0.5)";

interface SuraRowProps {
  sura: SuraMeta;
  onPress: () => void;
}

export function SuraRow({ sura, onPress }: SuraRowProps) {
  const revelationLabel = sura.revelationType === "Meccan" ? "Mecquoise" : "Médinoise";
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={false}
    >
      <Text style={styles.suraNumber}>{sura.number}</Text>
      <View style={styles.leftBlock}>
        <Feather name="book-open" size={ICON_SIZE} color={ICON_COLOR} />
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {sura.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {sura.englishName} · {revelationLabel} · {sura.numberOfAyahs} versets
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={ICON_COLOR} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  suraNumber: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    width: 28,
    textAlign: "right",
    marginRight: 4,
  },
  leftBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  textBlock: { flex: 1 },
  title: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
    color: ICON_COLOR,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: TEXT_MUTED,
    marginTop: 2,
  },
});
