import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { Models } from "react-native-appwrite";

import Colors from "@/constants/Colors";
import { ITEM_HEIGHT, ITEM_WIDTH } from "@/constants";
import Spacing from "@/constants/Spacing";
import images from "@/constants/images";

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
          <Feather name={item.icon} size={28} color="#3d6b47" />
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

interface Props {
  item: Models.Document & { image?: string | number | null; name?: string; price?: number | string };
  onPress?: () => void;
  /** Libellé du bouton d’action (ex: "Lire" pour la section lecture) */
  actionLabel?: string;
  /** Dimensions optionnelles pour layouts personnalisés (ex. grille asymétrique) */
  cardWidth?: number;
  cardHeight?: number;
  /** Désactive la marge à droite (utile en grille) */
  noMargin?: boolean;
}

const defaultImage = images.background;

export const FeaturedCard = ({
  item,
  onPress,
  actionLabel = "Voir le bien",
  cardWidth,
  cardHeight,
  noMargin,
}: Props) => {
  const router = useRouter();
  const imageSource =
    typeof item.image === "number"
      ? item.image
      : item.image
        ? { uri: item.image }
        : defaultImage;
  const title = item.name ?? "Bien immobilier";
  const price = item.price != null ? (typeof item.price === "number" ? `$${item.price}` : String(item.price)) : "—";

  const handlePress = () => {
    if (onPress) onPress();
    else if (item.$id && item.$id !== "_placeholder") router.push(`/properties/${item.$id}`);
  };

  const width = cardWidth ?? ITEM_WIDTH;
  const height = cardHeight ?? ITEM_HEIGHT;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.card,
        styles.featuredCardAccent,
        {
          height,
          width,
          marginRight: noMargin ? 0 : Spacing * 2,
          borderRadius: Spacing * 3,
        },
      ]}
      activeOpacity={0.9}
    >
      <ImageBackground
        style={styles.imageBg}
        source={imageSource}
        resizeMode="cover"
      >
        <View style={styles.imageDivider} />
        <View style={styles.contentOverlay} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.price} numberOfLines={2}>
              {price}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handlePress();
            }}
            style={styles.arrowCorner}
            activeOpacity={0.8}
          >
            <Feather name="chevron-right" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
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
    borderColor: "rgba(0, 0, 0, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  contentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    zIndex: 1,
  },
  imageBg: {
    height: "100%",
    width: "100%",
  },
  imageDivider: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    zIndex: 0,
  },
  content: {
    padding: Spacing * 3,
    justifyContent: "space-between",
    height: "100%",
    zIndex: 2,
  },
  topRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    flex: 1,
    minHeight: 0,
  },
  title: {
    color: "#191D31",
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    textShadowColor: "rgba(255, 255, 255, 0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    width: "100%",
  },
  price: {
    color: "#191D31",
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    textShadowColor: "rgba(255, 255, 255, 0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
        <Feather name="star" size={12} color="#3d6b47" />
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
          <Feather name="heart" size={20} color="#191D31" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
