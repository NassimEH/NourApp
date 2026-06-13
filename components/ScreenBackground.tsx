import {
  ImageBackground,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { DarkModeScreenGradient } from "@/components/auth/AuthGradientBackdrop";
import { useAppTheme } from "@/lib/app-theme";

const homeBackground = require("@/assets/images/home-background.png");
const rootBackground = require("@/assets/images/background.png");

interface ScreenBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Image de fond racine (layout principal) vs écran standard */
  variant?: "screen" | "root";
}

export function ScreenBackground({
  children,
  style,
  variant = "screen",
}: ScreenBackgroundProps) {
  const colors = useAppTheme();
  const source = variant === "root" ? rootBackground : homeBackground;

  return (
    <View
      style={[
        styles.fill,
        !colors.usesBackgroundImage && { backgroundColor: colors.background },
        style,
      ]}
    >
      {colors.usesBackgroundImage ? (
        <ImageBackground
          source={source}
          style={[styles.backgroundImage, styles.nonInteractive]}
          resizeMode="cover"
        />
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
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  nonInteractive: {
    pointerEvents: "none",
  },
  content: {
    flex: 1,
  },
});
