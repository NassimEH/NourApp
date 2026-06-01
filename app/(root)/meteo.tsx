import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon } from "@/components/AppIcon";

import { usePrayerTimes } from "@/lib/usePrayerTimes";
import { useWeather } from "@/lib/useWeather";
import { weatherImages, WEATHER_DOU3A } from "@/constants/weather";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { useTranslation } from "@/lib/i18n";
import { useAppTheme } from "@/lib/app-theme";

const H_PADDING = SCREEN_EDGE_PADDING;

export default function MeteoScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();
  const { coords: prayerCoords, refetch: refetchLocation } = usePrayerTimes();
  const { data: weatherData, loading: weatherLoading, error: weatherError } = useWeather(
    prayerCoords?.latitude,
    prayerCoords?.longitude
  );

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenPageHeader
          title={t("screens.weatherTitle")}
          subtitle={t("screens.weatherSubtitle")}
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {!prayerCoords && (
            <View style={styles.weatherEmpty}>
              <Text style={styles.errorText}>Active la localisation pour afficher la mùtùo</Text>
              <TouchableOpacity style={styles.locationButton} onPress={refetchLocation} activeOpacity={0.7}>
                <AppIcon name="map-pin" size={18} color="#fff" />
                <Text style={styles.locationButtonText}>Autoriser la localisation</Text>
              </TouchableOpacity>
            </View>
          )}
          {prayerCoords && weatherLoading && (
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={{ marginVertical: 40 }}
            />
          )}
          {prayerCoords && weatherError && (
            <View style={styles.weatherEmpty}>
              <Text style={styles.errorText}>{weatherError}</Text>
              <TouchableOpacity style={styles.locationButton} onPress={refetchLocation} activeOpacity={0.7}>
                <AppIcon name="refresh-cw" size={18} color="#fff" />
                <Text style={styles.locationButtonText}>Rùessayer</Text>
              </TouchableOpacity>
            </View>
          )}
          {prayerCoords && weatherData && (
            <>
              <View style={styles.weatherImageHero}>
                <Image
                  source={weatherImages[weatherData.imageKey]}
                  style={styles.weatherImageLarge}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.weatherImageCaption}>
                <Text style={[styles.weatherCityLabel, { color: colors.textMuted }]}>
                  Ma ville
                </Text>
                <Text style={[styles.weatherConditionHero, { color: colors.text }]}>
                  {weatherData.conditionLabel}
                </Text>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherMainRow}>
                  <Text style={[styles.weatherTempLarge, { color: colors.text }]}>{Math.round(weatherData.temperature)}ù</Text>
                  <View style={styles.weatherMeta}>
                    <View style={styles.weatherDetailRow}>
                      <AppIcon name="droplet" size={16} color="#5b5d5e" />
                      <Text style={styles.weatherDetailText}>{weatherData.humidity} % humiditù</Text>
                    </View>
                    <View style={styles.weatherDetailRow}>
                      <AppIcon name="thermometer" size={16} color="#5b5d5e" />
                      <Text style={styles.weatherDetailText}>Ressenti {Math.round(weatherData.apparentTemperature)}ù</Text>
                    </View>
                    <View style={styles.weatherDetailRow}>
                      <AppIcon name="wind" size={16} color="#5b5d5e" />
                      <Text style={styles.weatherDetailText}>{weatherData.windSpeed} km/h</Text>
                    </View>
                    <View style={styles.weatherDetailRow}>
                      <AppIcon name="activity" size={16} color="#5b5d5e" />
                      <Text style={styles.weatherDetailText}>{Math.round(weatherData.surfacePressure)} hPa</Text>
                    </View>
                    <Text style={styles.weatherDayNight}>
                      {weatherData.isDay === 1 ? "Jour" : "Nuit"}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.dou3aBlock}>
                <Text style={[styles.dou3aLabel, { color: colors.accent }]}>Invocation</Text>
                <Text style={[styles.dou3aText, { color: colors.text }]}>
                  {WEATHER_DOU3A[weatherData.imageKey].dou3a}
                </Text>
                <Text style={[styles.dou3aReason, { color: colors.textMuted }]}>
                  {WEATHER_DOU3A[weatherData.imageKey].reason}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: H_PADDING,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
  },
  backBtn: { paddingVertical: 8, paddingLeft: 8 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: H_PADDING, paddingBottom: 100 },
  weatherEmpty: { paddingVertical: 24, gap: 20 },
  errorText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    marginVertical: 20,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(61, 107, 71, 0.9)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  locationButtonText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
  weatherImageHero: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
  },
  weatherImageLarge: { width: "100%", height: "100%" },
  weatherImageCaption: {
    marginBottom: 20,
  },
  weatherCityLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#5b5d5e",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  weatherConditionHero: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
  },
  weatherDetails: { marginBottom: 24 },
  weatherMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
  },
  weatherTempLarge: {
    fontSize: 48,
    fontFamily: "PlusJakartaSans-Bold",
  },
  weatherMeta: {
    flex: 1,
    gap: 10,
    marginLeft: 32,
  },
  weatherDetailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  weatherDetailText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#5b5d5e",
  },
  weatherDayNight: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
    marginTop: 4,
  },
  dou3aBlock: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    gap: 8,
  },
  dou3aLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "rgba(61, 107, 71, 0.9)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dou3aText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-Medium",
    lineHeight: 24,
  },
  dou3aReason: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#5b5d5e",
    lineHeight: 20,
    fontStyle: "italic",
  },
});
