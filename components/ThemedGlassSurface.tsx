import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { useEffect, useState, type ReactNode } from "react";

import { useAppTheme } from "@/lib/app-theme";

function useGlassAvailable() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    try {
      setAvailable(
        typeof isGlassEffectAPIAvailable === "function" &&
          isGlassEffectAPIAvailable()
      );
    } catch {
      setAvailable(false);
    }
  }, []);
  return available;
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
  borderRadius = 20,
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
          StyleSheet.absoluteFillObject,
          { backgroundColor: colors.glassOverlay, borderRadius },
        ]}
        pointerEvents="none"
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
