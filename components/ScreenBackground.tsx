import {
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { DarkModeScreenGradient } from "@/components/auth/AuthGradientBackdrop";
import images from "@/constants/images";
import { useAppTheme } from "@/lib/app-theme";

interface ScreenBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Fond d’écran selon le thème.
 * Image RN (pas expo-image) : les tabs gardent plusieurs écrans montés ;
 * un recyclingKey partagé faisait disparaître le fond sur Prières / Bibliothèque / Apprendre.
 */
export function ScreenBackground({
  children,
  style,
}: ScreenBackgroundProps) {
  const colors = useAppTheme();
  const isSpiritual = colors.usesBackgroundImage;

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {isSpiritual ? (
        <Image
          source={images.background}
          style={styles.bgImage}
          resizeMode="cover"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : null}
      {!isSpiritual && colors.isDark ? <DarkModeScreenGradient /> : null}
      <View style={styles.foreground}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  foreground: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
    elevation: 1,
  },
});
