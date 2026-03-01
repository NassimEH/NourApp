import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="theme" />
      <Stack.Screen name="tab-bar" />
      <Stack.Screen name="icon-style" />
      <Stack.Screen name="text-size" />
      <Stack.Screen name="accent" />
      <Stack.Screen name="language" />
      <Stack.Screen name="security" />
    </Stack>
  );
}
