import { ReactNode } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";

import { useAppTheme } from "@/lib/app-theme";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Ombre portée plus marquée (carte principale) */
  elevated?: boolean;
  compact?: boolean;
};

export function SignInGlassSurface({ children, style, elevated, compact }: Props) {
  const colors = useAppTheme();
  const glassAvailable = isGlassEffectAPIAvailable();
  const shadowStyle = elevated ? styles.elevated : styles.soft;

  if (glassAvailable) {
    return (
      <View style={[shadowStyle, style]}>
        <GlassView style={styles.glassShell} glassEffectStyle="regular">
          <View
            style={[
              styles.inner,
              compact && styles.innerCompact,
              styles.highlightEdge,
              { borderColor: colors.border },
            ]}
          >
            {children}
          </View>
        </GlassView>
      </View>
    );
  }

  return (
    <View
      style={[
        shadowStyle,
        styles.fallbackShell,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {Platform.OS !== "web" ? (
        <BlurView
          intensity={Platform.OS === "ios" ? 72 : 88}
          tint={colors.tabBarBlurTint}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View
        style={[
          styles.inner,
          compact && styles.innerCompact,
          styles.highlightEdge,
          { borderColor: colors.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glassShell: {
    borderRadius: 24,
    overflow: "hidden",
  },
  fallbackShell: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
  },
  inner: {
    padding: 20,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  innerCompact: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  highlightEdge: {
    borderTopColor: "rgba(255,255,255,0.55)",
    borderLeftColor: "rgba(255,255,255,0.25)",
  },
  soft: {
    shadowColor: "#191D31",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  elevated: {
    shadowColor: "#191D31",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 12,
  },
});
