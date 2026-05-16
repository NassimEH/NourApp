import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppIcon } from "@/components/AppIcon";

import BottomBar from "@/components/BottomBar";
import { useTabBarPreference } from "@/lib/tab-bar-preference";
import { QuranAudioProvider } from "@/lib/quran/QuranAudioContext";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

/** Zone icône + libellé (hors safe area) — proche du standard iOS, sans excès de hauteur */
const NATIVE_TAB_CONTENT_HEIGHT = 46;
const NATIVE_TAB_TOP_PADDING = 6;
const NATIVE_TAB_ICON_SIZE = 23;

const TAB_ICONS: Record<string, "home" | "sunrise" | "book-open" | "award" | "search" | "user"> = {
  index: "home",
  qibla: "sunrise",
  coran: "book-open",
  apprendre: "award",
  explore: "search",
  profile: "user",
};

const TAB_LABEL_KEYS: Record<string, string> = {
  index: "tabs.home",
  qibla: "tabs.prayers",
  coran: "tabs.library",
  apprendre: "tabs.learn",
  explore: "tabs.explore",
  profile: "tabs.profile",
};

export default function TabsLayout() {
  const { tabBarVariant } = useTabBarPreference();
  const colors = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const useNativeTabBar = tabBarVariant === "native";

  const nativeTabBottomInset =
    insets.bottom > 0 ? insets.bottom : Platform.OS === "ios" ? 8 : 12;
  const nativeTabBarHeight =
    NATIVE_TAB_TOP_PADDING + NATIVE_TAB_CONTENT_HEIGHT + nativeTabBottomInset;

  const screenOptions = useNativeTabBar
    ? {
        headerShown: false,
        sceneContainerStyle: {
          backgroundColor: colors.usesBackgroundImage
            ? "transparent"
            : colors.background,
        },
        tabBarStyle: {
          position: "absolute" as const,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: nativeTabBarHeight,
          paddingTop: NATIVE_TAB_TOP_PADDING,
          paddingBottom: nativeTabBottomInset,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          justifyContent: "center" as const,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500" as const,
          fontFamily: "PlusJakartaSans-Medium",
          marginTop: 2,
          marginBottom: 0,
          letterSpacing: 0.1,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === "ios" ? 72 : 90}
            tint={colors.tabBarBlurTint}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
      }
    : {
        headerShown: false,
        sceneContainerStyle: {
          backgroundColor: colors.usesBackgroundImage
            ? "transparent"
            : colors.background,
        },
        tabBarStyle: {
          position: "absolute" as const,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      };

  const tabTitle = (routeName: string) => {
    const key = TAB_LABEL_KEYS[routeName];
    return key ? t(key) : routeName;
  };

  return (
    <QuranAudioProvider>
      <Tabs
        tabBar={useNativeTabBar ? undefined : (props) => <BottomBar {...props} />}
      screenOptions={({ route }) => ({
        ...screenOptions,
        ...(useNativeTabBar && {
          title: tabTitle(route.name),
          tabBarIcon: ({ color }) => {
            const iconName = TAB_ICONS[route.name] ?? "home";
            return (
              <AppIcon name={iconName} size={NATIVE_TAB_ICON_SIZE} color={color} />
            );
          },
        }),
      })}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.home") }} />
      <Tabs.Screen name="qibla" options={{ title: t("tabs.prayers") }} />
      <Tabs.Screen name="coran" options={{ title: t("tabs.library") }} />
      <Tabs.Screen name="apprendre" options={{ title: t("tabs.learn") }} />
      <Tabs.Screen name="explore" options={{ title: t("tabs.explore") }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile") }} />
      </Tabs>
    </QuranAudioProvider>
  );
}
