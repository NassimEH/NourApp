import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { screenScrollContent } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";
import { ScreenBackground } from "@/components/ScreenBackground";

interface PreferenceScreenLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export function PreferenceScreenLayout({
  title,
  subtitle,
  children,
  contentStyle,
}: PreferenceScreenLayoutProps) {
  const colors = useAppTheme();
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
        >
          <View
            style={[
              styles.optionsCard,
              {
                backgroundColor: colors.usesBackgroundImage
                  ? colors.card
                  : colors.cardElevated,
                borderColor: colors.border,
              },
            ]}
          >
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

export function PreferenceOptionDivider() {
  const colors = useAppTheme();
  return <View style={[styles.divider, { borderBottomColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scroll: { flex: 1 },
  content: { ...screenScrollContent, paddingTop: 8, paddingBottom: 40 },
  optionsCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  divider: {
    borderBottomWidth: 1,
  },
});
