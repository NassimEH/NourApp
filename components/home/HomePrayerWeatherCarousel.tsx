import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
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
import type { PrayerTimes } from "@/lib/usePrayerTimes";
import { useWeather } from "@/lib/useWeather";
import { SPACE } from "@/lib/ui/spacing";

const mosqueImage = require("@/assets/images/mosquee.png");

const MosqueImage = React.memo(function MosqueImage({
  compact,
}: {
  compact?: boolean;
}) {
  return (
    <View style={[styles.mosqueWrap, compact && styles.mosqueWrapCompact]}>
      <Image
        source={mosqueImage}
        style={compact ? styles.mosqueImageCompact : styles.mosqueImage}
        resizeMode="contain"
      />
    </View>
  );
});

export interface HomePrayerWeatherCarouselProps {
  prayerLoading: boolean;
  prayerTimes: PrayerTimes | null;
  prayerCoords: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
  mosqueDisplayName: string;
  onEditMosque: () => void;
}

export function HomePrayerWeatherCarousel({
  prayerLoading,
  prayerTimes,
  prayerCoords,
  onRequestLocation,
  mosqueDisplayName,
  onEditMosque,
}: HomePrayerWeatherCarouselProps) {
  const { data: weatherData, loading: weatherLoading, error: weatherError } =
    useWeather(prayerCoords?.latitude, prayerCoords?.longitude);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const slideWidth = screenWidth;

  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { t, rtlViewStyle } = useTranslation();

  return (
    <View style={[styles.carouselWrap, { width: screenWidth }, rtlViewStyle]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
          setCarouselIndex(i);
        }}
        style={[styles.carouselScroll, { width: screenWidth }]}
        contentContainerStyle={styles.carouselContent}
        decelerationRate="fast"
      >
        <View style={[styles.carouselSlide, { width: slideWidth }]}>
          <View style={styles.carouselSlideInner}>
            <SectionHeader
              title={t("home.myMosque")}
              onSeeAll={() => router.push("/mosquee")}
              style={styles.slideHeader}
            />
            {prayerLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.accent}
                style={styles.loader}
              />
            ) : prayerTimes ? (
              <View style={styles.mosqueSlideRow}>
                <View style={styles.mosquePrayerColumnFull}>
                  {(
                    [
                      { key: "Fajr", icon: "sunrise" as const, time: prayerTimes.Fajr },
                      { key: "Dhuhr", icon: "sun" as const, time: prayerTimes.Dhuhr },
                      { key: "Asr", icon: "cloud" as const, time: prayerTimes.Asr },
                      { key: "Maghrib", icon: "sunset" as const, time: prayerTimes.Maghrib },
                      { key: "Isha", icon: "moon" as const, time: prayerTimes.Isha },
                    ] as const
                  ).map(({ key, icon, time }) => (
                    <View key={key} style={styles.mosquePrayerRow}>
                      <AppIcon name={icon} size={14} color={colors.iconMuted} />
                      <View style={styles.mosquePrayerCell}>
                        <Text style={themed.mosquePrayerLabel}>{key}</Text>
                        <Text style={themed.mosquePrayerTime}>{time}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.mosqueRightBlock}>
                  <MosqueImage compact />
                  <PressableMosqueName
                    name={mosqueDisplayName}
                    onPress={onEditMosque}
                    style={themed.mosqueTitleText}
                  />
                </View>
              </View>
            ) : (
              <Text style={themed.weatherError}>{t("home.prayerUnavailable")}</Text>
            )}
          </View>
        </View>

        <View style={[styles.carouselSlide, { width: slideWidth }]}>
          <View style={styles.carouselSlideInner}>
            <SectionHeader
              title={t("home.myWeather")}
              onSeeAll={() => router.push("/meteo")}
              style={styles.slideHeader}
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
        </View>
      </ScrollView>
      <View style={styles.carouselDots}>
        <View
          style={[themed.carouselDot, carouselIndex === 0 && themed.carouselDotActive]}
        />
        <View
          style={[themed.carouselDot, carouselIndex === 1 && themed.carouselDotActive]}
        />
      </View>
    </View>
  );
}

function PressableMosqueName({
  name,
  onPress,
  style,
}: {
  name: string;
  onPress: () => void;
  style: object;
}) {
  return (
    <Pressable onPress={onPress}>
      <Text style={[style, { marginTop: 10 }]}>{name}</Text>
    </Pressable>
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
  carouselWrap: {
    marginTop: SPACE.lg + SPACE.xs,
    marginBottom: SPACE.sm,
    marginLeft: -20,
    marginRight: -20,
    overflow: "hidden",
  },
  carouselScroll: {
    flexGrow: 0,
  },
  carouselContent: {
    flexGrow: 1,
  },
  carouselSlide: {
    flex: 1,
  },
  carouselSlideInner: {
    paddingHorizontal: 24,
  },
  slideHeader: {
    marginBottom: SPACE.md,
  },
  loader: {
    paddingVertical: 20,
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  mosqueWrap: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  mosqueWrapCompact: {
    marginTop: 0,
    marginBottom: 0,
  },
  mosqueImage: {
    width: 260,
    height: 203,
  },
  mosqueImageCompact: {
    width: 140,
    height: 109,
  },
  mosqueSlideRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
  },
  mosquePrayerColumnFull: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  mosqueRightBlock: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mosquePrayerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  mosquePrayerCell: {
    flex: 1,
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
