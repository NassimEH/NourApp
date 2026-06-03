import {
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { screenScrollContent } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import { ScreenBackground } from "@/components/ScreenBackground";

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
  const { rtlViewStyle } = useTranslation();

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={title}
          subtitle={subtitle}
          onBack={() => router.back()}
        />
        <ScrollView
          style={[styles.scroll, rtlViewStyle]}
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  content: {
    ...screenScrollContent,
    paddingTop: 8,
    paddingBottom: 48,
  },
});
