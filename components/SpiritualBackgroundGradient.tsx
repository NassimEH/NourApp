import { Image, StyleSheet, View } from "react-native";

import images from "@/constants/images";

/**
 * Fond thème spirituel — image illustrée (crème → pêche).
 * Uniquement monté quand `usesBackgroundImage` est true.
 */
export function SpiritualBackgroundGradient() {
  return (
    <View style={styles.fill}>
      <Image
        source={images.background}
        style={styles.image}
        resizeMode="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
    pointerEvents: "none",
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
});
