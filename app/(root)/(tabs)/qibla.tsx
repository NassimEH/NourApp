"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  ScrollView,
  Pressable,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import Feather from "@expo/vector-icons/Feather";

import { getQiblaBearing } from "@/lib/prayerUtils";
import {
  usePrayerTimes,
  PRAYER_ORDER,
  getPrayerLabel,
  type PrayerKey,
} from "@/lib/usePrayerTimes";
import { usePrayersChecked } from "@/lib/usePrayersChecked";
import {
  getNextPrayerInfo,
  getCurrentPrayer,
  getNextPrayerTimestamp,
  formatCountdownHM,
} from "@/lib/prayerUtils";
import type { PrayerTimes } from "@/lib/usePrayerTimes";
import { toHijri } from "hijri-converter";

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

const homeBackground = require("@/assets/images/home-background.png");

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COMPASS_SIZE = Math.min(SCREEN_WIDTH - 64, 260);

function useTodayDates() {
  return useMemo(() => {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    const gregorian = now.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    try {
      const { hy, hm, hd } = toHijri(gy, gm, gd);
      const hijri = `${HIJRI_MONTHS[hm - 1]} ${hd}, ${hy}`;
      return { gregorian, hijri };
    } catch {
      return { gregorian, hijri: "" };
    }
  }, []);
}

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

export default function MesPrièresScreen() {
  const { gregorian, hijri } = useTodayDates();
  const { timings: prayerTimes, loading: prayerLoading, cityName: prayerCity, coords: prayerCoords } = usePrayerTimes();
  const { toggle: togglePrayerChecked, isChecked: isPrayerChecked } = usePrayersChecked();

  const [heading, setHeading] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [countdownNow, setCountdownNow] = useState(() => Date.now());

  const needleAnim = useRef(new Animated.Value(0)).current;

  const nextPrayer = prayerTimes ? getNextPrayerInfo(prayerTimes) : null;
  const currentPrayer = prayerTimes ? getCurrentPrayer(prayerTimes) : null;
  const SALAT_KEYS: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const remainingCount = 5 - SALAT_KEYS.filter((k) => isPrayerChecked(k)).length;
  const nextPrayerTimestamp = prayerTimes ? getNextPrayerTimestamp(prayerTimes) : null;
  const nextPrayerCountdownHM = useMemo(() => {
    if (nextPrayerTimestamp == null) return null;
    const remainingSeconds = Math.max(0, Math.floor((nextPrayerTimestamp - countdownNow) / 1000));
    return formatCountdownHM(remainingSeconds);
  }, [nextPrayerTimestamp, countdownNow]);
  const nextPrayerTimeStr = nextPrayer && prayerTimes ? prayerTimes[nextPrayer.name as PrayerKey] : null;

  useEffect(() => {
    if (!prayerTimes || !nextPrayer) return;
    const id = setInterval(() => setCountdownNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, [prayerTimes, nextPrayer]);

  // Position pour l'angle Qibla
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled || status !== "granted") return;
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        if (cancelled) return;
        setBearing(getQiblaBearing(position.coords.latitude, position.coords.longitude));
      } catch {
        if (!cancelled) setCompassError("Position indisponible");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Cap du téléphone (boussole)
  useEffect(() => {
    if (Platform.OS === "web") {
      setCompassError("Boussole non disponible sur le web");
      return;
    }
    let subscription: { remove: () => void } | null = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCompassError("Permission localisation refusée");
          return;
        }
        subscription = await Location.watchHeadingAsync((data) => {
          const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          if (h >= 0) setHeading(h);
        });
      } catch {
        setCompassError("Boussole indisponible");
      }
    })();
    return () => subscription?.remove();
  }, []);

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

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Text style={styles.pageTitle}>Mes prières</Text>

        {/* Bloc prières */}
        <View style={styles.prayerSection}>
          <Text style={styles.sectionLabel}>
            Prières{prayerCity ? ` — ${prayerCity}` : ""}
          </Text>
          <View style={styles.prayerCard}>
            {prayerLoading ? (
              <ActivityIndicator size="small" color="#3d6b47" style={{ paddingVertical: 24 }} />
            ) : prayerTimes ? (
              <>
                <View style={styles.prayerCardHeader}>
                  <Text style={styles.prayerCardMethod}>Aladhan (MWL)</Text>
                  {hijri ? <Text style={styles.prayerCardHijri}>{hijri}</Text> : null}
                  <Text style={styles.prayerCardGregorian}>{gregorian}</Text>
                  {prayerCoords ? (
                    <View style={styles.prayerCardCoords}>
                      <Feather name="map-pin" size={12} color="rgba(0,0,0,0.5)" />
                      <Text style={styles.prayerCardCoordsText}>
                        Lat: {prayerCoords.latitude.toFixed(5)}, Lon: {prayerCoords.longitude.toFixed(5)}
                      </Text>
                    </View>
                  ) : prayerCity ? (
                    <View style={styles.prayerCardCoords}>
                      <Feather name="map-pin" size={12} color="rgba(0,0,0,0.5)" />
                      <Text style={styles.prayerCardCoordsText}>{prayerCity}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.prayerCardRemaining}>
                    {remainingCount} prière{remainingCount !== 1 ? "s" : ""} restante{remainingCount !== 1 ? "s" : ""} à faire
                  </Text>
                </View>
                {PRAYER_ORDER.filter((k) => k !== "Sunrise").map((key, index) => {
                  const prayerKey = key as PrayerKey;
                  const checked = isPrayerChecked(prayerKey);
                  const isCurrent = currentPrayer?.label === getPrayerLabel(prayerKey);
                  return (
                    <Pressable
                      key={key}
                      style={({ pressed }) => [
                        styles.prayerRow,
                        isCurrent && styles.prayerRowCurrent,
                        index === PRAYER_ORDER.filter((k) => k !== "Sunrise").length - 1 && styles.prayerRowLast,
                        pressed && styles.prayerRowPressed,
                      ]}
                      onPress={() => togglePrayerChecked(prayerKey)}
                    >
                      <View style={styles.prayerRowLeft}>
                        <Text
                          style={[styles.prayerRowLabel, checked && styles.prayerLabelDone]}
                          numberOfLines={1}
                        >
                          {getPrayerLabel(prayerKey)}
                        </Text>
                        <View style={styles.prayerRowTimeRow}>
                          {isCurrent && <View style={styles.prayerRowCurrentDot} />}
                          <Text style={styles.prayerRowTime}>{prayerTimes[prayerKey]}</Text>
                        </View>
                      </View>
                      <View style={styles.prayerRowCheckboxWrap}>
                        <View style={[styles.prayerCheckbox, checked && styles.prayerCheckboxChecked]}>
                          {checked ? <Feather name="check" size={14} color="#fff" /> : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
                {nextPrayer && (
                  <>
                    <View style={styles.sectionDivider} />
                    <View style={styles.prayerNextWidget}>
                      <View style={styles.prayerNextWidgetLeft}>
                        <Text style={styles.prayerNextLabel}>PROCHAINE PRIÈRE</Text>
                        <View style={styles.prayerNextWidgetRow}>
                          <Feather name="sunset" size={14} color="rgba(61, 107, 71, 0.9)" />
                          <Text style={styles.prayerNextText}>
                            {nextPrayer.label}{nextPrayerTimeStr ? ` à ${nextPrayerTimeStr}` : ""}
                          </Text>
                        </View>
                      </View>
                      {nextPrayerCountdownHM != null && (
                        <Text style={styles.prayerNextCountdown}>{nextPrayerCountdownHM}</Text>
                      )}
                    </View>
                  </>
                )}
                <Text style={styles.prayerCardFooter}>
                  {currentPrayer ? `${currentPrayer.label} : Standard` : "Calcul : MWL"}
                </Text>
              </>
            ) : (
              <Text style={styles.prayerUnavailable}>Horaires non disponibles</Text>
            )}
          </View>
        </View>

        {/* Section Qibla */}
        <View style={styles.qiblaSection}>
          <Text style={styles.sectionLabel}>Qibla</Text>
          <Text style={styles.qiblaSubtitle}>
            Dirigez l'aiguille vers le haut pour faire face à la Mecque
          </Text>

          {compassError ? (
            <View style={styles.compassError}>
              <Text style={styles.compassErrorText}>{compassError}</Text>
              {bearing !== null && (
                <Text style={styles.qiblaAngle}>Angle Qibla : {Math.round(bearing)}°</Text>
              )}
            </View>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.directionLabel}>{direction}</Text>
                <Text style={styles.degreeLabel}>{degree}°</Text>
              </View>

              <View style={[styles.compassCircle, { width: COMPASS_SIZE, height: COMPASS_SIZE, borderRadius: COMPASS_SIZE / 2 }]}>
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
                    },
                  ]}
                  pointerEvents="none"
                >
                  <View style={[styles.needle, { width: 10, height: needleLength, borderRadius: 5 }]} />
                </Animated.View>
              </View>

              {bearing !== null && (
                <Text style={styles.qiblaAngle}>Qibla : {Math.round(bearing)}°</Text>
              )}
            </>
          )}
        </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  pageTitle: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
    marginTop: 8,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
    marginBottom: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 12,
  },
  prayerSection: { marginBottom: 32 },
  prayerCard: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft: 22,
    borderLeftWidth: 3,
    borderLeftColor: "rgba(61, 107, 71, 0.35)",
  },
  prayerCardHeader: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  prayerCardMethod: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.5)",
    marginBottom: 4,
  },
  prayerCardHijri: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "rgba(0,0,0,0.85)",
    marginBottom: 2,
  },
  prayerCardGregorian: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.6)",
    marginBottom: 4,
  },
  prayerCardCoords: { flexDirection: "row", alignItems: "center", gap: 4 },
  prayerCardCoordsText: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.5)",
  },
  prayerCardRemaining: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.6)",
    marginTop: 6,
  },
  prayerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: -6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
    position: "relative",
  },
  prayerRowCurrent: {
    backgroundColor: "rgba(61, 107, 71, 0.12)",
    borderRadius: 12,
    marginHorizontal: 0,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  prayerRowLeft: { flex: 1, marginRight: 44 },
  prayerRowTimeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  prayerRowLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#191D31",
  },
  prayerLabelDone: { textDecorationLine: "line-through", color: "#5b5d5e" },
  prayerRowTime: { fontSize: 14, fontFamily: "PlusJakartaSans-Regular", color: "#5b5d5e" },
  prayerRowCurrentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(61, 107, 71, 0.9)",
  },
  prayerRowCheckboxWrap: { position: "absolute", right: 0, top: 16 },
  prayerRowLast: { borderBottomWidth: 0 },
  prayerRowPressed: { opacity: 0.7 },
  prayerCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(61, 107, 71, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  prayerCheckboxChecked: {
    backgroundColor: "rgba(61, 107, 71, 0.9)",
    borderColor: "rgba(61, 107, 71, 0.9)",
  },
  prayerNextWidget: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  prayerNextWidgetLeft: { flex: 1 },
  prayerNextLabel: {
    fontSize: 9,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.55)",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  prayerNextWidgetRow: { flexDirection: "row", alignItems: "center" },
  prayerNextText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
    marginLeft: 6,
  },
  prayerNextCountdown: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
    color: "rgba(0,0,0,0.85)",
    letterSpacing: 0.5,
  },
  prayerCardFooter: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.45)",
    marginTop: 10,
    textAlign: "center",
  },
  prayerUnavailable: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    paddingVertical: 12,
  },
  qiblaSection: {
    paddingTop: 8,
    alignItems: "center",
  },
  qiblaSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    textAlign: "center",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 16,
    marginBottom: 24,
  },
  directionLabel: {
    fontSize: 40,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#3d6b47",
  },
  degreeLabel: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
  },
  compassCircle: {
    borderWidth: 3,
    borderColor: "rgba(61, 107, 71, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  northDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  needleWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  needle: {
    backgroundColor: "#3d6b47",
    position: "absolute",
    bottom: 0,
  },
  qiblaAngle: {
    marginTop: 24,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#5b5d5e",
  },
  compassError: { alignItems: "center", paddingVertical: 24 },
  compassErrorText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#c0392b",
    textAlign: "center",
    marginBottom: 8,
  },
});
