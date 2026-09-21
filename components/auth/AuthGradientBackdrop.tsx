import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/lib/app-theme";

function ScreenTopGradient({ enabled }: { enabled: boolean }) {
  const colors = useAppTheme();

  if (!enabled || colors.usesBackgroundImage) return null;

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

/** Lueur verticale en haut d’écran — mode sombre (clair en haut, sombre en bas). */
export function DarkModeScreenGradient() {
  const colors = useAppTheme();
  return <ScreenTopGradient enabled={colors.isDark} />;
}

/** Lueur discrète sur les écrans auth / onboarding en mode clair. */
export function AuthGradientBackdrop() {
  const colors = useAppTheme();
  return <ScreenTopGradient enabled={!colors.isDark} />;
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
