import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";

const H_PADDING = SCREEN_EDGE_PADDING;
const ROW_HEIGHT = 76;

function SkeletonLine({
  color,
  width = "100%",
  style,
}: {
  color: string;
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
        { height: 14, borderRadius: 7, backgroundColor: color, width, opacity },
        style,
      ]}
    />
  );
}

export function SuraListSkeleton() {
  const colors = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.searchPlaceholder, { backgroundColor: colors.accentSurface }]}>
        <SkeletonLine color={colors.divider} width="100%" />
      </View>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <View
          key={i}
          style={[styles.row, { backgroundColor: colors.card, borderColor: colors.divider }]}
        >
          <View style={[styles.numberBadge, { backgroundColor: colors.accentSurface }]} />
          <View style={styles.textBlock}>
            <SkeletonLine color={colors.divider} width="70%" />
            <SkeletonLine color={colors.divider} width="50%" style={{ marginTop: 8 }} />
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
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: ROW_HEIGHT,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 14,
  },
  textBlock: { flex: 1 },
});
