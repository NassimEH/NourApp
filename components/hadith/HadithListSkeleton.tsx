import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const H_PADDING = 24;
const SKELETON_BG = "rgba(0,0,0,0.06)";

function SkeletonLine({
  width = "100%",
  style,
}: {
  width?: string | number;
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
        { height: 14, borderRadius: 7, backgroundColor: SKELETON_BG, width, opacity },
        style,
      ]}
    />
  );
}

export function HadithListSkeleton() {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.iconWrap} />
          <View style={styles.textBlock}>
            <SkeletonLine width="80%" />
            <SkeletonLine width="50%" style={{ marginTop: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: H_PADDING, paddingTop: 8, paddingBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: SKELETON_BG,
  },
  textBlock: { flex: 1 },
});
