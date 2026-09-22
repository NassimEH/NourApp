import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { SPACE } from "@/lib/ui/spacing";

/** Même dégradé que FeaturedListenHero (Reprendre l’écoute). */
export const COVER_FADE_COLORS = [
  "transparent",
  "rgba(0,0,0,0.15)",
  "rgba(0,0,0,0.55)",
  "rgba(0,0,0,0.78)",
] as const;

export const COVER_FADE_LOCATIONS = [0, 0.28, 0.65, 1] as const;

/** Ratio hauteur du fondu / hauteur du cadre — identique au hero. */
export const COVER_FADE_HEIGHT_RATIO = 0.58;

type CoverCaptionBandProps = {
  height: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Bande bas de cover — même fondu doux que « Reprendre l’écoute »
 * (dégradé progressif uniquement, pas de BlurView agressif).
 */
export function CoverCaptionBand({
  height,
  children,
  style,
  contentStyle,
}: CoverCaptionBandProps) {
  return (
    <View style={[styles.band, { height }, style]} pointerEvents="none">
      <View style={styles.scrim} />
      <LinearGradient
        colors={[...COVER_FADE_COLORS]}
        locations={[...COVER_FADE_LOCATIONS]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  /** Voile léger global — même idée que topScrim du hero. */
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  content: {
    paddingHorizontal: SPACE.sm,
    paddingBottom: SPACE.sm,
    paddingTop: SPACE.md,
    gap: 3,
  },
});
