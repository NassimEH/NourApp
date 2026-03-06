import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const H_PADDING = 24;
const GAP = 12;
const SKELETON_BG = "rgba(0,0,0,0.06)";
const { width: screenWidth } = Dimensions.get("window");
const contentWidth = screenWidth - 2 * H_PADDING;
const CARD_WIDTH = (contentWidth - GAP) / 2;
const CARD_HEIGHT = 160;

function SkeletonBox({
  width,
  height,
  style,
}: {
  width: string | number;
  height: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, useNativeDriver: true, duration: 600 }),
        Animated.timing(opacity, { toValue: 0.3, useNativeDriver: true, duration: 600 }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 12,
          backgroundColor: SKELETON_BG,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function HadithCollectionSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.searchPlaceholder} />
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonBox key={i} width={CARD_WIDTH} height={CARD_HEIGHT} style={styles.card} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: H_PADDING, paddingTop: 16, paddingBottom: 24 },
  searchPlaceholder: {
    height: 44,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  card: {
    borderRadius: 12,
  },
});
