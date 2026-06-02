import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import "./global.css";
import GlobalProvider from "@/lib/global-provider";
import { OnboardingGateProvider } from "@/lib/onboarding-gate";
import { TabBarPreferenceProvider } from "@/lib/tab-bar-preference";
import { AppPreferencesProvider, useAppPreferences } from "@/lib/app-preferences";
import { getAppThemeColors } from "@/lib/app-theme";
import { LocaleSync } from "@/components/LocaleSync";
import { ScreenBackground } from "@/components/ScreenBackground";

function RootNavigation() {
  const { theme, accentColor, textColor } = useAppPreferences();
  const colors = useMemo(
    () => getAppThemeColors(theme, accentColor, textColor),
    [theme, accentColor, textColor]
  );

  return (
    <>
      <StatusBar style={colors.statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.usesBackgroundImage
              ? "transparent"
              : colors.background,
          },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../fonts2/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-ExtraBold": require("../fonts2/PlusJakartaSans-ExtraBold.ttf"),
    "PlusJakartaSans-Light": require("../fonts2/PlusJakartaSans-Light.ttf"),
    "PlusJakartaSans-Medium": require("../fonts2/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../fonts2/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-SemiBold": require("../fonts2/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <OnboardingGateProvider>
        <TabBarPreferenceProvider>
          <AppPreferencesProvider>
            <LocaleSync />
            <ScreenBackground variant="root" style={styles.background}>
              <View style={styles.overlay}>
                <RootNavigation />
              </View>
            </ScreenBackground>
          </AppPreferencesProvider>
        </TabBarPreferenceProvider>
      </OnboardingGateProvider>
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
});
