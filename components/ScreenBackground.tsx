import {
  ImageBackground,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

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

  if (colors.usesBackgroundImage) {
    const source = variant === "root" ? rootBackground : homeBackground;
    return (
      <ImageBackground
        source={source}
        style={[styles.fill, style]}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
