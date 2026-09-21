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
 * L’image spirituelle est strictement en absolute + zIndex bas ;
 * le contenu est au-dessus (zIndex / elevation) pour éviter l’écran « fond seul ».
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
          backgroundColor: isSpiritual
            ? colors.backgroundSecondary
            : colors.background,
        },
        style,
      ]}
    >
      {isSpiritual ? (
        <Image
          source={images.background}
          style={styles.bgImage}
          resizeMode="cover"
          pointerEvents="none"
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  foreground: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },
});
