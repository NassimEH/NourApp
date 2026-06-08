import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { ScreenStackLayout } from "@/components/ScreenStackLayout";
import { WEATHER_DOU3A } from "@/constants/weather";
import type { WeatherImageKey } from "@/lib/useWeather";
import { useAppTheme } from "@/lib/app-theme";
import { useTranslation } from "@/lib/i18n";

const WEATHER_KEYS = Object.keys(WEATHER_DOU3A) as WeatherImageKey[];

export default function InvocationsMeteoScreen() {
  const { t } = useTranslation();
  const colors = useAppTheme();

  return (
    <ScreenStackLayout
      title={t("screens.invocationsWeatherTitle")}
      subtitle={t("screens.invocationsWeatherSubtitle")}
    >
      <TouchableOpacity
        style={[
          styles.toolLink,
          { borderColor: colors.border, backgroundColor: colors.accentSurface },
        ]}
        onPress={() => router.push("/(root)/meteo")}
        activeOpacity={0.85}
      >
        <AppIcon name="cloud" size={20} color={colors.accent} />
        <Text style={[styles.toolLinkText, { color: colors.text }]}>
          {t("screens.invocationsWeatherOpenTool")}
        </Text>
        <AppIcon name="chevron-right" size={18} color={colors.iconMuted} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {WEATHER_KEYS.map((key) => {
          const item = WEATHER_DOU3A[key];
          return (
            <View
              key={key}
              style={[
                styles.card,
                { borderColor: colors.border, backgroundColor: colors.cardElevated },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t(`weather.${key}`)}
              </Text>
              <Text style={[styles.dou3a, { color: colors.text }]}>{item.dou3a}</Text>
              <Text style={[styles.reason, { color: colors.textMuted }]}>{item.reason}</Text>
            </View>
          );
        })}
      </ScrollView>
    </ScreenStackLayout>
  );
}

const styles = StyleSheet.create({
  toolLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  toolLinkText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans-SemiBold",
    textTransform: "capitalize",
  },
  dou3a: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 22,
  },
  reason: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 19,
    fontStyle: "italic",
  },
});
