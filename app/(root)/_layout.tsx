import { Redirect, Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "@/lib/global-provider";

export default function AppLayout() {
  const { loading, isLogged, isGuest } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView className="bg-transparent h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  if (!isLogged && !isGuest) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "default",
      }}
    />
  );
}
