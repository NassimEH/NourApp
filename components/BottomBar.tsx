import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";

import LiquidBottomBar from "@/components/LiquidBottomBar";

export { FullScreenPlayer } from "@/components/FullScreenPlayer";

/**
 * Variante custom = glassmorphism iOS 26 (pilule + profil circulaire).
 */
export default function BottomBar(props: BottomTabBarProps) {
  return <LiquidBottomBar {...props} />;
}
