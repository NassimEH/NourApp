import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { HomeSection } from "@/components/home/HomeSection";
import { HomeSectionRule } from "@/components/home/HomeSectionRule";
import { weatherImages, WEATHER_DOU3A } from "@/constants/weather";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import { useTranslation } from "@/lib/i18n";
import { useWeather, type WeatherImageKey } from "@/lib/useWeather";

const DEFAULT_WEATHER_IMAGE: WeatherImageKey = "nuageux";

export interface HomePrayerWeatherCarouselProps {
  prayerLoading: boolean;
  prayerCoords: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
  isFirst?: boolean;
}

export function HomePrayerWeatherCarousel({
  prayerLoading,
  prayerCoords,
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

  const waitingLocation = !prayerCoords && prayerLoading;
  const waitingWeather = Boolean(prayerCoords) && weatherLoading && !weatherData;
  const imageKey: WeatherImageKey =
    weatherData?.imageKey ?? DEFAULT_WEATHER_IMAGE;

  return (
    <HomeSection
      title={t("home.myWeather")}
      onSeeAll={() => router.push("/meteo")}
      isFirst={isFirst}
    >
      <View style={rtlViewStyle}>
        {waitingLocation ? (
          <View style={styles.weatherRow}>
            <View style={styles.weatherInfoSide}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
            <View style={styles.weatherImageWrap}>
              <Image
                source={weatherImages[DEFAULT_WEATHER_IMAGE]}
                style={styles.weatherImageStandalone}
                resizeMode="contain"
                fadeDuration={0}
              />
            </View>
            <View style={styles.weatherInfoSide} />
          </View>
        ) : weatherError ? (
          <WeatherEmpty
            message={t(weatherError)}
            onRequestLocation={refetchWeather}
            retryLabel={t("home.retry")}
            themed={themed}
          />
        ) : weatherData ? (
          <>
            <View style={styles.weatherRow}>
              <View style={styles.weatherInfoSide}>
                <Text style={themed.weatherTemp}>
                  {Math.round(weatherData.temperature)}°
                </Text>
                <Text style={themed.weatherCondition}>
                  {t(weatherData.conditionKey)}
                </Text>
                <View style={styles.weatherDetailRow}>
                  <AppIcon name="droplet" size={14} color={colors.iconMuted} />
                  <Text style={themed.weatherDetailText}>
                    {t("home.humidity", { value: weatherData.humidity })}
                  </Text>
                </View>
                <View style={styles.weatherDetailRow}>
                  <AppIcon
                    name="thermometer"
                    size={14}
                    color={colors.iconMuted}
                  />
                  <Text style={themed.weatherDetailText}>
                    {t("home.feelsLike", {
                      value: Math.round(weatherData.apparentTemperature),
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.weatherImageWrap}>
                <Image
                  source={weatherImages[imageKey]}
                  style={styles.weatherImageStandalone}
                  resizeMode="contain"
                  fadeDuration={0}
                />
              </View>
              <View style={styles.weatherInfoSide}>
                <View style={styles.weatherDetailRow}>
                  <AppIcon name="wind" size={14} color={colors.iconMuted} />
                  <Text style={themed.weatherDetailText}>
                    {weatherData.windSpeed} km/h
                  </Text>
                </View>
                <View style={styles.weatherDetailRow}>
                  <AppIcon name="activity" size={14} color={colors.iconMuted} />
                  <Text style={themed.weatherDetailText}>
                    {Math.round(weatherData.surfacePressure)} hPa
                  </Text>
                </View>
                <Text style={themed.weatherDetailText}>
                  {weatherData.isDay === 1 ? t("home.day") : t("home.night")}
                </Text>
              </View>
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
        ) : waitingWeather ? (
          <View style={styles.weatherRow}>
            <View style={styles.weatherInfoSide}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
            <View style={styles.weatherImageWrap}>
              <Image
                source={weatherImages[DEFAULT_WEATHER_IMAGE]}
                style={styles.weatherImageStandalone}
                resizeMode="contain"
                fadeDuration={0}
              />
            </View>
            <View style={styles.weatherInfoSide} />
          </View>
        ) : (
          <WeatherEmpty
            message={t("home.weatherEnableLocation")}
            onRequestLocation={onRequestLocation}
            allowLabel={t("home.allowLocation")}
            themed={themed}
          />
        )}
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
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  weatherInfoSide: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
    minWidth: 0,
  },
  weatherImageWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  weatherImageStandalone: {
    width: 200,
    height: 156,
  },
  weatherDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  weatherEmpty: {
    paddingVertical: 12,
    gap: 16,
  },
});
