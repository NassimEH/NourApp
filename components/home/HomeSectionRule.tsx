import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/lib/app-theme";

type Props = {
  style?: StyleProp<ViewStyle>;
};

/**
 * Trait d’accueil élégant : plus court, discret,
 * opaque au centre et qui s’efface vers les extrémités.
 */
export function HomeSectionRule({ style }: Props) {
  const colors = useAppTheme();
  const mid = colors.isDark
    ? "rgba(255,255,255,0.14)"
    : "rgba(0,0,0,0.10)";
  const edge = colors.isDark
    ? "rgba(255,255,255,0)"
    : "rgba(0,0,0,0)";

  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient
        colors={[edge, mid, mid, edge]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.line}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
  },
  line: {
    width: "68%",
    height: StyleSheet.hairlineWidth < 1 ? 1 : StyleSheet.hairlineWidth,
    maxHeight: 1,
    borderRadius: 1,
  },
});
