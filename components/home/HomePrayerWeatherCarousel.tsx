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
import { SectionHeader } from "@/components/SectionHeader";
import { weatherImages, WEATHER_DOU3A } from "@/constants/weather";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import { useTranslation } from "@/lib/i18n";
import { useWeather } from "@/lib/useWeather";
import { SPACE } from "@/lib/ui/spacing";

export interface HomePrayerWeatherCarouselProps {
  prayerLoading: boolean;
  prayerCoords: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
}

export function HomePrayerWeatherCarousel({
  prayerLoading,
  prayerCoords,
  onRequestLocation,
}: HomePrayerWeatherCarouselProps) {
  const { data: weatherData, loading: weatherLoading, error: weatherError } =
    useWeather(prayerCoords?.latitude, prayerCoords?.longitude);

  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { t, rtlViewStyle } = useTranslation();

  return (
    <View style={[styles.wrap, rtlViewStyle]}>
      <SectionHeader
        title={t("home.myWeather")}
        onSeeAll={() => router.push("/meteo")}
        style={styles.header}
      />
      {!prayerCoords && prayerLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={styles.loader}
        />
      ) : weatherLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={styles.loader}
        />
      ) : weatherError ? (
        <WeatherEmpty
          message={weatherError}
          onRequestLocation={onRequestLocation}
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
                {weatherData.conditionLabel}
              </Text>
              <View style={styles.weatherDetailRow}>
                <AppIcon name="droplet" size={14} color={colors.iconMuted} />
                <Text style={themed.weatherDetailText}>
                  {t("home.humidity", { value: weatherData.humidity })}
                </Text>
              </View>
              <View style={styles.weatherDetailRow}>
                <AppIcon name="thermometer" size={14} color={colors.iconMuted} />
                <Text style={themed.weatherDetailText}>
                  {t("home.feelsLike", {
                    value: Math.round(weatherData.apparentTemperature),
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.weatherImageWrap}>
              <Image
                source={weatherImages[weatherData.imageKey]}
                style={styles.weatherImageStandalone}
                resizeMode="contain"
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
            <Text style={themed.weatherDou3aLabel}>{t("home.invocation")}</Text>
            <Text style={themed.weatherDou3aText}>
              {WEATHER_DOU3A[weatherData.imageKey].dou3a}
            </Text>
            <Text style={themed.weatherDou3aReason}>
              {WEATHER_DOU3A[weatherData.imageKey].reason}
            </Text>
          </View>
        </>
      ) : (
        <WeatherEmpty
          message={t("home.weatherEnableLocation")}
          onRequestLocation={onRequestLocation}
          allowLabel={t("home.allowLocation")}
          themed={themed}
        />
      )}
    </View>
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
  wrap: {
    marginTop: SPACE.lg + SPACE.xs,
    marginBottom: SPACE.sm,
  },
  header: {
    marginBottom: SPACE.md,
  },
  loader: {
    paddingVertical: 20,
  },
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
