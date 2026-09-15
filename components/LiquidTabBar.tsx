import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";

import { AppIcon } from "@/components/AppIcon";
import { TAB_BAR_ICONS } from "@/constants/tab-bar";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

const PILL_ROUTE_NAMES = [
  "index",
  "qibla",
  "coran",
  "apprendre",
  "explore",
] as const;

const CIRCLE_ROUTE_NAME = "profile";

const TAB_LABEL_KEYS: Record<string, string> = {
  index: "tabs.home",
  qibla: "tabs.prayers",
  coran: "tabs.library",
  apprendre: "tabs.learn",
  explore: "tabs.explore",
  profile: "tabs.profile",
};

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

/** Coque verre claire (pas d’assombrissement). */
function GlassShell({
  children,
  circle,
}: {
  children: ReactNode;
  circle?: boolean;
}) {
  const colors = useAppTheme();
  const nativeGlass = useNativeGlassAvailable();

  const borderColor = colors.isDark
    ? "rgba(255,255,255,0.22)"
    : "rgba(255,255,255,0.55)";

  /** Voile léger — barre plus transparente / moins opaque. */
  const frost = colors.isDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(255,255,255,0.28)";

  const shellStyle = [
    circle ? styles.circleShell : styles.pillShell,
    {
      borderColor,
      backgroundColor: colors.isDark
        ? "rgba(40,40,42,0.28)"
        : "rgba(255,255,255,0.28)",
      shadowOpacity: colors.isDark ? 0.28 : 0.1,
    },
  ];

  if (nativeGlass) {
    return (
      <GlassView
        style={shellStyle}
        glassEffectStyle="clear"
        colorScheme={colors.isDark ? "dark" : "light"}
        isInteractive
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={shellStyle}>
      {Platform.OS !== "web" ? (
        <BlurView
          intensity={Platform.OS === "ios" ? 42 : 70}
          tint={colors.isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: frost }]}
      />
      {children}
    </View>
  );
}

/**
 * Bottom bar glass iOS 26 — pilule claire + profil rond.
 * Pas de halo/contour autour des icônes.
 */
export function LiquidTabBar({ state, navigation }: BottomTabBarProps) {
  const colors = useAppTheme();
  const { t } = useTranslation();

  const activeName = state.routes[state.index]?.name;
  const inactiveColor = colors.isDark
    ? "rgba(255,255,255,0.92)"
    : "rgba(10,10,12,0.92)";
  const activeColor = colors.tabBarIconActive;

  const navigateTo = (routeName: string) => {
    if (Platform.OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (activeName !== routeName && !event.defaultPrevented) {
      navigation.navigate({
        name: routeName,
        merge: true,
        params: undefined,
      });
    }
  };

  const pillTabs = useMemo(
    () =>
      PILL_ROUTE_NAMES.filter((name) =>
        state.routes.some((r) => r.name === name)
      ),
    [state.routes]
  );

  return (
    <View style={styles.row} pointerEvents="box-none">
      <View style={styles.pillWrap}>
        <GlassShell>
          <View style={styles.pillInner}>
            {pillTabs.map((name) => {
              const focused = activeName === name;
              const color = focused ? activeColor : inactiveColor;
              const label = t(TAB_LABEL_KEYS[name] ?? name);
              return (
                <Pressable
                  key={name}
                  onPress={() => navigateTo(name)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: focused }}
                  accessibilityLabel={label}
                  style={({ pressed }) => [
                    styles.tabItem,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.tabColumn}>
                    <AppIcon
                      name={TAB_BAR_ICONS[name] ?? "home"}
                      size={20}
                      color={color}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        { color },
                        focused && styles.tabLabelActive,
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </GlassShell>
      </View>

      <Pressable
        onPress={() => navigateTo(CIRCLE_ROUTE_NAME)}
        accessibilityRole="button"
        accessibilityState={{ selected: activeName === CIRCLE_ROUTE_NAME }}
        accessibilityLabel={t(TAB_LABEL_KEYS[CIRCLE_ROUTE_NAME])}
        style={({ pressed }) => [styles.circlePress, pressed && styles.pressed]}
      >
        <GlassShell circle>
          <View style={styles.circleInner}>
            <AppIcon
              name={TAB_BAR_ICONS[CIRCLE_ROUTE_NAME] ?? "user"}
              size={22}
              color={
                activeName === CIRCLE_ROUTE_NAME ? activeColor : inactiveColor
              }
            />
          </View>
        </GlassShell>
      </Pressable>
    </View>
  );
}

const PILL_HEIGHT = 62;
const CIRCLE_SIZE = 56;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    paddingHorizontal: 2,
  },
  pillWrap: {
    flex: 1,
    minWidth: 0,
  },
  pillShell: {
    width: "100%",
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 8,
  },
  circlePress: {
    flexShrink: 0,
  },
  circleShell: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 8,
  },
  pillInner: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    height: "100%",
  },
  tabColumn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: 8.5,
    lineHeight: 10,
    fontFamily: "PlusJakartaSans-SemiBold",
    letterSpacing: -0.25,
    textAlign: "center",
    width: "100%",
  },
  tabLabelActive: {
    fontFamily: "PlusJakartaSans-Bold",
  },
  circleInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
  },
});
