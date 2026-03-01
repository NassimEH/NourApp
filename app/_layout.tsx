import { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import "./global.css";
import GlobalProvider from "@/lib/global-provider";
import { TabBarPreferenceProvider } from "@/lib/tab-bar-preference";
import { AppPreferencesProvider } from "@/lib/app-preferences";

const backgroundImage = require("../assets/images/background.png");

const transparentTheme = {
  dark: false,
  colors: {
    primary: "#3d6b47",
    background: "transparent",
    card: "transparent",
    text: "#191D31",
    border: "transparent",
    notification: "#3d6b47",
  },
};

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
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <GlobalProvider>
          <TabBarPreferenceProvider>
            <AppPreferencesProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
              }}
              theme={transparentTheme}
            />
            </AppPreferencesProvider>
          </TabBarPreferenceProvider>
        </GlobalProvider>
      </View>
    </ImageBackground>
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
