import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/AppIcon";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import { useTranslation } from "@/lib/i18n";
import type { PrayerTimes } from "@/lib/usePrayerTimes";
import { SPACE } from "@/lib/ui/spacing";

const mosqueImage = require("@/assets/images/mosquee.png");

const MOSQUE_IMAGE_WIDTH = 220;
const MOSQUE_IMAGE_HEIGHT = Math.round((203 / 260) * MOSQUE_IMAGE_WIDTH);

export interface HomeMosqueBlockProps {
  prayerLoading: boolean;
  prayerTimes: PrayerTimes | null;
  mosqueDisplayName: string;
  onEditMosque: () => void;
}

export function HomeMosqueBlock({
  prayerLoading,
  prayerTimes,
  mosqueDisplayName,
  onEditMosque,
}: HomeMosqueBlockProps) {
  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { t, rtlViewStyle } = useTranslation();

  return (
    <View style={[styles.wrap, rtlViewStyle]}>
      <SectionHeader
        title={t("home.myMosque")}
        onSeeAll={() => router.push("/mosquee")}
      />
      {prayerLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.accent}
          style={styles.loader}
        />
      ) : prayerTimes ? (
        <View style={styles.row}>
          <View style={styles.prayerCol}>
            {(
              [
                { key: "Fajr", icon: "sunrise" as const, time: prayerTimes.Fajr },
                { key: "Dhuhr", icon: "sun" as const, time: prayerTimes.Dhuhr },
                { key: "Asr", icon: "cloud" as const, time: prayerTimes.Asr },
                {
                  key: "Maghrib",
                  icon: "sunset" as const,
                  time: prayerTimes.Maghrib,
                },
                { key: "Isha", icon: "moon" as const, time: prayerTimes.Isha },
              ] as const
            ).map(({ key, icon, time }) => (
              <View key={key} style={styles.prayerRow}>
                <AppIcon name={icon} size={15} color={colors.iconMuted} />
                <View style={styles.prayerCell}>
                  <Text style={themed.mosquePrayerLabel}>{key}</Text>
                  <Text style={themed.mosquePrayerTime}>{time}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.mosqueCol}>
            <Image
              source={mosqueImage}
              style={styles.mosqueImage}
              resizeMode="contain"
            />
            <Pressable onPress={onEditMosque} hitSlop={8}>
              <Text style={[themed.mosqueTitleText, styles.mosqueName]}>
                {mosqueDisplayName}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={themed.weatherError}>{t("home.prayerUnavailable")}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SPACE.lg,
  },
  loader: {
    paddingVertical: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  prayerCol: {
    flex: 1,
    gap: 4,
    minWidth: 0,
    paddingTop: 4,
  },
  prayerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 7,
  },
  prayerCell: {
    flex: 1,
  },
  mosqueCol: {
    alignItems: "center",
    width: MOSQUE_IMAGE_WIDTH + 8,
  },
  mosqueImage: {
    width: MOSQUE_IMAGE_WIDTH,
    height: MOSQUE_IMAGE_HEIGHT,
  },
  mosqueName: {
    marginTop: 12,
    textAlign: "center",
  },
});
