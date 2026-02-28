import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { getQiblaBearing } from "./prayerUtils";

/**
 * Retourne l'angle de la Qibla en degrés (0-360) à partir de la position actuelle.
 * Utilisé pour la boussole dans la bottom bar.
 */
export function useQiblaBearing(): number | null {
  const [bearing, setBearing] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled || status !== "granted") return;
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        if (cancelled) return;
        setBearing(
          getQiblaBearing(position.coords.latitude, position.coords.longitude)
        );
      } catch {
        if (!cancelled) setBearing(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return bearing;
}
