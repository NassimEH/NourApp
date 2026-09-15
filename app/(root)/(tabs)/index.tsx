import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { toHijri } from "hijri-converter";

import { AppIcon } from "@/components/AppIcon";
import { HomeContinueSection } from "@/components/home/HomeContinueSection";
import { HomePrayerWeatherCarousel } from "@/components/home/HomePrayerWeatherCarousel";
import { HomeToolsSection } from "@/components/home/HomeToolsSection";
import { HomeHadithDuJourSection } from "@/components/home/HomeHadithDuJourSection";
import { HomeRamadanBanner } from "@/components/home/HomeRamadanBanner";
import { rescheduleNextPrayerNotification } from "@/lib/notifications/prayer-notifications";
import { useGlobalContext } from "@/lib/global-provider";
import {
  getCurrentPrayer,
  getNextPrayerInfo,
} from "@/lib/prayerUtils";
import {
  usePrayerTimes,
  type PrayerKey,
  type PrayerTimes,
} from "@/lib/usePrayerTimes";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTypography } from "@/lib/app-typography";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import { addActivityLog } from "@/lib/activity-log";
import { useTranslation, getLocaleDateString, TRANSLATIONS } from "@/lib/i18n";
import { MIN_TOUCH_TARGET, SPACE } from "@/lib/ui/spacing";

function useTodayDates(locale: "fr" | "en" | "ar") {
  return useMemo(() => {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    const gregorian = getLocaleDateString(locale, now);
    const hijriMonths = TRANSLATIONS[locale].home.hijriMonths;
    try {
      const { hy, hm, hd } = toHijri(gy, gm, gd);
      const hijri = `${hijriMonths[hm - 1] ?? ""} ${hd}, ${hy}`;
      return { gregorian, hijri };
    } catch {
      return { gregorian, hijri: "" };
    }
  }, [locale]);
}

const HeaderBell = React.memo(function HeaderBell({
  onBellPress,
  bellLabel,
}: {
  onBellPress: () => void;
  bellLabel: string;
}) {
  const colors = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onBellPress}
      accessibilityRole="button"
      accessibilityLabel={bellLabel}
      hitSlop={12}
      style={styles.bellButton}
    >
      <AppIcon name="bell" size={24} color={colors.icon} />
    </TouchableOpacity>
  );
});

type HomeListHeaderProps = {
  user: { name?: string; avatar?: string } | null;
  gregorian: string;
  hijri: string;
  prayerTimes: PrayerTimes | null;
  prayerLoading: boolean;
  prayerCoords: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
  onBellPress: () => void;
  bellLabel: string;
};

const HomeListHeader = React.memo(function HomeListHeader({
  user,
  gregorian,
  hijri,
  prayerTimes,
  prayerLoading,
  prayerCoords,
  onRequestLocation,
  onBellPress,
  bellLabel,
}: HomeListHeaderProps) {
  const typography = useAppTypography();
  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();

  const firstName = user?.name?.trim().split(/\s+/)[0];
  const welcomeTitle = firstName
    ? `${t("home.welcome")} ${firstName}`
    : `${t("home.welcome")} ${t("home.defaultUser")}`;

  const dateLine = hijri ? `${gregorian} · ${hijri}` : gregorian;

  const prayerLine = useMemo(() => {
    if (!prayerTimes) return null;
    const current = getCurrentPrayer(prayerTimes);
    if (current) {
      const key = current.name as PrayerKey;
      const time = prayerTimes[key];
      if (!time) return null;
      return t("home.currentPrayerNow", {
        prayer: t(`qibla.prayerNames.${key}`),
        time,
      });
    }
    const next = getNextPrayerInfo(prayerTimes);
    const key = next.name as PrayerKey;
    const time = prayerTimes[key];
    if (!time) return null;
    return t("home.currentPrayerNext", {
      prayer: t(`qibla.prayerNames.${key}`),
      time,
    });
  }, [prayerTimes, t]);

  return (
    <View>
      <View style={[styles.homeHeaderBlock, rtlViewStyle]}>
        <View style={[styles.heroHeaderRow, rtlViewStyle]}>
          <View style={styles.heroTextBlock}>
            <Text
              style={[
                themed.welcomeTitle,
                rtlTextStyle,
                {
                  fontSize: typography.pageTitle * 0.92,
                  lineHeight: typography.pageTitle * 1.15,
                },
              ]}
              numberOfLines={1}
            >
              {welcomeTitle}
            </Text>
            <Text
              style={[
                themed.welcomeDate,
                rtlTextStyle,
                {
                  fontSize: typography.body,
                  lineHeight: typography.body * 1.35,
                  marginTop: 4,
                  color: colors.textMuted,
                },
              ]}
              numberOfLines={1}
            >
              {dateLine}
            </Text>
            {prayerLine ? (
              <Text
                style={[
                  themed.welcomePrayer,
                  rtlTextStyle,
                  {
                    fontSize: typography.caption,
                    lineHeight: typography.caption * 1.35,
                    color: colors.accent,
                  },
                ]}
                numberOfLines={1}
                accessibilityRole="text"
              >
                {prayerLine}
              </Text>
            ) : null}
          </View>
          <HeaderBell onBellPress={onBellPress} bellLabel={bellLabel} />
        </View>
      </View>

      <View style={[styles.homeBody, rtlViewStyle]}>
        <HomePrayerWeatherCarousel
          prayerLoading={prayerLoading}
          prayerCoords={prayerCoords}
          onRequestLocation={onRequestLocation}
          isFirst
        />

        <HomeHadithDuJourSection />

        <HomeContinueSection />

        <HomeToolsSection />

        <HomeRamadanBanner />
      </View>
    </View>
  );
});

const Home = () => {
  const { user } = useGlobalContext();
  const { locale, t: tHome } = useTranslation();
  const { gregorian, hijri } = useTodayDates(locale);
  const {
    timings: prayerTimes,
    loading: prayerLoading,
    coords: prayerCoords,
    refetch: refetchLocation,
  } = usePrayerTimes();

  useEffect(() => {
    if (prayerTimes) {
      void rescheduleNextPrayerNotification(prayerTimes);
    }
  }, [prayerTimes]);

  const handleBellPress = () => {
    void addActivityLog(tHome("reminders.title"));
    router.push("/(root)/reminders");
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView
        className="h-full bg-transparent"
        edges={["top", "left", "right"]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HomeListHeader
            user={user}
            gregorian={gregorian}
            hijri={hijri}
            prayerTimes={prayerTimes}
            prayerLoading={prayerLoading}
            prayerCoords={prayerCoords}
            onRequestLocation={refetchLocation}
            onBellPress={handleBellPress}
            bellLabel={tHome("reminders.title")}
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  homeHeaderBlock: {
    paddingTop: SPACE.sm,
    paddingHorizontal: SCREEN_EDGE_PADDING,
    marginBottom: SPACE.xs,
  },
  heroHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  heroTextBlock: { flex: 1 },
  bellButton: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
  },
  homeBody: { paddingHorizontal: SCREEN_EDGE_PADDING },
  scrollContent: { paddingBottom: 160 },
});

export default Home;
