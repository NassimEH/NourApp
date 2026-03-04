import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const ACCENT = "#3d6b47";
const SKELETON_BG = "rgba(61, 107, 71, 0.12)";
const H_PADDING = 20;
const ROW_HEIGHT = 76;

function SkeletonLine({ width = "100%", style }: { width?: string | number; style?: object }) {
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
        { height: 14, borderRadius: 7, backgroundColor: SKELETON_BG, width, opacity },
        style,
      ]}
    />
  );
}

export function SuraListSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.searchPlaceholder}>
        <SkeletonLine width="100%" />
      </View>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.numberBadge} />
          <View style={styles.textBlock}>
            <SkeletonLine width="70%" />
            <SkeletonLine width="50%" style={{ marginTop: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: H_PADDING, paddingTop: 16, paddingBottom: 24 },
  searchPlaceholder: {
    height: 48,
    borderRadius: 14,
    backgroundColor: SKELETON_BG,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: ROW_HEIGHT,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SKELETON_BG,
    marginRight: 14,
  },
  textBlock: { flex: 1 },
});
