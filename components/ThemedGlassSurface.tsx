import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { useMemo, type ReactNode } from "react";

import { useAppTheme } from "@/lib/app-theme";
import { GLASS_RADIUS } from "@/lib/ui/spacing";

function useGlassAvailable() {
  return useMemo(() => {
    if (Platform.OS !== "ios") return false;
    try {
      return (
        typeof isGlassEffectAPIAvailable === "function" &&
        isGlassEffectAPIAvailable()
      );
    } catch {
      return false;
    }
  }, []);
}

interface ThemedGlassSurfaceProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  interactive?: boolean;
}

export function ThemedGlassSurface({
  children,
  style,
  borderRadius = GLASS_RADIUS,
  interactive = false,
}: ThemedGlassSurfaceProps) {
  const colors = useAppTheme();
  const glassAvailable = useGlassAvailable();
  const isIOS = Platform.OS === "ios";

  const shellStyle = [
    styles.shell,
    {
      borderRadius,
      borderColor: colors.glassBorder,
      backgroundColor: isIOS ? undefined : colors.glassSurfaceAndroid,
    },
    style,
  ];

  if (glassAvailable) {
    return (
      <GlassView
        style={shellStyle}
        glassEffectStyle={colors.isDark ? "regular" : "regular"}
        isInteractive={interactive}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={shellStyle}>
      <BlurView
        intensity={isIOS ? (colors.isDark ? 80 : 100) : 120}
        tint={colors.glassBlurTint}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.glassOverlay, borderRadius, pointerEvents: "none" },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
