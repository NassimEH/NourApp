import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  Easing,
  Platform,
  StyleSheet,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_ROUTES = [
  { name: "index" as const, label: "Home", icon: "home" as const },
  { name: "explore" as const, label: "Explore", icon: "search" as const },
  { name: "profile" as const, label: "Profile", icon: "user" as const },
];

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 4,
};

export default function BottomBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const currentRoute = state.routes[state.index]?.name;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Platform.OS === "ios" ? 34 : 24 },
      ]}
    >
      <View style={[styles.pill, shadowStyle]}>
        {TAB_ROUTES.map((route) => (
          <BottomBarItem
            key={route.name}
            icon={route.icon}
            title={route.label}
            isActive={currentRoute === route.name}
            onPress={() => navigation.navigate(route.name)}
          />
        ))}
      </View>
    </View>
  );
}

type FeatherIconName = "home" | "search" | "user";

interface BottomBarItemProps {
  icon: FeatherIconName;
  title: string;
  isActive: boolean;
  onPress: () => void;
}

function BottomBarItem({ icon, title, isActive, onPress }: BottomBarItemProps) {
  const widthAnim = useRef(new Animated.Value(isActive ? 90 : 44)).current;
  const textOpacityAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: isActive ? 90 : 44,
        duration: 350,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
      Animated.timing(textOpacityAnim, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, widthAnim, textOpacityAnim]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.item, isActive && styles.itemActive]}
    >
      <Animated.View style={[styles.itemInner, { width: widthAnim }]}>
        <View style={styles.iconWrap}>
          <Feather
            name={icon}
            size={20}
            color={isActive ? "#FFFFFF" : "#191D31"}
          />
        </View>
        <Animated.View
          style={{
            opacity: textOpacityAnim,
            transform: [
              {
                translateX: textOpacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-8, 0],
                }),
              },
            ],
          }}
        >
          <Text
            style={[styles.label, isActive && styles.labelActive]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    width: 300,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    marginHorizontal: 2,
    overflow: "hidden",
  },
  itemActive: {
    backgroundColor: "rgba(107, 78, 170, 0.85)",
  },
  itemInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#191D31",
    fontFamily: "PlusJakartaSans-Regular",
  },
  labelActive: {
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans-Medium",
  },
});
