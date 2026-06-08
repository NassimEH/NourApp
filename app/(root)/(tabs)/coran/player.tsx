import { Redirect } from "expo-router";

/** Redirige vers l'onglet Écoute — le player global vit dans BottomBar / QuranMiniPlayer. */
export default function PlayerScreen() {
  return <Redirect href="/(root)/(tabs)/explore" />;
}
