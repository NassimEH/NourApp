import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { LiquidTabBar } from "@/components/LiquidTabBar";
import { TabBarChrome } from "@/components/TabBarChrome";

export default function LiquidBottomBar(props: BottomTabBarProps) {
  return (
    <TabBarChrome>
      <LiquidTabBar {...props} />
    </TabBarChrome>
  );
}
