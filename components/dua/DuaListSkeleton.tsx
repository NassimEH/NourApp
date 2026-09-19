import { useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";

const H_PADDING = SCREEN_EDGE_PADDING;

function SkeletonLine({
  color,
  width = "100%",
  style,
}: {
  color: string;
  width?: string | number;
  style?: object;
}) {
  const [opacity] = useState(() => new Animated.Value(0.3));
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

export function DuaListSkeleton() {
  const colors = useAppTheme();

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: colors.accentSurface }]} />
          <View style={styles.textBlock}>
            <SkeletonLine color={colors.divider} width="80%" />
            <SkeletonLine color={colors.divider} width="50%" style={{ marginTop: 8 }} />
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
  },
  textBlock: { flex: 1 },
});
