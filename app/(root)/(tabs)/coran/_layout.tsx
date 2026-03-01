import { Stack } from "expo-router";

export default function CoranLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="sourates" />
      <Stack.Screen name="recherche" />
      <Stack.Screen name="recitateurs" />
      <Stack.Screen name="recitateur-detail" />
      <Stack.Screen name="player" />
      <Stack.Screen name="tafsir" />
      <Stack.Screen name="traduction" />
      <Stack.Screen name="memorisation" />
      <Stack.Screen name="invocations" />
      <Stack.Screen name="invocations-meteo" />
      <Stack.Screen name="invocations-matin-soir" />
      <Stack.Screen name="invocations-sommeil" />
      <Stack.Screen name="hadiths" />
      <Stack.Screen name="hadith-jour" />
      <Stack.Screen name="hadiths-theme" />
    </Stack>
  );
}
