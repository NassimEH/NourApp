import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

import BottomBar from "@/components/BottomBar";
import { useTabBarPreference } from "@/lib/tab-bar-preference";

const TAB_ICONS: Record<string, "home" | "sunrise" | "book-open" | "search" | "user"> = {
  index: "home",
  qibla: "sunrise",
  coran: "book-open",
  explore: "search",
  profile: "user",
};

const TAB_LABELS: Record<string, string> = {
  index: "Accueil",
  qibla: "Mes prières",
  coran: "Bibliothèque",
  explore: "Explore",
  profile: "Profil",
};

export default function TabsLayout() {
  const { tabBarVariant } = useTabBarPreference();
  const useNativeTabBar = tabBarVariant === "native";

  const screenOptions = useNativeTabBar
    ? {
        headerShown: false,
        sceneContainerStyle: { backgroundColor: "transparent" },
        tabBarStyle: {
          position: "absolute" as const,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === "ios" ? 80 : 100}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: "#3d6b47",
        tabBarInactiveTintColor: "#5b5d5e",
        tabBarShowLabel: true,
      }
    : {
        headerShown: false,
        sceneContainerStyle: { backgroundColor: "transparent" },
        tabBarStyle: {
          position: "absolute" as const,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      };

  return (
    <Tabs
      tabBar={useNativeTabBar ? undefined : (props) => <BottomBar {...props} />}
      screenOptions={({ route }) => ({
        ...screenOptions,
        ...(useNativeTabBar && {
          title: TAB_LABELS[route.name] ?? route.name,
          tabBarIcon: ({ color, size }) => {
            const iconName = TAB_ICONS[route.name] ?? "home";
            return <Feather name={iconName} size={size ?? 24} color={color} />;
          },
        }),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Accueil" }} />
      <Tabs.Screen name="qibla" options={{ title: "Mes prières" }} />
      <Tabs.Screen name="coran" options={{ title: "Bibliothèque" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
