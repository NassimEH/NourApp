"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { getQiblaBearing } from "@/lib/prayerUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COMPASS_SIZE = Math.min(SCREEN_WIDTH - 80, 280);

function getDirection(degree: number): string {
  if (degree >= 22.5 && degree < 67.5) return "NE";
  if (degree >= 67.5 && degree < 112.5) return "E";
  if (degree >= 112.5 && degree < 157.5) return "SE";
  if (degree >= 157.5 && degree < 202.5) return "S";
  if (degree >= 202.5 && degree < 247.5) return "SW";
  if (degree >= 247.5 && degree < 292.5) return "W";
  if (degree >= 292.5 && degree < 337.5) return "NW";
  return "N";
}

export default function QiblaScreen() {
  const [heading, setHeading] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const needleAnim = useRef(new Animated.Value(0)).current;

  // Position pour calculer l'angle Qibla
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
        if (!cancelled) setError("Position indisponible");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Cap du téléphone (boussole)
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
          setError("Permission localisation refusée");
          return;
        }
        subscription = await Location.watchHeadingAsync((data) => {
          const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          if (h >= 0) setHeading(h);
        });
      } catch {
        setError("Boussole indisponible");
      }
    })();
    return () => {
      subscription?.remove();
    };
  }, []);

  const needleAngle =
    heading !== null && bearing !== null
      ? (bearing - heading + 360) % 360
      : 0;

  useEffect(() => {
    Animated.timing(needleAnim, {
      toValue: needleAngle,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [needleAngle, needleAnim]);

  const direction = heading !== null ? getDirection(heading) : "—";
  const degree = heading !== null ? Math.round(heading) : 0;
  const needleLength = COMPASS_SIZE / 2 - 20;

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.title}>Qibla</Text>
          <Text style={styles.error}>{error}</Text>
          {bearing !== null && (
            <Text style={styles.fallback}>Angle Qibla : {Math.round(bearing)}°</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Qibla</Text>
        <Text style={styles.subtitle}>Dirigez l'aiguille vers le haut pour faire face à la Mecque</Text>

        <View style={styles.infoRow}>
          <Text style={styles.directionLabel}>{direction}</Text>
          <Text style={styles.degreeLabel}>{degree}°</Text>
        </View>

        <View style={[styles.compassCircle, { width: COMPASS_SIZE, height: COMPASS_SIZE, borderRadius: COMPASS_SIZE / 2 }]}>
          <View style={[styles.northDot, { top: 14 }]} />
          <Animated.View
            style={[
              styles.needle,
              {
                width: 6,
                height: needleLength,
                marginLeft: -3,
                marginTop: -needleLength,
                transform: [
                  {
                    rotate: needleAnim.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {bearing !== null && (
          <Text style={styles.qiblaAngle}>Qibla : {Math.round(bearing)}°</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F6F9",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    textAlign: "center",
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 16,
    marginBottom: 40,
  },
  directionLabel: {
    fontSize: 48,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#3d6b47",
  },
  degreeLabel: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
  },
  compassCircle: {
    borderWidth: 3,
    borderColor: "rgba(61, 107, 71, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  northDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  needle: {
    position: "absolute",
    backgroundColor: "rgba(61, 107, 71, 0.95)",
    borderRadius: 3,
    top: "50%",
    left: "50%",
  },
  qiblaAngle: {
    marginTop: 32,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#5b5d5e",
  },
  error: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#c0392b",
    textAlign: "center",
    marginTop: 16,
  },
  fallback: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    marginTop: 8,
  },
});
