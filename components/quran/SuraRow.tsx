import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import type { SuraMeta } from "@/lib/quran/types";
import { useAppTheme } from "@/lib/app-theme";

const ICON_SIZE = 22;

interface SuraRowProps {
  sura: SuraMeta;
  onPress: () => void;
}

export function SuraRow({ sura, onPress }: SuraRowProps) {
  const colors = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const revelationLabel =
    sura.revelationType === "Meccan" ? "Mecquoise" : "Médinoise";

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={false}
    >
      <Text style={styles.suraNumber}>{sura.number}</Text>
      <View style={styles.leftBlock}>
        <AppIcon name="book-open" size={ICON_SIZE} color={colors.icon} />
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {sura.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {sura.englishName} · {revelationLabel} · {sura.numberOfAyahs} versets
          </Text>
        </View>
      </View>
      <AppIcon name="chevron-right" size={20} color={colors.iconMuted} />
    </TouchableOpacity>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
    suraNumber: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans-Regular",
      color: colors.textMuted,
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
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans-Regular",
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}
