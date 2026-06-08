import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/lib/app-theme";

/** Lueur verticale discrète en haut d’écran (onboarding / auth). */
export function AuthGradientBackdrop() {
  const colors = useAppTheme();

  if (colors.usesBackgroundImage) return null;

  return (
    <LinearGradient
      colors={[
        `${colors.accent}28`,
        `${colors.accent}10`,
        "transparent",
      ]}
      locations={[0, 0.35, 0.72]}
      style={styles.gradient}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
