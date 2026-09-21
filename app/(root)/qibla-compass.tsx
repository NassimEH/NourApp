import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";

import { ToolScreenLayout } from "@/components/ToolScreenLayout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation } from "@/lib/i18n";
import { getQiblaBearing } from "@/lib/prayerUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COMPASS_SIZE = Math.min(SCREEN_WIDTH - 64, 260);

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

/** Outil Qibla — boussole (hors onglet Mes prières). */
export default function QiblaToolScreen() {
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t } = useTranslation();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );

  const [heading, setHeading] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [needleAnim] = useState(() => new Animated.Value(0));

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
        if (!cancelled) setCompassError(t("qibla.positionUnavailable"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (Platform.OS === "web") return;
    let subscription: { remove: () => void } | null = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCompassError(t("qibla.locationPermissionDenied"));
          return;
        }
        subscription = await Location.watchHeadingAsync((data) => {
          const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          if (h >= 0) setHeading(h);
        });
      } catch {
        setCompassError(t("qibla.compassUnavailable"));
      }
    })();
    return () => subscription?.remove();
  }, [t]);

  const needleAngle =
    heading !== null && bearing !== null ? (bearing - heading + 360) % 360 : 0;

  useEffect(() => {
    Animated.timing(needleAnim, {
      toValue: needleAngle,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [needleAngle, needleAnim]);

  const direction = heading !== null ? getDirection(heading) : "—";
  const degree = heading !== null ? Math.round(heading) : 0;
  const needleLength = COMPASS_SIZE / 2 - 24;
  const displayedCompassError =
    Platform.OS === "web" ? t("qibla.compassWebUnavailable") : compassError;

  return (
    <ToolScreenLayout
      title={t("tools.qiblaShortcut.toolTitle")}
      subtitle={t("tools.qiblaShortcut.toolSubtitle")}
    >
      <View style={styles.body}>
        <Text style={styles.instructions}>{t("qibla.instructions")}</Text>

        {displayedCompassError ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{displayedCompassError}</Text>
            {bearing !== null ? (
              <Text style={styles.bearing}>
                {t("qibla.angle", { angle: Math.round(bearing) })}
              </Text>
            ) : null}
          </View>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.direction}>{direction}</Text>
              <Text style={styles.degree}>{degree}°</Text>
            </View>

            <View
              style={[
                styles.compass,
                {
                  width: COMPASS_SIZE,
                  height: COMPASS_SIZE,
                  borderRadius: COMPASS_SIZE / 2,
                },
              ]}
            >
              <View style={[styles.northDot, { top: 12 }]} />
              <Animated.View
                style={[
                  styles.needleWrapper,
                  {
                    width: 10,
                    height: needleLength,
                    marginLeft: -5,
                    marginTop: -needleLength / 2,
                    transform: [
                      {
                        rotate: needleAnim.interpolate({
                          inputRange: [0, 360],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                    pointerEvents: "none",
                  },
                ]}
              >
                <View
                  style={[
                    styles.needle,
                    { width: 10, height: needleLength, borderRadius: 5 },
                  ]}
                />
              </Animated.View>
            </View>

            {bearing !== null ? (
              <Text style={styles.bearing}>
                {t("qibla.bearing", { angle: Math.round(bearing) })}
              </Text>
            ) : null}
          </>
        )}
      </View>
    </ToolScreenLayout>
  );
}

function createStyles(
  c: ReturnType<typeof useAppTheme>,
  typography: ReturnType<typeof useAppTypography>
) {
  return StyleSheet.create({
    body: {
      alignItems: "center",
      paddingTop: 8,
    },
    instructions: {
      fontSize: typography.body,
      fontFamily: "PlusJakartaSans-Regular",
      color: c.textMuted,
      textAlign: "center",
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 16,
      marginBottom: 24,
    },
    direction: {
      fontSize: 40,
      fontFamily: "PlusJakartaSans-Bold",
      color: c.accent,
    },
    degree: {
      fontSize: typography.title,
      fontFamily: "PlusJakartaSans-SemiBold",
      color: c.text,
    },
    compass: {
      borderWidth: 3,
      borderColor: c.accentBorder,
      backgroundColor: c.cardElevated,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    northDot: {
      position: "absolute",
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: c.isDark
        ? "rgba(255,255,255,0.35)"
        : "rgba(0, 0, 0, 0.2)",
    },
    needleWrapper: {
      position: "absolute",
      top: "50%",
      left: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
    needle: {
      backgroundColor: c.accent,
      position: "absolute",
      bottom: 0,
    },
    bearing: {
      marginTop: 24,
      fontSize: typography.body,
      fontFamily: "PlusJakartaSans-Medium",
      color: c.textMuted,
    },
    errorWrap: {
      alignItems: "center",
      paddingVertical: 24,
    },
    errorText: {
      fontSize: typography.body,
      fontFamily: "PlusJakartaSans-Medium",
      color: c.danger,
      textAlign: "center",
      marginBottom: 8,
    },
  });
}
