"use client";

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Animated } from "react-native";
import * as Location from "expo-location";

import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

interface QiblaCompassProps {
  /** Bearing vers la Mecque en degrés (0-360, nord = 0) */
  bearing: number;
  size?: number;
  /** Masquer le label "Qibla" (ex: dans la bottom bar) */
  hideLabel?: boolean;
}

export default function QiblaCompass({ bearing, size = 64, hideLabel }: QiblaCompassProps) {
  const colors = useAppTheme();
  const { t } = useTranslation();
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needleAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }
    let subscription: { remove: () => void } | null = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError(t("qibla.locationPermissionDenied"));
          return;
        }
        subscription = await Location.watchHeadingAsync((data) => {
          const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          if (h >= 0) setHeading(h);
        });
      } catch {
        setError(t("qibla.compassUnavailable"));
      }
    })();
    return () => {
      subscription?.remove();
    };
  }, [t]);

  // Angle de l'aiguille : pointe vers le haut quand le téléphone est dirigé vers la Mecque
  const needleAngle = heading !== null ? (bearing - heading + 360) % 360 : 0;

  useEffect(() => {
    Animated.timing(needleAnim, {
      toValue: needleAngle,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [needleAngle, needleAnim]);

  if (error || Platform.OS === "web") {
    return (
      <View style={[styles.wrapper, { width: size, height: size }]}>
        <Text style={[styles.fallback, { color: colors.text }]}>
          {t("qibla.bearing", { angle: Math.round(bearing) })}
        </Text>
      </View>
    );
  }

  const needleLength = size / 2 - 8;
  return (
    <View style={[styles.wrapper, { width: size, height: hideLabel ? size : size + 18 }]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: colors.accentBorder,
            backgroundColor: colors.card,
          },
        ]}
      >
        <View style={[styles.northDot, { top: 4, backgroundColor: colors.iconMuted }]} />
        <Animated.View
          style={[
            styles.needle,
            {
              backgroundColor: colors.accent,
              width: 4,
              height: needleLength,
              marginLeft: -2,
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
      {!hideLabel && (
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {t("qibla.title")}
        </Text>
      )}
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
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  northDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  needle: {
    position: "absolute",
    borderRadius: 2,
    top: "50%",
    left: "50%",
  },
  label: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 4,
  },
  fallback: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
