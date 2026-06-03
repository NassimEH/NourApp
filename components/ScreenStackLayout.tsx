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

interface ScreenStackLayoutProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  headerActions?: React.ReactNode;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
}

export function ScreenStackLayout({
  title,
  subtitle,
  onBack = () => router.back(),
  headerActions,
  rightElement,
  children,
  contentContainerStyle,
  scrollStyle,
  headerStyle,
}: ScreenStackLayoutProps) {
  const { rtlViewStyle } = useTranslation();

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={title}
          subtitle={subtitle}
          onBack={onBack}
          headerActions={headerActions}
          rightElement={rightElement}
          style={headerStyle}
        />
        <ScrollView
          style={[styles.scroll, rtlViewStyle, scrollStyle]}
          contentContainerStyle={[styles.content, contentContainerStyle]}
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
  },
});
