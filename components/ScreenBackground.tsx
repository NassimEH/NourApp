import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { DarkModeScreenGradient } from "@/components/auth/AuthGradientBackdrop";
import { SpiritualBackgroundGradient } from "@/components/SpiritualBackgroundGradient";
import { useAppTheme } from "@/lib/app-theme";

interface ScreenBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenBackground({
  children,
  style,
}: ScreenBackgroundProps) {
  const colors = useAppTheme();

  return (
    <View
      style={[
        styles.fill,
        !colors.usesBackgroundImage && { backgroundColor: colors.background },
        style,
      ]}
    >
      {colors.usesBackgroundImage ? (
        <SpiritualBackgroundGradient />
      ) : (
        <DarkModeScreenGradient />
      )}
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flex: 1,
  },
});
