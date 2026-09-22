import React, { Component, useEffect, useMemo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import {
  Amiri_400Regular,
  Amiri_700Bold,
} from "@expo-google-fonts/amiri";

import "./global.css";
import { GlobalProvider } from "@/lib/global-provider";
import { OnboardingGateProvider } from "@/lib/onboarding-gate";
import { TabBarPreferenceProvider } from "@/lib/tab-bar-preference";
import {
  AppPreferencesProvider,
  useAppPreferences,
} from "@/lib/app-preferences";
import { getAppThemeColors } from "@/lib/app-theme";
import { LocaleSync } from "@/components/LocaleSync";
import { ScreenBackground } from "@/components/ScreenBackground";
import { warmAppImages } from "@/lib/warm-app-images";

SplashScreen.preventAutoHideAsync().catch(() => {});

// Warm-up images après le 1er tick — ne pas bloquer le boot.
setTimeout(() => {
  try {
    warmAppImages();
  } catch {
    // ignore
  }
}, 0);

type BoundaryState = { error: Error | null };

class StartupErrorBoundary extends Component<
  { children: ReactNode },
  BoundaryState
> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorRoot}>
          <Text style={styles.errorTitle}>Erreur au démarrage</Text>
          <Text style={styles.errorBody}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function RootNavigation() {
  const { theme, accentColor, textColor } = useAppPreferences();
  const colors = useMemo(
    () => getAppThemeColors(theme, accentColor, textColor),
    [theme, accentColor, textColor]
  );

  return (
    <View style={[styles.navRoot, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1, backgroundColor: colors.background },
        }}
      />
    </View>
  );
}

/** Charge les polices sans bloquer le rendu. */
function FontLoader({ children }: { children: ReactNode }) {
  const [fontsLoaded, fontError] = useFonts({
    "PlusJakartaSans-Bold": require("../fonts2/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-ExtraBold": require("../fonts2/PlusJakartaSans-ExtraBold.ttf"),
    "PlusJakartaSans-Light": require("../fonts2/PlusJakartaSans-Light.ttf"),
    "PlusJakartaSans-Medium": require("../fonts2/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../fonts2/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-SemiBold": require("../fonts2/PlusJakartaSans-SemiBold.ttf"),
    Amiri_400Regular,
    Amiri_700Bold,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <StartupErrorBoundary>
      <AppPreferencesProvider>
        <GlobalProvider>
          <OnboardingGateProvider>
            <TabBarPreferenceProvider>
              <LocaleSync />
              <FontLoader>
                <ScreenBackground style={styles.background}>
                  <RootNavigation />
                </ScreenBackground>
              </FontLoader>
            </TabBarPreferenceProvider>
          </OnboardingGateProvider>
        </GlobalProvider>
      </AppPreferencesProvider>
    </StartupErrorBoundary>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  navRoot: {
    flex: 1,
  },
  errorRoot: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#B91C1C",
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 14,
    color: "#111827",
  },
});
