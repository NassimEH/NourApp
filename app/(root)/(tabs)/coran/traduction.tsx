import { Redirect } from "expo-router";

/**
 * Écran « Traduction » retiré : le toggle FR/EN/AR vit dans le lecteur sourate.
 * Redirection vers la liste des sourates.
 */
export default function TraductionScreen() {
  return <Redirect href="/(root)/(tabs)/coran/sourates" />;
}
