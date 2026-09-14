import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import { router, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { toHijri } from "hijri-converter";

import { AppIcon } from "@/components/AppIcon";
import {
  isVendredi,
  getHadithVendrediDuJour,
  getHadithVendrediText,
} from "@/constants/hadithsVendredi";
import { HomeContinueSection } from "@/components/home/HomeContinueSection";
import { HomePrayerWeatherCarousel } from "@/components/home/HomePrayerWeatherCarousel";
import { HomeToolsSection } from "@/components/home/HomeToolsSection";
import { HomeHadithDuJourSection } from "@/components/home/HomeHadithDuJourSection";
import { HomeRamadanBanner } from "@/components/home/HomeRamadanBanner";
import { rescheduleNextPrayerNotification } from "@/lib/notifications/prayer-notifications";
import { useGlobalContext } from "@/lib/global-provider";
import { usePrayerTimes } from "@/lib/usePrayerTimes";
import { ScreenBackground } from "@/components/ScreenBackground";
import { SCREEN_EDGE_PADDING } from "@/constants/screen-layout";
import { useAppTypography } from "@/lib/app-typography";
import { useAppTheme } from "@/lib/app-theme";
import { createHomeStyles } from "@/lib/home-screen-styles";
import { addActivityLog } from "@/lib/activity-log";
import { useTranslation, getLocaleDateString, TRANSLATIONS } from "@/lib/i18n";
import { MIN_TOUCH_TARGET } from "@/lib/ui/spacing";

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
      <AppIcon name="bell" size={28} color={colors.icon} />
    </TouchableOpacity>
  );
});

type HomeListHeaderProps = {
  user: { name?: string; avatar?: string } | null;
  gregorian: string;
  hijri: string;
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
  prayerLoading,
  prayerCoords,
  onRequestLocation,
  onBellPress,
  bellLabel,
}: HomeListHeaderProps) {
  const vendredi = isVendredi();
  const hadithVendredi = getHadithVendrediDuJour();

  const typography = useAppTypography();
  const colors = useAppTheme();
  const themed = useMemo(() => createHomeStyles(colors), [colors]);
  const { t, locale, rtlTextStyle, rtlViewStyle } = useTranslation();

  const welcomeTitle = `${t("home.welcome")}${
    user?.name ? ` ${user.name}` : ` ${t("home.defaultUser")}`
  }`;
  const subtitle = vendredi
    ? `${t("home.goodFriday")} · ${gregorian}`
    : gregorian;

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
                  fontSize: typography.pageTitle,
                  lineHeight: typography.pageTitle * 1.2,
                },
              ]}
              numberOfLines={2}
            >
              {welcomeTitle}
            </Text>
            <Text
              style={[
                themed.welcomeDate,
                rtlTextStyle,
                {
                  fontSize: typography.subtitle,
                  lineHeight: typography.subtitle * 1.35,
                  marginTop: 6,
                },
              ]}
            >
              {subtitle}
            </Text>
            {hijri ? (
              <Text
                style={[
                  themed.welcomeHijri,
                  rtlTextStyle,
                  {
                    fontSize: typography.body,
                    lineHeight: typography.body * 1.4,
                    marginTop: 2,
                  },
                ]}
              >
                {hijri}
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
        />

        <HomeContinueSection />

        {vendredi && hadithVendredi ? (
          <Pressable
            onPress={() => router.push("/(root)/hadith-friday" as Href)}
            style={({ pressed }) => [
              themed.hadithVendrediBlock,
              pressed && { opacity: 0.92 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={t("home.hadithFridayLabel")}
          >
            <Text style={themed.hadithVendrediLabel}>
              {t("home.hadithFridayLabel")}
            </Text>
            <Text style={themed.hadithVendrediText}>
              {getHadithVendrediText(hadithVendredi, locale)}
            </Text>
            <Text style={themed.hadithVendrediSource}>
              {hadithVendredi.source}
            </Text>
          </Pressable>
        ) : null}

        <HomeHadithDuJourSection />
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
    paddingTop: 20,
    paddingHorizontal: SCREEN_EDGE_PADDING,
    marginTop: 8,
    marginBottom: 8,
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
  scrollContent: { paddingBottom: 120 },
});

export default Home;
