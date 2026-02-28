import { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import "./global.css";
import GlobalProvider from "@/lib/global-provider";

const backgroundImage = require("../assets/images/background.png");

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
          <Stack screenOptions={{ headerShown: false }} />
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
