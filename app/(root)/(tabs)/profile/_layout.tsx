import { Stack } from "expo-router";

import { useAppTheme } from "@/lib/app-theme";

export default function ProfileLayout() {
  const colors = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: colors.background },
      }}
    />
  );
}
