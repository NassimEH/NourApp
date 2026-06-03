import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Alert,
  View,
  Text,
  Platform,
  Dimensions,
  Animated,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { router } from "expo-router";
import { AppIcon } from "@/components/AppIcon";
import { HomeMosqueBlock } from "@/components/home/HomeMosqueBlock";
import { PrayerLocationSearchBar } from "@/components/prayers/PrayerLocationSearchBar";

import {
  getQiblaBearing,
  getNextPrayerInfo,
  getCurrentPrayer,
  getNextPrayerTimestamp,
  formatCountdownHM,
} from "@/lib/prayerUtils";
import {
  usePrayerTimes,
  PRAYER_ORDER,
  getPrayerLabel,
  type PrayerKey,
} from "@/lib/usePrayerTimes";
import { usePrayersChecked } from "@/lib/usePrayersChecked";
import { toHijri } from "hijri-converter";
import { ScreenBackground } from "@/components/ScreenBackground";
import { screenPageHeaderSpacing } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { TRANSLATIONS, useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";
import { createQiblaStyles } from "@/lib/qibla-screen-styles";
import { useMosqueName } from "@/lib/home/hooks/useMosqueName";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COMPASS_SIZE = Math.min(SCREEN_WIDTH - 64, 260);

function useTodayDates(locale: "fr" | "en" | "ar", hijriMonths: readonly string[]) {
  return useMemo(() => {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    const gregorian = now.toLocaleDateString(
      locale === "ar" ? "ar-SA" : locale === "en" ? "en-US" : "fr-FR",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
    try {
      const { hy, hm, hd } = toHijri(gy, gm, gd);
      const hijri = `${hijriMonths[hm - 1] ?? ""} ${hd}, ${hy}`;
      return { gregorian, hijri };
    } catch {
      return { gregorian, hijri: "" };
    }
  }, [hijriMonths, locale]);
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
  const { t, locale } = useTranslation();
  const colors = useAppTheme();
  const styles = useMemo(() => createQiblaStyles(colors), [colors]);
  const hijriMonths = TRANSLATIONS[locale].home.hijriMonths;
  const { gregorian, hijri } = useTodayDates(locale, hijriMonths);
  const {
    timings: prayerTimes,
    loading: prayerLoading,
    applyingLocation,
    cityName: prayerCity,
    coords: prayerCoords,
    applyLocationByQuery,
    applyDeviceLocation,
  } = usePrayerTimes();
  const { toggle: togglePrayerChecked, isChecked: isPrayerChecked } = usePrayersChecked();
  const { mosqueName } = useMosqueName();
  const mosqueDisplayName = mosqueName ?? t("home.defaultMosqueName");

  const [heading, setHeading] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [countdownNow, setCountdownNow] = useState(() => Date.now());
  const [locationQuery, setLocationQuery] = useState("");

  const needleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (prayerCity) setLocationQuery(prayerCity);
  }, [prayerCity]);

  const handleLocationSubmit = async () => {
    const result = await applyLocationByQuery(locationQuery);
    if (!result.ok && result.reason !== "empty") {
      Alert.alert(t("screens.prayersTitle"), t("screens.prayersLocationError"));
    }
  };

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
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("screens.prayersTitle")}
          subtitle={t("screens.prayersSubtitle")}
          style={screenPageHeaderSpacing}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <PrayerLocationSearchBar
          value={locationQuery}
          onChangeText={setLocationQuery}
          onSubmit={() => void handleLocationSubmit()}
          onClear={() => setLocationQuery("")}
          onUseDeviceLocation={() => {
            setLocationQuery("");
            void applyDeviceLocation();
          }}
          loading={applyingLocation}
        />

        <HomeMosqueBlock
          prayerLoading={prayerLoading}
          prayerTimes={prayerTimes}
          mosqueDisplayName={mosqueDisplayName}
          onEditMosque={() => router.push("/(root)/mosque-settings")}
        />

        {/* Bloc prières */}
        <View style={styles.prayerSection}>
          <Text style={styles.sectionLabel}>
            Prières{prayerCity ? ` — ${prayerCity}` : ""}
          </Text>
          <View style={styles.prayerCard}>
            {prayerLoading ? (
              <ActivityIndicator size="small" color={colors.accent} style={{ paddingVertical: 24 }} />
            ) : prayerTimes ? (
              <>
                <View style={styles.prayerCardHeader}>
                  <Text style={styles.prayerCardMethod}>Aladhan (MWL)</Text>
                  {hijri ? <Text style={styles.prayerCardHijri}>{hijri}</Text> : null}
                  <Text style={styles.prayerCardGregorian}>{gregorian}</Text>
                  {prayerCoords ? (
                    <View style={styles.prayerCardCoords}>
                      <AppIcon name="map-pin" size={12} color={colors.iconMuted} />
                      <Text style={styles.prayerCardCoordsText}>
                        Lat: {prayerCoords.latitude.toFixed(5)}, Lon: {prayerCoords.longitude.toFixed(5)}
                      </Text>
                    </View>
                  ) : prayerCity ? (
                    <View style={styles.prayerCardCoords}>
                      <AppIcon name="map-pin" size={12} color={colors.iconMuted} />
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
                          {checked ? <AppIcon name="check" size={14} color="#fff" /> : null}
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
                          <AppIcon name="sunset" size={14} color="rgba(61, 107, 71, 0.9)" />
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
            {"Dirigez l'aiguille vers le haut pour faire face à la Mecque"}
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
    </ScreenBackground>
  );
}

