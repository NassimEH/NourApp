import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
import { useAppTheme } from "@/lib/app-theme";

const CARD_WIDTH = 160;
const CARD_HEIGHT = 140;

interface HadithCollectionCardProps {
  displayName: string;
  totalHadith?: number;
  onPress: () => void;
}

/** Petite card cliquable style ReadingCard (composant Cards.tsx) : icône, titre, sous-titre. */
export function HadithCollectionCard({
  displayName,
  totalHadith,
  onPress,
}: HadithCollectionCardProps) {
  const colors = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.85}
    >
      <View style={styles.inner}>
        <View style={styles.iconWrap}>
          <AppIcon name="book" size={28} color={colors.accent} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {displayName}
        </Text>
        {totalHadith != null && totalHadith > 0 ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {totalHadith} hadiths
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      marginRight: 12,
      marginBottom: 12,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: colors.accentSurface,
      borderWidth: 1,
      borderColor: colors.accentBorder,
    },
    inner: {
      flex: 1,
      padding: 16,
      justifyContent: "space-between",
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.cardElevated,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontFamily: "PlusJakartaSans-SemiBold",
      fontSize: 15,
      color: colors.text,
      lineHeight: 20,
    },
    subtitle: {
      fontFamily: "PlusJakartaSans-Regular",
      fontSize: 12,
      color: colors.textMuted,
    },
  });
}
