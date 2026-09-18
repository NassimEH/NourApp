import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { toHijri } from "hijri-converter";

import { HomeMosqueBlock } from "@/components/home/HomeMosqueBlock";
import { PrayerLocationSearchBar } from "@/components/prayers/PrayerLocationSearchBar";
import { ScreenBackground } from "@/components/ScreenBackground";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";
import { screenPageHeaderSpacing } from "@/constants/screen-layout";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useMosqueName } from "@/lib/home/hooks/useMosqueName";
import { TRANSLATIONS, useTranslation } from "@/lib/i18n";
import {
  formatCountdownHM,
  getCurrentPrayer,
  getNextPrayerInfo,
  getNextPrayerTimestamp,
} from "@/lib/prayerUtils";
import { createQiblaStyles } from "@/lib/qibla-screen-styles";
import {
  usePrayerTimes,
  type PrayerKey,
} from "@/lib/usePrayerTimes";
import { usePrayersChecked } from "@/lib/usePrayersChecked";

const SALAT_KEYS: PrayerKey[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function useTodayDates(
  locale: "fr" | "en" | "ar",
  hijriMonths: readonly string[]
) {
  return useMemo(() => {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    const gregorian = now.toLocaleDateString(
      locale === "ar" ? "ar-SA" : locale === "en" ? "en-US" : "fr-FR",
      { day: "numeric", month: "long", year: "numeric" }
    );
    try {
      const { hy, hm, hd } = toHijri(gy, gm, gd);
      const month = hijriMonths[hm - 1] ?? "";
      const hijri = `${hd} ${month} ${hy}`;
      return { gregorian, hijri };
    } catch {
      return { gregorian, hijri: "" };
    }
  }, [hijriMonths, locale]);
}

/** Onglet Mes prières — recherche + section mosquée / prières. */
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
  const { toggle: togglePrayerChecked, isChecked: isPrayerChecked } =
    usePrayersChecked();
  const { mosqueName } = useMosqueName();
  const mosqueDisplayName = mosqueName ?? t("home.defaultMosqueName");

  const [countdownNow, setCountdownNow] = useState(() => Date.now());
  const [locationQuery, setLocationQuery] = useState("");

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
            gregorian={gregorian}
            hijri={hijri}
            cityName={prayerCity}
            remainingCount={remainingCount}
            currentPrayerName={currentPrayer?.name ?? null}
            nextPrayerLabel={nextPrayerLabel}
            nextPrayerCountdown={nextPrayerCountdownHM}
            isPrayerChecked={isPrayerChecked}
            onTogglePrayer={togglePrayerChecked}
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}
