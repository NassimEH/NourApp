import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";

import { LiquidTabBar } from "@/components/LiquidTabBar";
import { TabBarChrome } from "@/components/TabBarChrome";

/** Bottom bar glass iOS 26 — pilule + bouton profil. */
export default function LiquidBottomBar(props: BottomTabBarProps) {
  return (
    <TabBarChrome>
      <LiquidTabBar {...props} />
    </TabBarChrome>
  );
}
