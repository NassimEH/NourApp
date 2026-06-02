import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { ITEM_HEIGHT, ITEM_WIDTH } from "@/constants";
import Spacing from "@/constants/Spacing";
import { useAppTheme } from "@/lib/app-theme";

const READING_CARD_HEIGHT = 200;
const READING_CARD_WIDTH = 160;

export type ReadingItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: "book" | "book-open" | "sun" | "moon" | "heart" | "message-circle";
};

interface ReadingCardProps {
  item: ReadingItem;
  onPress?: () => void;
}

export const ReadingCard = ({ item, onPress }: ReadingCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.readingCard}
      activeOpacity={0.85}
    >
      <View style={styles.readingCardInner}>
        <View style={styles.readingCardIconWrap}>
          <AppIcon name={item.icon} size={28} color="#3d6b47" />
        </View>
        <Text style={styles.readingCardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.readingCardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export type FeaturedCardItem = {
  image?: string | number | null;
  name?: string;
  price?: number | string;
  rating?: string | number;
  address?: string;
  icon?: AppIconName;
  soon?: boolean;
  disabled?: boolean;
};

interface Props {
  item: FeaturedCardItem;
  onPress?: () => void;
  /** Libellé du bouton d’action (ex: "Lire" pour la section lecture) */
  actionLabel?: string;
  /** Dimensions optionnelles pour layouts personnalisés (ex. grille asymétrique) */
  cardWidth?: number;
  cardHeight?: number;
  /** Désactive la marge à droite (utile en grille) */
  noMargin?: boolean;
}

export const FeaturedCard = ({
  item,
  onPress,
  actionLabel = "Ouvrir",
  cardWidth,
  cardHeight,
  noMargin,
}: Props) => {
  const colors = useAppTheme();
  const title = item.name ?? "";
  const price =
    item.price != null
      ? typeof item.price === "number"
        ? String(item.price)
        : String(item.price)
      : "—";

  const handlePress = () => {
    if (onPress) onPress();
  };

  const width = cardWidth ?? ITEM_WIDTH;
  const height = cardHeight ?? ITEM_HEIGHT;
  const isDisabled = item.disabled === true;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={[
        styles.card,
        styles.featuredCardAccent,
        {
          height,
          width,
          marginRight: noMargin ? 0 : Spacing * 2,
          borderRadius: Spacing * 3,
          borderColor: colors.border,
          backgroundColor: colors.cardElevated,
        },
        isDisabled && { opacity: 0.6 },
      ]}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        {item.soon ? (
          <View
            style={[
              styles.soonBadge,
              { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder },
            ]}
          >
            <Text style={[styles.soonBadgeText, { color: colors.accent }]}>Bientot</Text>
          </View>
        ) : null}
        <View style={styles.topRow}>
          <View
            style={[
              styles.featuredCardIconWrap,
              { backgroundColor: colors.accentSurface, borderColor: colors.accentBorder },
            ]}
          >
            <AppIcon name={item.icon ?? "book-open"} size={24} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>
          <Text style={[styles.price, { color: colors.textMuted }]} numberOfLines={2}>
            {price}
          </Text>
        </View>
        {!isDisabled ? (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handlePress();
            }}
            style={styles.arrowCorner}
            activeOpacity={0.8}
          >
            <AppIcon name="chevron-right" size={24} color={colors.icon} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  readingCard: {
    width: READING_CARD_WIDTH,
    height: READING_CARD_HEIGHT,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(61, 107, 71, 0.25)",
  },
  readingCardInner: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  readingCardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  readingCardTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 15,
    color: "#191D31",
    lineHeight: 20,
  },
  readingCardSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#5b5d5e",
  },
  card: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.07)",
  },
  featuredCardAccent: {
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    padding: Spacing * 3,
    justifyContent: "space-between",
    height: "100%",
  },
  topRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
    minHeight: 0,
  },
  soonBadge: {
    position: "absolute",
    right: 14,
    top: 14,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 2,
  },
  soonBadgeText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
  },
  featuredCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 17,
    width: "100%",
  },
  price: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    width: "100%",
  },
  arrowCorner: {
    position: "absolute",
    right: 12,
    bottom: 12,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const Card = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <AppIcon name="star" size={12} color="#3d6b47" />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
          {item.rating}
        </Text>
      </View>

      <Image source={{ uri: item.image as string }} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {item.name}
        </Text>
        <Text className="text-xs font-rubik text-black-100">
          {item.address}
        </Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">
            ${item.price}
          </Text>
          <AppIcon name="heart" size={20} color="#191D31" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
