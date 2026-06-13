import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
  type WithSpringConfig,
} from "react-native-reanimated";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { AppIcon } from "@/components/AppIcon";
import { TAB_BAR_ICONS } from "@/constants/tab-bar";
import { useAppTheme } from "@/lib/app-theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_BAR_WIDTH = SCREEN_WIDTH * 0.92;
const TAB_BAR_HEIGHT = 70;
const BUBBLE_HEIGHT = 50;
const BUBBLE_INSET = 8;
const BUBBLE_TOP = (TAB_BAR_HEIGHT - BUBBLE_HEIGHT) / 2;
const ICON_SIZE = 24;

function getBubbleTranslateX(
  index: number,
  tabWidth: number,
  bubbleWidth: number
) {
  return index * tabWidth + (tabWidth - bubbleWidth) / 2;
}

/** Ressort court, sans rebond — évite la traînée du indicateur */
const BUBBLE_SPRING: WithSpringConfig = {
  damping: 28,
  stiffness: 320,
  mass: 0.45,
  overshootClamping: true,
};

function animateBubbleTo(translateX: SharedValue<number>, x: number) {
  translateX.value = withSpring(x, BUBBLE_SPRING);
}

function useNativeGlassAvailable() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "ios") return;
    try {
      setAvailable(
        typeof isGlassEffectAPIAvailable === "function" &&
          isGlassEffectAPIAvailable()
      );
    } catch {
      setAvailable(false);
    }
  }, []);
  return available;
}

export function LiquidTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = useAppTheme();
  const nativeGlass = useNativeGlassAvailable();
  const [barWidth, setBarWidth] = useState(TAB_BAR_WIDTH);
  const tabCount = state.routes.length;
  const tabWidth = barWidth / tabCount;
  const bubbleWidth = tabWidth - BUBBLE_INSET * 2;

  const translateX = useSharedValue(
    getBubbleTranslateX(state.index, tabWidth, bubbleWidth)
  );

  useEffect(() => {
    animateBubbleTo(
      translateX,
      getBubbleTranslateX(state.index, tabWidth, bubbleWidth)
    );
  }, [state.index, tabWidth, bubbleWidth, translateX]);

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const blurIntensity = useMemo(() => {
    if (Platform.OS === "ios") {
      return colors.isDark ? 72 : 88;
    }
    return 110;
  }, [colors.isDark]);

  /** Voile léger par-dessus le flou (effet liquid glass, icônes claires) */
  const liquidGlassOverlay = useMemo(() => {
    if (colors.isDark) {
      return "rgba(255, 255, 255, 0.08)";
    }
    return "rgba(0, 0, 0, 0.04)";
  }, [colors.isDark]);

  const bubbleGradient = useMemo((): [string, string] => {
    return [colors.accent, colors.tabBarIconActive];
  }, [colors.accent, colors.tabBarIconActive]);

  const inactiveIconColor = colors.isDark
    ? "rgba(255, 255, 255, 0.45)"
    : colors.iconMuted;

  const activeRoute = state.routes[state.index];
  const activeIconName = TAB_BAR_ICONS[activeRoute?.name ?? ""] ?? "home";

  const tabRow = (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.liquidBubble,
          { width: bubbleWidth },
          animatedBubbleStyle,
        ]}
      >
        <LinearGradient
          colors={bubbleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.bubbleIconCenter}>
          <AppIcon
            name={activeIconName}
            size={ICON_SIZE}
            color={colors.onAccent}
          />
        </View>
      </Animated.View>

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconName = TAB_BAR_ICONS[route.name] ?? "home";

        const onPress = () => {
          animateBubbleTo(
            translateX,
            getBubbleTranslateX(index, tabWidth, bubbleWidth)
          );
          if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({
              name: route.name,
              merge: true,
              params: undefined,
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={
              typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : options.tabBarAccessibilityLabel
            }
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabItem, { width: tabWidth }]}
            activeOpacity={0.7}
          >
            {!isFocused ? (
              <AppIcon
                name={iconName}
                size={ICON_SIZE}
                color={inactiveIconColor}
              />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </>
  );

  const glassShell = nativeGlass ? (
    <GlassView
      style={[
        styles.glassBackground,
        { borderColor: colors.glassBorder },
      ]}
      glassEffectStyle="regular"
      isInteractive
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      {tabRow}
    </GlassView>
  ) : (
    <View
      style={[
        styles.glassBackground,
        {
          borderColor: colors.glassBorder,
          backgroundColor:
            Platform.OS === "ios" ? undefined : colors.glassSurfaceAndroid,
        },
      ]}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      {Platform.OS !== "web" ? (
        <>
          <BlurView
            intensity={blurIntensity}
            tint={colors.glassBlurTint}
            style={StyleSheet.absoluteFill}
          />
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: liquidGlassOverlay },
            ]}
          />
        </>
      ) : (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: liquidGlassOverlay },
          ]}
        />
      )}
      {tabRow}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          shadowOpacity: colors.isDark ? 0.35 : 0.15,
        },
      ]}
      pointerEvents="box-none"
    >
      {glassShell}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
    overflow: "hidden",
    alignSelf: "center",
  },
  glassBackground: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 25,
    overflow: "hidden",
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    zIndex: 2,
  },
  liquidBubble: {
    position: "absolute",
    top: BUBBLE_TOP,
    left: 0,
    height: BUBBLE_HEIGHT,
    borderRadius: 18,
    zIndex: 3,
    overflow: "hidden",
  },
  bubbleIconCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
