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

interface Props {
  item: Models.Document & { image?: string | null; name?: string; price?: number | string };
  onPress?: () => void;
}

const defaultImage = images.background;

export const FeaturedCard = ({ item, onPress }: Props) => {
  const router = useRouter();
  const imageSource = item.image ? { uri: item.image } : defaultImage;
  const title = item.name ?? "Bien immobilier";
  const price = item.price != null ? (typeof item.price === "number" ? `$${item.price}` : String(item.price)) : "—";

  const handlePress = () => {
    if (onPress) onPress();
    else if (item.$id && item.$id !== "_placeholder") router.push(`/properties/${item.$id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.card,
        {
          height: ITEM_HEIGHT,
          width: ITEM_WIDTH,
          marginRight: Spacing * 2,
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
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text
              style={[styles.title, { width: "60%" }]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text style={styles.price}>{price}</Text>
          </View>
          <View style={styles.bottomRow}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handlePress();
              }}
              style={styles.viewButton}
            >
              <Text style={styles.viewButtonText}>Voir le bien</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => e.stopPropagation()}
              style={styles.bookmarkButton}
            >
              <Feather
                name="bookmark"
                size={22}
                color={Colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.07)",
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
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    zIndex: 0,
  },
  content: {
    padding: Spacing * 3,
    justifyContent: "space-between",
    height: "100%",
    zIndex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    color: Colors.onPrimary,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
  },
  price: {
    color: Colors.onPrimary,
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing * 1.5,
    paddingHorizontal: Spacing * 3,
    borderRadius: Spacing * 5,
    alignItems: "center",
    justifyContent: "center",
  },
  viewButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  bookmarkButton: {
    backgroundColor: Colors.background,
    borderRadius: Spacing * 5,
    width: Spacing * 6,
    height: Spacing * 6,
    justifyContent: "center",
    alignItems: "center",
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
