import { Stack } from "expo-router";

export default function HadithsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
      initialRouteName="index"
    />
  );
}
