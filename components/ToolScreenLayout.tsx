import type { StyleProp, ViewStyle } from "react-native";

import { ScreenStackLayout } from "@/components/ScreenStackLayout";

interface ToolScreenLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

/** Écrans outils : contenu à plat sur le fond, sans carte blanche englobante. */
export function ToolScreenLayout({
  title,
  subtitle,
  children,
  contentStyle,
}: ToolScreenLayoutProps) {
  return (
    <ScreenStackLayout
      title={title}
      subtitle={subtitle}
      variant="tool"
      contentContainerStyle={contentStyle}
    >
      {children}
    </ScreenStackLayout>
  );
}
