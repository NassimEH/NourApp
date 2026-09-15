import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { HomeMosqueBlock } from "@/components/home/HomeMosqueBlock";
import { HomeSection } from "@/components/home/HomeSection";
import { HomeSectionRule } from "@/components/home/HomeSectionRule";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { weatherImages, WEATHER_DOU3A } from "@/constants/weather";
import { useAppTheme } from "@/lib/app-theme";
import { useMosqueName } from "@/lib/home/hooks/useMosqueName";
import { createHomeStyles } from "@/lib/home-screen-styles";
import { useTranslation } from "@/lib/i18n";
import {
  formatCountdownHM,
  getCurrentPrayer,
  getNextPrayerInfo,
  getNextPrayerTimestamp,
} from "@/lib/prayerUtils";
import { usePrayersChecked } from "@/lib/usePrayersChecked";
import {
  type PrayerKey,
  type PrayerTimes,
} from "@/lib/usePrayerTimes";
import { useWeather, type WeatherImageKey } from "@/lib/useWeather";

const DEFAULT_WEATHER_IMAGE: WeatherImageKey = "nuageux";
const SALAT_KEYS: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PAGE_COUNT = 2;

export interface HomePrayerWeatherCarouselProps {
  prayerLoading: boolean;
  prayerTimes: PrayerTimes | null;
  prayerCoords: { latitude: number; longitude: number } | null;
  cityName: string | null;
  gregorian: string;
  hijri: string;
  onRequestLocation: () => void;
  isFirst?: boolean;
}

export function HomePrayerWeatherCarousel({
  prayerLoading,
  prayerTimes,
  prayerCoords,
  cityName,
  gregorian,
  hijri,
  onRequestLocation,
  isFirst = true,
}: HomePrayerWeatherCarouselProps) {
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useWeather(prayerCoords?.latitude, prayerCoords?.longitude);

  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { t, rtlViewStyle } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const pageWidth = Math.round(screenWidth - SCREEN_EDGE_PADDING * 2);

  const [activePage, setActivePage] = useState(0);
  const [pageHeights, setPageHeights] = useState<[number, number]>([0, 0]);

  const { mosqueName } = useMosqueName();
  const mosqueDisplayName = mosqueName ?? t("home.defaultMosqueName");
  const { toggle: togglePrayerChecked, isChecked: isPrayerChecked } =
    usePrayersChecked();

  const [countdownNow, setCountdownNow] = useState(() => Date.now());

  const waitingLocation = !prayerCoords && prayerLoading;
  const waitingWeather = Boolean(prayerCoords) && weatherLoading && !weatherData;
  const imageKey: WeatherImageKey =
    weatherData?.imageKey ?? DEFAULT_WEATHER_IMAGE;

  const nextPrayer = prayerTimes ? getNextPrayerInfo(prayerTimes) : null;
  const currentPrayer = prayerTimes ? getCurrentPrayer(prayerTimes) : null;
  const remainingCount =
    5 - SALAT_KEYS.filter((k) => isPrayerChecked(k)).length;
  const nextPrayerTimestamp = prayerTimes
    ? getNextPrayerTimestamp(prayerTimes)
    : null;
  const nextPrayerCountdownHM = useMemo(() => {
    if (nextPrayerTimestamp == null) return null;
    const remainingSeconds = Math.max(
      0,
      Math.floor((nextPrayerTimestamp - countdownNow) / 1000)
    );
    return formatCountdownHM(remainingSeconds);
  }, [nextPrayerTimestamp, countdownNow]);

  const nextPrayerLabel = useMemo(() => {
    if (!nextPrayer || !prayerTimes) return null;
    const time = prayerTimes[nextPrayer.name as PrayerKey];
    if (!time) return t(`qibla.prayerNames.${nextPrayer.name}`);
    return t("qibla.nextPrayerAt", {
      prayer: t(`qibla.prayerNames.${nextPrayer.name}`),
      time,
    });
  }, [nextPrayer, prayerTimes, t]);

  useEffect(() => {
    if (!prayerTimes || !nextPrayer) return;
    const id = setInterval(() => setCountdownNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, [prayerTimes, nextPrayer]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / pageWidth);
      const clamped = Math.max(0, Math.min(index, PAGE_COUNT - 1));
      setActivePage((prev) => (prev === clamped ? prev : clamped));
    },
    [pageWidth]
  );

  const onPageLayout = useCallback(
    (index: 0 | 1) =>
      (e: { nativeEvent: { layout: { height: number } } }) => {
        const height = Math.ceil(e.nativeEvent.layout.height);
        if (height <= 0) return;
        setPageHeights((prev) => {
          if (prev[index] === height) return prev;
          const next: [number, number] = [...prev];
          next[index] = height;
          return next;
        });
      },
    []
  );

  const slideHeight = Math.max(pageHeights[0], pageHeights[1]) || undefined;

  const sectionTitle =
    activePage === 0 ? t("home.myWeather") : t("home.myMosque");
  const onSeeAll =
    activePage === 0
      ? () => router.push("/meteo")
      : () => router.push("/(root)/(tabs)/qibla");

  const weatherImage = (
    <View style={styles.weatherImageWrap}>
      <Image
        source={weatherImages[imageKey]}
        style={styles.weatherImage}
        resizeMode="contain"
        fadeDuration={0}
      />
    </View>
  );

  const weatherContent = (() => {
    if (waitingLocation || waitingWeather) {
      return (
        <View style={styles.weatherRow}>
          <View style={styles.weatherInfoCol}>
            <ActivityIndicator size="small" color={colors.accent} />
          </View>
          <View style={styles.weatherImageWrap}>
            <Image
              source={weatherImages[DEFAULT_WEATHER_IMAGE]}
              style={styles.weatherImage}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
        </View>
      );
    }
    if (weatherError) {
      return (
        <WeatherEmpty
          message={t(weatherError)}
          onRequestLocation={refetchWeather}
          retryLabel={t("home.retry")}
          themed={themed}
        />
      );
    }
    if (weatherData) {
      return (
        <>
          <View style={styles.weatherRow}>
            <View style={styles.weatherInfoCol}>
              <Text style={[themed.weatherTemp, styles.weatherText]}>
                {Math.round(weatherData.temperature)}°
              </Text>
              <Text style={[themed.weatherCondition, styles.weatherText]}>
                {t(weatherData.conditionKey)}
              </Text>
              <View style={styles.weatherDetailRow}>
                <AppIcon name="droplet" size={14} color={colors.iconMuted} />
                <Text style={[themed.weatherDetailText, styles.weatherText]}>
                  {t("home.humidity", { value: weatherData.humidity })}
                </Text>
              </View>
              <View style={styles.weatherDetailRow}>
                <AppIcon
                  name="thermometer"
                  size={14}
                  color={colors.iconMuted}
                />
                <Text style={[themed.weatherDetailText, styles.weatherText]}>
                  {t("home.feelsLike", {
                    value: Math.round(weatherData.apparentTemperature),
                  })}
                </Text>
              </View>
              <View style={styles.weatherDetailRow}>
                <AppIcon name="wind" size={14} color={colors.iconMuted} />
                <Text style={[themed.weatherDetailText, styles.weatherText]}>
                  {weatherData.windSpeed} km/h
                </Text>
              </View>
              <View style={styles.weatherDetailRow}>
                <AppIcon name="activity" size={14} color={colors.iconMuted} />
                <Text style={[themed.weatherDetailText, styles.weatherText]}>
                  {Math.round(weatherData.surfacePressure)} hPa
                </Text>
              </View>
              <Text style={[themed.weatherDetailText, styles.weatherText]}>
                {weatherData.isDay === 1 ? t("home.day") : t("home.night")}
              </Text>
            </View>
            {weatherImage}
          </View>
          <View style={themed.weatherDou3a}>
            <HomeSectionRule style={themed.weatherDou3aRule} />
            <Text style={themed.weatherDou3aLabel}>
              {t("home.invocation")}
            </Text>
            <Text style={themed.weatherDou3aText}>
              {t(WEATHER_DOU3A[imageKey].dou3aKey)}
            </Text>
            <Text style={themed.weatherDou3aReason}>
              {t(WEATHER_DOU3A[imageKey].reasonKey)}
            </Text>
          </View>
        </>
      );
    }
    return (
      <WeatherEmpty
        message={t("home.weatherEnableLocation")}
        onRequestLocation={onRequestLocation}
        allowLabel={t("home.allowLocation")}
        themed={themed}
      />
    );
  })();

  return (
    <HomeSection
      title={sectionTitle}
      onSeeAll={onSeeAll}
      seeAllLabel={t("home.seeAll")}
      isFirst={isFirst}
    >
      <View style={slideHeight ? { height: slideHeight } : undefined}>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={pageWidth}
          snapToAlignment="start"
          disableIntervalMomentum
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onScroll}
          contentContainerStyle={[
            styles.carouselContent,
            slideHeight ? { height: slideHeight } : null,
          ]}
          accessibilityLabel={sectionTitle}
          accessibilityHint={`${activePage + 1} / ${PAGE_COUNT}`}
        >
          <View
            style={[
              styles.page,
              { width: pageWidth },
              slideHeight ? { height: slideHeight } : null,
            ]}
          >
            <View onLayout={onPageLayout(0)} style={rtlViewStyle}>
              {weatherContent}
            </View>
          </View>

          <View
            style={[
              styles.page,
              { width: pageWidth },
              slideHeight ? { height: slideHeight } : null,
            ]}
          >
            <View onLayout={onPageLayout(1)}>
              <HomeMosqueBlock
                embedded
                compact
                prayerLoading={prayerLoading}
                prayerTimes={prayerTimes}
                mosqueDisplayName={mosqueDisplayName}
                onEditMosque={() => router.push("/(root)/mosque-settings")}
                gregorian={gregorian}
                hijri={hijri}
                cityName={cityName}
                remainingCount={remainingCount}
                currentPrayerName={currentPrayer?.name ?? null}
                nextPrayerLabel={nextPrayerLabel}
                nextPrayerCountdown={nextPrayerCountdownHM}
                isPrayerChecked={isPrayerChecked}
                onTogglePrayer={togglePrayerChecked}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      <View
        style={styles.dots}
        accessibilityRole="adjustable"
        accessibilityLabel={`${sectionTitle} ${activePage + 1} / ${PAGE_COUNT}`}
      >
        {Array.from({ length: PAGE_COUNT }).map((_, i) => {
          const active = i === activePage;
          return (
            <View
              key={`weather-mosque-dot-${i}`}
              style={[
                styles.dot,
                {
                  backgroundColor: active
                    ? colors.accent
                    : colors.isDark
                      ? "rgba(255,255,255,0.22)"
                      : "rgba(0,0,0,0.14)",
                },
                active && styles.dotActive,
              ]}
            />
          );
        })}
      </View>
    </HomeSection>
  );
}

function WeatherEmpty({
  message,
  onRequestLocation,
  retryLabel,
  allowLabel,
  themed,
}: {
  message: string;
  onRequestLocation: () => void;
  retryLabel?: string;
  allowLabel?: string;
  themed: ReturnType<typeof createHomeStyles>;
}) {
  const label = retryLabel ?? allowLabel ?? "";
  const icon = retryLabel ? "refresh-cw" : "map-pin";
  return (
    <View style={styles.weatherEmpty}>
      <Text style={themed.weatherError}>{message}</Text>
      <TouchableOpacity
        style={themed.weatherLocationButton}
        onPress={onRequestLocation}
        activeOpacity={0.7}
      >
        <AppIcon name={icon} size={18} color="#fff" />
        <Text style={themed.weatherLocationButtonText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContent: {
    alignItems: "flex-start",
  },
  page: {
    justifyContent: "flex-start",
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weatherInfoCol: {
    flex: 1,
    justifyContent: "center",
    gap: 7,
    minWidth: 0,
    paddingRight: 4,
  },
  weatherText: {
    flexShrink: 1,
    flexWrap: "wrap",
  },
  weatherImageWrap: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  weatherImage: {
    width: 228,
    height: 178,
  },
  weatherDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    flexWrap: "wrap",
  },
  weatherEmpty: {
    paddingVertical: 12,
    gap: 16,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    minHeight: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    borderRadius: 3,
  },
});
