import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const H_PADDING = 24;
const SKELETON_BG = "rgba(0,0,0,0.06)";

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

export function DuaCategorySkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.searchPlaceholder} />
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.iconPlaceholder, { borderRadius: 11 }]} />
          <SkeletonLine width="70%" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: H_PADDING, paddingTop: 16, paddingBottom: 24 },
  searchPlaceholder: {
    height: 44,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  iconPlaceholder: {
    width: 22,
    height: 22,
    backgroundColor: SKELETON_BG,
  },
});
