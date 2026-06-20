import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/** Fond thème spirituel — dégradé crème → rose, sans décoration. */
export function SpiritualBackgroundGradient() {
  return (
    <LinearGradient
      colors={["#FAF7F2", "#F3EBE4", "#EBC8BC"]}
      locations={[0, 0.52, 1]}
      start={{ x: 0.12, y: 0 }}
      end={{ x: 0.88, y: 1 }}
      style={styles.fill}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
});
