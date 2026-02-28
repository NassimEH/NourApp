"use client";

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import * as Location from "expo-location";

interface QiblaCompassProps {
  /** Bearing vers la Mecque en degrés (0-360, nord = 0) */
  bearing: number;
  size?: number;
}

export default function QiblaCompass({ bearing, size = 64 }: QiblaCompassProps) {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      setError("Boussole non disponible sur le web");
      return;
    }
    let subscription: { remove: () => void } | null = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission refusée");
          return;
        }
        subscription = await Location.watchHeadingAsync((data) => {
          const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          if (h >= 0) setHeading(h);
        });
      } catch (e) {
        setError("Boussole indisponible");
      }
    })();
    return () => {
      subscription?.remove();
    };
  }, []);

  // Angle de l'aiguille : quand le téléphone pointe vers la Mecque, l'aiguille doit être en haut (0°)
  const needleAngle = heading !== null ? (bearing - heading + 360) % 360 : 0;

  if (error) {
    return (
      <View style={[styles.wrapper, { width: size, height: size }]}>
        <Text style={styles.fallback}>Qibla {Math.round(bearing)}°</Text>
      </View>
    );
  }

  const needleLength = size / 2 - 8;
  return (
    <View style={[styles.wrapper, { width: size, height: size + 18 }]}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.northDot, { top: 4 }]} />
        {/* Aiguille : du centre vers la Qibla (pointe vers le haut quand téléphone dirigé vers La Mecque) */}
        <View
          style={[
            styles.needle,
            {
              width: 4,
              height: needleLength,
              marginLeft: -2,
              marginTop: -needleLength,
              transform: [{ rotate: `${needleAngle}deg` }],
            },
          ]}
        />
      </View>
      <Text style={styles.label}>Qibla</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    borderWidth: 1.5,
    borderColor: "rgba(61, 107, 71, 0.4)",
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  northDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  needle: {
    position: "absolute",
    backgroundColor: "rgba(61, 107, 71, 0.9)",
    borderRadius: 2,
    top: "50%",
    left: "50%",
  },
  label: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.6)",
    marginTop: 4,
  },
  fallback: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.7)",
  },
});
