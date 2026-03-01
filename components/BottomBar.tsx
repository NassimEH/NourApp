import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
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
  { name: "explore" as const, label: "Explore", icon: "search" as const, href: "/(root)/(tabs)/explore" as const },
  { name: "profile" as const, label: "Profil", icon: "user" as const, href: "/(root)/(tabs)/profile" as const },
];

const EXPANDED_HEIGHT = 280;

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

function PlusButton({
  rotation,
  onPress,
  onPressIn,
  onPressOut,
}: {
  rotation: Animated.Value;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => {
        Animated.spring(scale, {
          toValue: 0.88,
          useNativeDriver: true,
          speed: 80,
          bounciness: 8,
        }).start();
        onPressIn();
      }}
      onPressOut={() => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 12,
        }).start();
        onPressOut();
      }}
      style={styles.plusButton}
      hitSlop={12}
    >
      <Animated.View
        style={[
          styles.plusButtonInner,
          {
            transform: [
              { scale },
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 45],
                  outputRange: ["0deg", "45deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Feather name="plus" size={26} color="#191D31" />
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
  const [expanded, setExpanded] = useState(false);
  const expandHeight = useRef(new Animated.Value(0)).current;
  const expandOpacity = useRef(new Animated.Value(0)).current;
  const plusRotation = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;

  const currentRoute = state.routes[state.index]?.name;

  const runExpandAnimations = (next: boolean) => {
    Animated.parallel([
      Animated.timing(expandHeight, {
        toValue: next ? EXPANDED_HEIGHT : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(expandOpacity, {
        toValue: next ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(plusRotation, {
        toValue: next ? 45 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(pillScale, {
        toValue: next ? 1.02 : 1,
        useNativeDriver: false,
        speed: 20,
        bounciness: 8,
      }),
    ]).start();
  };

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    runExpandAnimations(next);
  };

  const onSelectTab = (routeName: string) => {
    const r = TAB_ROUTES.find((x) => x.name === routeName);
    if (r) router.push(r.href);
    setExpanded(false);
    Animated.parallel([
      Animated.timing(expandHeight, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(expandOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.timing(plusRotation, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }),
      Animated.spring(pillScale, {
        toValue: 1,
        useNativeDriver: false,
        speed: 20,
        bounciness: 8,
      }),
    ]).start();
  };

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
        <PlusButton
          rotation={plusRotation}
          onPress={toggleExpand}
          onPressIn={() => {}}
          onPressOut={() => {}}
        />
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
      {/* Expandable panel - height (JS) and opacity (native) on separate nodes to avoid useNativeDriver conflict */}
      <Animated.View
        style={[styles.expandPanel, { height: expandHeight }]}
      >
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: expandOpacity }]}>
        {isIOS ? (
          <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill}>
            <View style={styles.segmentContainer}>
              {TAB_ROUTES.map((route) => (
                <Pressable
                  key={route.name}
                  style={[
                    styles.segmentItem,
                    currentRoute === route.name && styles.segmentItemActive,
                  ]}
                  onPress={() => onSelectTab(route.name)}
                >
                  <Feather
                    name={route.icon}
                    size={18}
                    color={currentRoute === route.name ? "#fff" : "#191D31"}
                  />
                  <Text
                    style={[
                      styles.segmentLabel,
                      currentRoute === route.name && styles.segmentLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {route.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </BlurView>
        ) : (
          <View style={styles.segmentContainer}>
            {TAB_ROUTES.map((route) => (
              <Pressable
                key={route.name}
                style={[
                  styles.segmentItem,
                  currentRoute === route.name && styles.segmentItemActive,
                ]}
                onPress={() => onSelectTab(route.name)}
              >
                <Feather
                  name={route.icon}
                  size={18}
                  color={currentRoute === route.name ? "#fff" : "#191D31"}
                />
                <Text
                  style={[
                    styles.segmentLabel,
                    currentRoute === route.name && styles.segmentLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {route.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        </Animated.View>
      </Animated.View>

      {/* Main pill - Liquid Glass (iOS 26) or Blur fallback */}
      <Animated.View
        style={[
          styles.pillWrap,
          {
            transform: [{ scale: pillScale }],
          },
        ]}
      >
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
      </Animated.View>
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
  expandPanel: {
    width: "100%",
    maxWidth: 340,
    marginBottom: 8,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.5)",
    ...(Platform.OS === "android" && {
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    }),
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
  segmentContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  segmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  segmentItemActive: {
    backgroundColor: "rgba(61, 107, 71, 0.85)",
  },
  segmentLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#191D31",
  },
  segmentLabelActive: {
    color: "#fff",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
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
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.2)",
    ...(Platform.OS === "android" && {
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    }),
  },
  plusButtonInner: {
    alignItems: "center",
    justifyContent: "center",
  },
});
