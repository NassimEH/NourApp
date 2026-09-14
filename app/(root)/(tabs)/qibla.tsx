import React, { useEffect, useState, useMemo } from "react";
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
  type PrayerKey,
} from "@/lib/usePrayerTimes";
import { usePrayersChecked } from "@/lib/usePrayersChecked";
import { toHijri } from "hijri-converter";
import { ScreenBackground } from "@/components/ScreenBackground";
import { screenPageHeaderSpacing } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { TRANSLATIONS, useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { createQiblaStyles } from "@/lib/qibla-screen-styles";
import { useMosqueName } from "@/lib/home/hooks/useMosqueName";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COMPASS_SIZE = Math.min(SCREEN_WIDTH - 64, 260);
const SALAT_KEYS: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

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
  const typography = useAppTypography();
  const styles = useMemo(
    () => createQiblaStyles(colors, typography),
    [colors, typography]
  );
  const hijriMonths = TRANSLATIONS[locale].home.hijriMonths;
  const { gregorian, hijri } = useTodayDates(locale, hijriMonths);
  const {
    timings: prayerTimes,
    loading: prayerLoading,
    applyingLocation,
    cityName: prayerCity,
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

  const [needleAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!prayerCity) return;
    const timeout = setTimeout(() => setLocationQuery(prayerCity), 0);
    return () => clearTimeout(timeout);
  }, [prayerCity]);

  const handleLocationSubmit = async () => {
    const result = await applyLocationByQuery(locationQuery);
    if (!result.ok && result.reason !== "empty") {
      Alert.alert(t("screens.prayersTitle"), t("screens.prayersLocationError"));
    }
  };

  const nextPrayer = prayerTimes ? getNextPrayerInfo(prayerTimes) : null;
  const currentPrayer = prayerTimes ? getCurrentPrayer(prayerTimes) : null;
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
        if (!cancelled) setCompassError(t("qibla.positionUnavailable"));
      }
    })();
    return () => { cancelled = true; };
  }, [t]);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }
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
            {t("qibla.prayersSection")}{prayerCity ? ` — ${prayerCity}` : ""}
          </Text>
          <View style={styles.prayerCard}>
            {prayerLoading ? (
              <ActivityIndicator size="small" color={colors.accent} style={{ paddingVertical: 24 }} />
            ) : prayerTimes ? (
              <>
                <View style={styles.prayerCardHeader}>
                  {hijri ? <Text style={styles.prayerCardHijri}>{hijri}</Text> : null}
                  <Text style={styles.prayerCardGregorian}>{gregorian}</Text>
                  {prayerCity ? (
                    <View style={styles.prayerCardCoords}>
                      <AppIcon name="map-pin" size={12} color={colors.iconMuted} />
                      <Text style={styles.prayerCardCoordsText}>{prayerCity}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.prayerCardRemaining}>
                    {t(
                      remainingCount === 1
                        ? "qibla.remainingPrayer"
                        : "qibla.remainingPrayers",
                      { count: remainingCount }
                    )}
                  </Text>
                </View>
                {PRAYER_ORDER.filter((k) => k !== "Sunrise").map((key, index) => {
                  const prayerKey = key as PrayerKey;
                  const checked = isPrayerChecked(prayerKey);
                  const isCurrent = currentPrayer?.name === prayerKey;
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
                          {t(`qibla.prayerNames.${prayerKey}`)}
                        </Text>
                        <View style={styles.prayerRowTimeRow}>
                          {isCurrent && <View style={styles.prayerRowCurrentDot} />}
                          <Text style={styles.prayerRowTime}>{prayerTimes[prayerKey]}</Text>
                        </View>
                      </View>
                      <View style={styles.prayerRowCheckboxWrap}>
                        <View style={[styles.prayerCheckbox, checked && styles.prayerCheckboxChecked]}>
                          {checked ? <AppIcon name="check" size={14} color={colors.onAccent} /> : null}
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
                        <Text style={styles.prayerNextLabel}>{t("qibla.nextPrayer")}</Text>
                        <View style={styles.prayerNextWidgetRow}>
                          <AppIcon name="sunset" size={14} color={colors.accent} />
                          <Text style={styles.prayerNextText}>
                            {nextPrayerTimeStr
                              ? t("qibla.nextPrayerAt", {
                                  prayer: t(`qibla.prayerNames.${nextPrayer.name}`),
                                  time: nextPrayerTimeStr,
                                })
                              : t(`qibla.prayerNames.${nextPrayer.name}`)}
                          </Text>
                        </View>
                      </View>
                      {nextPrayerCountdownHM != null && (
                        <Text style={styles.prayerNextCountdown}>{nextPrayerCountdownHM}</Text>
                      )}
                    </View>
                  </>
                )}
              </>
            ) : (
              <Text style={styles.prayerUnavailable}>{t("qibla.prayerUnavailable")}</Text>
            )}
          </View>
        </View>

        {/* Section Qibla */}
        <View style={styles.qiblaSection}>
          <Text style={styles.sectionLabel}>{t("qibla.title")}</Text>
          <Text style={styles.qiblaSubtitle}>
            {t("qibla.instructions")}
          </Text>

          {displayedCompassError ? (
            <View style={styles.compassError}>
              <Text style={styles.compassErrorText}>{displayedCompassError}</Text>
              {bearing !== null && (
                <Text style={styles.qiblaAngle}>
                  {t("qibla.angle", { angle: Math.round(bearing) })}
                </Text>
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
                <Text style={styles.qiblaAngle}>
                  {t("qibla.bearing", { angle: Math.round(bearing) })}
                </Text>
              )}
            </>
          )}
        </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

