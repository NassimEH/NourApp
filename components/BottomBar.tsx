import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Pressable,
  Platform,
  StyleSheet,
  Animated,
  LayoutAnimation,
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

import { QuranMiniPlayer } from "@/components/quran/QuranMiniPlayer";
import { useQuranAudioContextOptional } from "@/lib/quran/QuranAudioContext";
import { useSuraList } from "@/lib/quran/hooks/useSuraList";

const TAB_ROUTES = [
  { name: "index" as const, label: "Accueil", icon: "home" as const, href: "/(root)/(tabs)" as const },
  { name: "qibla" as const, label: "Mes prières", icon: "sunrise" as const, href: "/(root)/(tabs)/qibla" as const },
  { name: "coran" as const, label: "Bibliothèque", icon: "book-open" as const, href: "/(root)/(tabs)/coran" as const },
  { name: "apprendre" as const, label: "Apprendre", icon: "award" as const, href: "/(root)/(tabs)/apprendre" as const },
  { name: "explore" as const, label: "Explore", icon: "search" as const, href: "/(root)/(tabs)/explore" as const },
  { name: "profile" as const, label: "Profil", icon: "user" as const, href: "/(root)/(tabs)/profile" as const },
];

const VERTICAL_BAR_WIDTH = 56;

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
  vertical,
}: {
  route: (typeof TAB_ROUTES)[number];
  isActive: boolean;
  onPress: () => void;
  vertical?: boolean;
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
        vertical && styles.tabIconButtonVertical,
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
  const audio = useQuranAudioContextOptional();
  const { list: suraList } = useSuraList();
  const currentRoute = state.routes[state.index]?.name;

  const paddingBottom = Math.max(insets.bottom, 12);
  const isIOS = Platform.OS === "ios";
  const isPlayerVisible = audio?.isPlayerVisible ?? false;

  const suraName = audio?.currentSura != null
    ? suraList.find((s) => s.number === audio.currentSura)?.englishName
    : undefined;

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isPlayerVisible]);

  const renderGlassPill = (vertical?: boolean) => (
    <View style={[styles.glassPill, vertical && styles.glassPillVertical]}>
      <View style={[styles.pillInner, vertical && styles.pillInnerVertical]}>
        {TAB_ROUTES.map((route) => (
          <TabIconButton
            key={route.name}
            route={route}
            isActive={currentRoute === route.name}
            onPress={() => router.push(route.href)}
            vertical={vertical}
          />
        ))}
      </View>
    </View>
  );

  const renderPillContent = (vertical?: boolean) =>
    glassAvailable ? (
      <GlassView
        style={[styles.glassPillOuter, vertical && styles.glassPillOuterVertical]}
        glassEffectStyle="regular"
        isInteractive
      >
        {renderGlassPill(vertical)}
      </GlassView>
    ) : (
      <View style={[styles.glassPillOuter, vertical && styles.glassPillOuterVertical]}>
        <BlurView
          intensity={isIOS ? 120 : 140}
          tint="light"
          style={StyleSheet.absoluteFill}
        >
          <View style={StyleSheet.absoluteFill} collapsable />
        </BlurView>
        <View style={styles.glassPillOverlay} pointerEvents="none" />
        {renderGlassPill(vertical)}
      </View>
    );

  if (isPlayerVisible && audio && audio.currentSura != null) {
    return (
      <View
        style={[
          styles.container,
          styles.containerRow,
          { paddingBottom: paddingBottom + (isIOS ? 22 : 12) },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.verticalBarWrap}>
          {renderPillContent(true)}
        </View>
        <View style={styles.miniPlayerWrap}>
          <QuranMiniPlayer
            suraNumber={audio.currentSura}
            suraName={suraName}
            isPlaying={audio.isPlaying}
            isLoading={audio.isLoading}
            error={audio.error}
            progress={audio.progress}
            onPlayPause={audio.togglePlayPause}
            onClose={audio.unload}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: paddingBottom + (isIOS ? 22 : 12) },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.pillWrap}>
        {renderPillContent(false)}
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
  containerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 0,
    paddingLeft: 12,
    paddingRight: 12,
  },
  pillWrap: {},
  verticalBarWrap: {
    width: VERTICAL_BAR_WIDTH,
    marginRight: 8,
  },
  miniPlayerWrap: {
    flex: 1,
    minWidth: 0,
  },
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
  glassPillOuterVertical: {
    maxWidth: undefined,
    width: VERTICAL_BAR_WIDTH,
    minHeight: 280,
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
  glassPillVertical: {
    paddingVertical: 12,
  },
  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  pillInnerVertical: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 4,
    flex: 1,
  },
  tabIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconButtonVertical: {
    marginVertical: 2,
  },
  tabIconButtonActive: {
    backgroundColor: "rgba(61, 107, 71, 0.9)",
  },
});
