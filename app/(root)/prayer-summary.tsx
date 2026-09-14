import { Redirect } from "expo-router";

/**
 * Outil « Prière du jour » fusionné avec l'onglet Mes prières (qibla).
 */
export default function PrayerSummaryScreen() {
  return <Redirect href="/(root)/(tabs)/qibla" />;
}
