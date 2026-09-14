import { Redirect } from "expo-router";

/** Ancien lien conservé pour la compatibilité des favoris et liens profonds. */
export default function MosqueeScreen() {
  return <Redirect href="/(root)/(tabs)/qibla" />;
}
