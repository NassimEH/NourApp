import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Pressable,
  Platform,
  StyleSheet,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  GlassView,
  isGlassEffectAPIAvailable,
} from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_ROUTES = [
  { name: "index" as const, label: "Accueil", icon: "home" as const, href: "/(root)/(tabs)" as const },
  { name: "qibla" as const, label: "Mes prières", icon: "sunrise" as const, href: "/(root)/(tabs)/qibla" as const },
  { name: "coran" as const, label: "Bibliothèque", icon: "book-open" as const, href: "/(root)/(tabs)/coran" as const },
  { name: "apprendre" as const, label: "Apprendre", icon: "award" as const, href: "/(root)/(tabs)/apprendre" as const },
  { name: "explore" as const, label: "Explore", icon: "search" as const, href: "/(root)/(tabs)/explore" as const },
  { name: "profile" as const, label: "Profil", icon: "user" as const, href: "/(root)/(tabs)/profile" as const },
];

const useGlassAvailable = () => {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    try {
      setAvailable(typeof isGlassEffectAPIAvailable === "function" && isGlassEffectAPIAvailable());
    } catch {
      setAvailable(false);
    }
  }, []);
  return available;
};

function TabIconButton({
  route,
  isActive,
  onPress,
}: {
  route: (typeof TAB_ROUTES)[number];
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const prevActive = useRef(isActive);

  useEffect(() => {
    if (isActive && !prevActive.current) {
      prevActive.current = true;
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.25,
          useNativeDriver: true,
          speed: 18,
          bounciness: 10,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 14,
          bounciness: 6,
        }),
      ]).start();
    } else if (!isActive) {
      prevActive.current = false;
    }
  }, [isActive, scale]);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.86,
      useNativeDriver: true,
      speed: 80,
      bounciness: 8,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 12,
    }).start();
  };

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.tabIconButton,
        isActive && styles.tabIconButtonActive,
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Feather
          name={route.icon}
          size={22}
          color={isActive ? "#fff" : "#191D31"}
        />
      </Animated.View>
    </Pressable>
  );
}

export default function BottomBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const glassAvailable = useGlassAvailable();
  const currentRoute = state.routes[state.index]?.name;

  const paddingBottom = Math.max(insets.bottom, 12);
  const isIOS = Platform.OS === "ios";

  const renderGlassPill = () => (
    <View style={styles.glassPill}>
      <View style={styles.pillInner}>
        {TAB_ROUTES.map((route) => (
          <TabIconButton
            key={route.name}
            route={route}
            isActive={currentRoute === route.name}
            onPress={() => router.push(route.href)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: paddingBottom + (isIOS ? 22 : 12) },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.pillWrap}>
        {glassAvailable ? (
          <GlassView
            style={styles.glassPillOuter}
            glassEffectStyle="regular"
            isInteractive
          >
            {renderGlassPill()}
          </GlassView>
        ) : (
          <View style={styles.glassPillOuter}>
            <BlurView
              intensity={isIOS ? 120 : 140}
              tint="light"
              style={StyleSheet.absoluteFill}
            >
              <View style={StyleSheet.absoluteFill} collapsable />
            </BlurView>
            <View style={styles.glassPillOverlay} pointerEvents="none" />
            {renderGlassPill()}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopWidth: 0,
  },
  pillWrap: {},
  glassPillOuter: {
    borderRadius: 32,
    overflow: "hidden",
    minHeight: 64,
    maxWidth: 360,
    width: "100%",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    ...(Platform.OS === "android" && {
      elevation: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      backgroundColor: "rgba(255,255,255,0.25)",
    }),
  },
  glassPillOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 32,
  },
  glassPill: {
    flex: 1,
    ...(Platform.OS === "android" && {
      backgroundColor: "rgba(255,255,255,0.2)",
    }),
  },
  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  tabIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconButtonActive: {
    backgroundColor: "rgba(61, 107, 71, 0.9)",
  },
});
