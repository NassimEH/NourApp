import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const ACCENT = "#3d6b47";
const ICON_COLOR = "#191D31";
const TEXT_MUTED = "#5b5d5e";

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
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.85}
    >
      <View style={styles.inner}>
        <View style={styles.iconWrap}>
          <Feather name="book" size={28} color={ACCENT} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {displayName}
        </Text>
        {totalHadith != null && totalHadith > 0 && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {totalHadith} hadiths
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 12,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.25)",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 15,
    color: ICON_COLOR,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: TEXT_MUTED,
  },
});
